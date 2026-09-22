const express = require('express');
const router = express.Router();

const {
  getCompetitionDetails,
  getAllCompetitions,
  getAllUsers,
  getUserProfile,
} = require('../controllers/competitionController');

const {
  registerForCompetition,
  getRegistrationStatus,
} = require('../controllers/registrationController');

const {
  uploadSubmission,
  getUserSubmission,
} = require('../controllers/submissionController');

const {
  resetState,
  simulateConcurrencyRush,
  setSpots,
} = require('../controllers/adminController');

// Public Competition Routes
router.get('/competitions', getAllCompetitions);
router.get('/competitions/:slug', getCompetitionDetails);

// Users & Profile Routes
router.get('/users', getAllUsers);
router.get('/users/:userId/profile', getUserProfile);

// Registration Routes
router.post('/registrations', registerForCompetition);
router.get('/registrations/:competitionId/:userId', getRegistrationStatus);

// Submission Routes
router.post('/submissions', uploadSubmission);
router.get('/submissions/:competitionId/:userId', getUserSubmission);

// Admin & Testing Controls
router.post('/admin/reset', resetState);
router.post('/admin/simulate-rush', simulateConcurrencyRush);
router.post('/admin/set-spots', setSpots);

module.exports = router;
