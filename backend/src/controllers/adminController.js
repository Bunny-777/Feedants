const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const seedDatabase = require('../seed/seedData');

/**
 * Reset competition data to fresh seed state
 */
async function resetState(req, res) {
  try {
    const competition = await seedDatabase();
    return res.status(200).json({
      success: true,
      message: 'Competition reset to fresh initial state.',
      data: competition,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Simulate concurrent rush (stress test concurrency safety)
 */
async function simulateConcurrencyRush(req, res) {
  try {
    const { count = 10, slug = 'feedants-classical-dance' } = req.body;
    const competition = await Competition.findOne({ slug });

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    const initialSpots = competition.bookedSpots;
    const promises = [];

    // Dispatch concurrent registration attempts
    for (let i = 0; i < count; i++) {
      const simulatedUserId = `sim_user_${Date.now()}_${i}`;
      promises.push(
        (async () => {
          try {
            const updated = await Competition.findOneAndUpdate(
              {
                _id: competition._id,
                $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
              },
              { $inc: { bookedSpots: 1 } },
              { new: true }
            );

            if (!updated) {
              return { success: false, userId: simulatedUserId, reason: 'Sold Out' };
            }

            await Registration.create({
              competitionId: competition._id,
              userId: simulatedUserId,
              userName: `Simulated User ${i + 1}`,
              userEmail: `${simulatedUserId}@rush.test`,
              amount: competition.entryFee,
              paymentStatus: 'paid',
            });

            return { success: true, userId: simulatedUserId };
          } catch (err) {
            // rollback
            await Competition.findByIdAndUpdate(competition._id, { $inc: { bookedSpots: -1 } });
            return { success: false, userId: simulatedUserId, error: err.message };
          }
        })()
      );
    }

    const results = await Promise.all(promises);
    const successful = results.filter((r) => r.success).length;
    const rejected = results.filter((r) => !r.success).length;

    const finalComp = await Competition.findById(competition._id);

    return res.status(200).json({
      success: true,
      summary: {
        attempted: count,
        successfulRegistrations: successful,
        rejectedDueToCapacity: rejected,
        initialBookedSpots: initialSpots,
        finalBookedSpots: finalComp.bookedSpots,
        totalSpots: finalComp.totalSpots,
        remainingSpots: Math.max(0, finalComp.totalSpots - finalComp.bookedSpots),
        concurrencySafe: finalComp.bookedSpots <= finalComp.totalSpots,
      },
      results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Quick toggle spots for testing edge cases (e.g. 19 booked, 20 booked)
 */
async function setSpots(req, res) {
  try {
    const { bookedSpots, slug = 'feedants-classical-dance' } = req.body;
    const competition = await Competition.findOneAndUpdate(
      { slug },
      { bookedSpots: Number(bookedSpots) },
      { new: true }
    );
    return res.status(200).json({ success: true, data: competition });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  resetState,
  simulateConcurrencyRush,
  setSpots,
};
