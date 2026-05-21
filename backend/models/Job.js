const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  techStack: {
    type: [String],
    required: [true, 'Please specify the required technologies/skills'],
    default: [],
  },
  salaryMin: {
    type: Number,
    required: [true, 'Please specify minimum salary'],
  },
  salaryMax: {
    type: Number,
    required: [true, 'Please specify maximum salary'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location (e.g. Remote, Bangalore, New York)'],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, 'Please specify job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-time',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound/Single Indexes for performance as specified in PRD
JobSchema.index({ techStack: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ salaryMin: 1, salaryMax: 1 });
// Full-text index for job search
JobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', JobSchema);
