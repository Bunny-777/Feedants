const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

/**
 * Get competition details with dynamic status and user-specific state
 */
async function getCompetitionDetails(req, res) {
  try {
    const slug = req.params.slug || 'feedants-classical-dance';
    const userId = req.query.userId || 'user_registered_01'; // Default to registered demo user matching screenshot

    const competition = await Competition.findOne({ slug });
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Check user registration state
    let userRegistration = null;
    let userSubmission = null;

    if (userId) {
      userRegistration = await Registration.findOne({
        competitionId: competition._id,
        userId: userId,
      });

      if (userRegistration) {
        userSubmission = await Submission.findOne({
          competitionId: competition._id,
          userId: userId,
        });
      }
    }

    // Calculate dynamic lifecycle status
    const now = new Date();
    const isRegistrationClosed = now > competition.importantDates.registerBefore || competition.bookedSpots >= competition.totalSpots;
    const isSubmissionOpen = now >= competition.importantDates.submissionStarts && now <= competition.importantDates.submissionEnds;
    const isSubmissionClosed = now > competition.importantDates.submissionEnds;

    // Remaining spots
    const spotsLeft = Math.max(0, competition.totalSpots - competition.bookedSpots);
    const spotsBooked = competition.bookedSpots;

    return res.status(200).json({
      success: true,
      data: {
        ...competition.toObject(),
        spotsLeft,
        spotsBooked,
        userState: {
          userId,
          isRegistered: !!userRegistration,
          registrationDetails: userRegistration || null,
          hasSubmitted: !!userSubmission,
          submissionDetails: userSubmission || null,
          canUploadSubmission: !!userRegistration,
        },
        lifecycle: {
          isRegistrationClosed,
          isSubmissionOpen,
          isSubmissionClosed,
          currentTime: now,
        },
      },
    });
  } catch (error) {
    console.error('Error in getCompetitionDetails:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

/**
 * List all competitions with user registration state
 */
async function getAllCompetitions(req, res) {
  try {
    const userId = req.query.userId;
    const competitions = await Competition.find().sort({ createdAt: -1 });

    let registeredCompIds = new Set();
    if (userId) {
      const userRegs = await Registration.find({ userId }).select('competitionId');
      registeredCompIds = new Set(userRegs.map((r) => r.competitionId.toString()));
    }

    const data = competitions.map((comp) => {
      const spotsLeft = Math.max(0, comp.totalSpots - comp.bookedSpots);
      return {
        ...comp.toObject(),
        spotsLeft,
        isRegistered: registeredCompIds.has(comp._id.toString()),
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get user profile summary with registrations and submissions
 */
async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const User = require('../models/User');
    const user = await User.findOne({ userId }) || {
      userId,
      name: userId === 'user_unregistered_02' ? 'Priya Patel' : userId === 'user_submitted_03' ? 'Rohit Verma' : 'Kushal Sharma',
      email: `${userId}@feedants.com`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };

    const registrations = await Registration.find({ userId }).populate('competitionId');
    const submissions = await Submission.find({ userId }).populate('competitionId');

    return res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          competitionsJoined: registrations.length,
          submissionsMade: submissions.length,
          certificatesEarned: registrations.length > 0 ? 1 : 0,
          walletBalance: 250,
        },
        registrations,
        submissions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCompetitionDetails,
  getAllCompetitions,
  getUserProfile,
};
