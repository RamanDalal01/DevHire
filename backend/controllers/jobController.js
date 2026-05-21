const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all jobs (with query search and filtering)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const queryObj = { isActive: true };

    // Search query (text search on title/description)
    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Location filter
    if (req.query.location) {
      queryObj.location = { $regex: req.query.location, $options: 'i' };
    }

    // Job Type filter
    if (req.query.jobType) {
      queryObj.jobType = req.query.jobType;
    }

    // Tech Stack filter (comma separated, match any of them)
    if (req.query.techStack) {
      const skills = req.query.techStack
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      if (skills.length > 0) {
        // Find jobs that have at least one of these skills in their techStack array
        queryObj.techStack = {
          $in: skills.map((s) => new RegExp(`^${s}$`, 'i')),
        };
      }
    }

    // Salary Min filter
    if (req.query.salaryMin) {
      queryObj.salaryMin = { $gte: Number(req.query.salaryMin) };
    }

    // Salary Max filter
    if (req.query.salaryMax) {
      if (queryObj.salaryMin) {
        queryObj.salaryMax = { $lte: Number(req.query.salaryMax) };
      } else {
        queryObj.salaryMax = { $lte: Number(req.query.salaryMax) };
      }
    }

    // Execute query, populating company details
    const jobs = await Job.find(queryObj)
      .populate('postedBy', 'name companyName website description email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name companyName website description email'
    );

    if (!job) {
      return next(new ErrorResponse('Job not found.', 404));
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Company only)
exports.createJob = async (req, res, next) => {
  try {
    // Add user to req.body.postedBy
    req.body.postedBy = req.user.id;

    // Check that we have a companyName populated in profile (optional check, but good validation)
    if (!req.user.companyName) {
      console.warn('Company user posted a job without updating company details.');
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job details
// @route   PUT /api/jobs/:id
// @access  Private (Company owner only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse('Job not found.', 404));
    }

    // Make sure user is the job owner
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this job post.', 401));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Company owner only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse('Job not found.', 404));
    }

    // Make sure user is the job owner
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this job post.', 401));
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
