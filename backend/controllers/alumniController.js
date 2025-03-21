// backend/controllers/alumniController.js
const Alumni = require('../models/Alumni');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all alumni
// @route   GET /api/alumni
// @access  Public
exports.getAlumni = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Remove excluded fields from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Convert reqQuery to string for filtering operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Start query
    query = Alumni.find(JSON.parse(queryStr)).populate({
      path: 'user',
      select: 'firstName lastName email profileImage graduationYear major'
    });

    // Handle search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');

      // Get user IDs that match the search criteria
      const users = await User.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);

      // Apply search filter
      query = query.find({
        $or: [
          { user: { $in: userIds } },
          { company: searchRegex },
          { role: searchRegex },
          { industry: searchRegex },
          { location: searchRegex }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total number of alumni (including filters)
    const total = await Alumni.countDocuments(query.getQuery());

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const alumni = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    // Send response
    res.status(200).json({
      success: true,
      count: alumni.length,
      pagination,
      data: alumni
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
