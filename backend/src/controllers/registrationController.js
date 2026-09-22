const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

/**
 * Concurrency-safe atomic registration
 */
async function registerForCompetition(req, res) {
  try {
    const { competitionId, userId, userName, userEmail } = req.body;

    if (!competitionId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'competitionId and userId are required fields.',
      });
    }

    // 1. Verify competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    // 2. Check if user is already registered (idempotency check)
    const existingRegistration = await Registration.findOne({ competitionId, userId });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'User is already registered for this competition.',
        data: existingRegistration,
      });
    }

    // 3. Atomically reserve spot using MongoDB $expr condition
    // Ensures bookedSpots < totalSpots atomically at database level
    const updatedCompetition = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
      },
      {
        $inc: { bookedSpots: 1 },
      },
      {
        new: true,
      }
    );

    if (!updatedCompetition) {
      return res.status(400).json({
        success: false,
        message: 'Registration full! No spots remaining in this competition.',
      });
    }

    // 4. Create Registration document
    try {
      const registration = await Registration.create({
        competitionId,
        userId,
        userName: userName || 'Participant',
        userEmail: userEmail || `${userId}@feedants.user`,
        amount: competition.entryFee,
        paymentStatus: 'paid',
        paymentId: `pay_razor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        registeredAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Successfully registered for competition!',
        data: {
          registration,
          updatedSpotsLeft: Math.max(0, updatedCompetition.totalSpots - updatedCompetition.bookedSpots),
          updatedBookedSpots: updatedCompetition.bookedSpots,
        },
      });
    } catch (createErr) {
      // Roll back spot reservation if registration insert failed (e.g. race on duplicate key)
      await Competition.findByIdAndUpdate(competitionId, {
        $inc: { bookedSpots: -1 },
      });

      if (createErr.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'User is already registered for this competition.',
        });
      }
      throw createErr;
    }
  } catch (error) {
    console.error('Error in registerForCompetition:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration.',
      error: error.message,
    });
  }
}

/**
 * Get user registration status
 */
async function getRegistrationStatus(req, res) {
  try {
    const { competitionId, userId } = req.params;
    const registration = await Registration.findOne({ competitionId, userId });

    return res.status(200).json({
      success: true,
      data: {
        isRegistered: !!registration,
        registration,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  registerForCompetition,
  getRegistrationStatus,
};
