const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { applyToJob } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('company'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('company'), updateJob)
  .delete(protect, authorize('company'), deleteJob);

router.post('/:id/apply', protect, authorize('developer'), applyToJob);

module.exports = router;
