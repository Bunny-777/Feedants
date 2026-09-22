const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

/**
 * Submit entry for a competition
 */
async function uploadSubmission(req, res) {
  try {
    const { competitionId, userId, userName, title, videoUrl, danceForm, description } = req.body;

    if (!competitionId || !userId || !title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'competitionId, userId, title, and videoUrl are required.',
      });
    }

    // 1. Verify user is registered
    const registration = await Registration.findOne({ competitionId, userId });
    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Only registered participants are allowed to submit entries.',
      });
    }

    // 2. Check if existing submission already exists (allow update or return existing)
    let submission = await Submission.findOne({ competitionId, userId });
    if (submission) {
      submission.title = title;
      submission.videoUrl = videoUrl;
      submission.danceForm = danceForm || submission.danceForm;
      submission.description = description || submission.description;
      submission.submittedAt = new Date();
      await submission.save();

      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully!',
        data: submission,
      });
    }

    // 3. Create new submission
    submission = await Submission.create({
      competitionId,
      userId,
      userName: userName || registration.userName,
      title,
      videoUrl,
      danceForm: danceForm || 'Kathak',
      description: description || '',
      status: 'submitted',
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Submission uploaded successfully!',
      data: submission,
    });
  } catch (error) {
    console.error('Error in uploadSubmission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload submission.',
      error: error.message,
    });
  }
}

/**
 * Get user submission
 */
async function getUserSubmission(req, res) {
  try {
    const { competitionId, userId } = req.params;
    const submission = await Submission.findOne({ competitionId, userId });

    return res.status(200).json({
      success: true,
      data: {
        hasSubmitted: !!submission,
        submission,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  uploadSubmission,
  getUserSubmission,
};
