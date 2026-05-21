const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../config/nodemailer');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Developer only)
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse('Job not found.', 404));
    }

    if (!job.isActive) {
      return next(new ErrorResponse('This job listing is no longer active.', 400));
    }

    // Check if user has already applied to this job
    const alreadyApplied = await Application.findOne({
      job: req.params.id,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return next(new ErrorResponse('You have already applied to this job listing.', 400));
    }

    // Create the application
    const application = await Application.create({
      job: req.params.id,
      applicant: req.user.id,
      status: 'Pending',
    });

    // Increment applicationsCount in Job
    job.applicationsCount += 1;
    await job.save();

    // Populate job details to return
    const populatedApp = await Application.findById(application._id)
      .populate('job', 'title location salaryMin salaryMax jobType')
      .populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get developer's applications
// @route   GET /api/applications/me
// @access  Private (Developer only)
exports.getDeveloperApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'postedBy',
          select: 'name companyName website description email',
        },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for company's job postings
// @route   GET /api/applications/company
// @access  Private (Company only)
exports.getCompanyApplications = async (req, res, next) => {
  try {
    // 1. Get all jobs posted by this company
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map((job) => job._id);

    // 2. Fetch all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title location salaryMin salaryMax jobType')
      .populate('applicant', 'name email skills resumeUrl bio')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Pending / Reviewed / Accepted / Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Company owner only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Reviewed', 'Accepted', 'Rejected'].includes(status)) {
      return next(new ErrorResponse('Invalid status value. Must be: Pending, Reviewed, Accepted, or Rejected.', 400));
    }

    // Find application and populate job details
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email');

    if (!application) {
      return next(new ErrorResponse('Application not found.', 404));
    }

    // Verify company user owns the job posting
    if (application.job.postedBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to change application status for this job.', 401));
    }

    application.status = status;
    await application.save();

    // Trigger Nodemailer / Console Alert (Asynchronous, doesn't block response)
    const emailOptions = {
      to: application.applicant.email,
      subject: `DevHire - Application Status Update: ${application.job.title}`,
      text: `Hi ${application.applicant.name},\n\nYour application status for the position of "${application.job.title}" at "${req.user.companyName || 'our company'}" has been updated to: "${status}".\n\nLogin to DevHire to check your dashboard for details.\n\nBest regards,\nRecruitment Team`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366F1;">DevHire Application Update</h2>
          <p>Hi <strong>${application.applicant.name}</strong>,</p>
          <p>We want to inform you that your application status for the position of <strong>${application.job.title}</strong> has been updated.</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6366F1;">
            <p style="margin: 0; font-size: 16px;">New Status: <strong>${status}</strong></p>
          </div>
          <p>Please log in to your developer dashboard on DevHire to see full details and next steps.</p>
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9CA3AF;">This is an automated notification from DevHire.</p>
        </div>
      `,
    };

    // Send email asynchronously
    sendEmail(emailOptions);

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};
