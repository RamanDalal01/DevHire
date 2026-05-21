const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const ErrorResponse = require('../utils/errorResponse');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Helper to sign JWT token
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_devhire_2026',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      resumeUrl: user.resumeUrl,
      bio: user.bio,
      companyName: user.companyName,
      website: user.website,
      description: user.description,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      skills,
      resumeUrl,
      bio,
      companyName,
      website,
      description,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('A user with that email already exists.', 400));
    }

    // Build base user object
    const userFields = {
      name,
      email,
      password,
      role,
    };

    // Attach role-specific fields
    if (role === 'developer') {
      userFields.skills = skills || [];
      userFields.resumeUrl = resumeUrl || '';
      userFields.bio = bio || '';
    } else if (role === 'company') {
      userFields.companyName = companyName || '';
      userFields.website = website || '';
      userFields.description = description || '';
    } else {
      return next(new ErrorResponse('Invalid role. Must be either developer or company.', 400));
    }

    // Create user
    const user = await User.create(userFields);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password.', 400));
    }

    // Check for user (must explicitly select password since select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials.', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials.', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user is already loaded by protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Developer Resume (PDF)
// @route   POST /api/auth/upload
// @access  Private (Developer only)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a PDF document.', 400));
    }

    // If Cloudinary keys are configured, upload to Cloudinary
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'devhire_resumes',
      });

      // Cleanup local temp file
      fs.unlinkSync(req.file.path);

      return res.status(200).json({
        success: true,
        resumeUrl: result.secure_url,
      });
    } else {
      // Local fallback url served by Express
      const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      return res.status(200).json({
        success: true,
        resumeUrl: localUrl,
      });
    }
  } catch (error) {
    // Cleanup local file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, resumeUrl, companyName, website, description } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found.', 404));
    }

    if (name) user.name = name;

    if (user.role === 'developer') {
      if (bio !== undefined) user.bio = bio;
      if (skills !== undefined) user.skills = skills;
      if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    } else if (user.role === 'company') {
      if (companyName !== undefined) user.companyName = companyName;
      if (website !== undefined) user.website = website;
      if (description !== undefined) user.description = description;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
