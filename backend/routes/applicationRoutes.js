const express = require('express');
const {
  getDeveloperApplications,
  getCompanyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, authorize('developer'), getDeveloperApplications);
router.get('/company', protect, authorize('company'), getCompanyApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

module.exports = router;
