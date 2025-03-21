// routes/alumniRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import alumni controller (you'll need to create this)
// const { 
//   getAlumni,
//   getAlumniById,
//   updateAlumniProfile,
//   deleteAlumni
// } = require('../controllers/alumniController');

// For now, let's create a simple route to prevent the error
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Alumni routes are working'
  });
});

// When you create the alumni controller, you can uncomment and use these routes
// router.route('/').get(getAlumni);
// router.route('/:id').get(getAlumniById);
// router.route('/profile').put(protect, updateAlumniProfile);
// router.route('/:id').delete(protect, deleteAlumni);

module.exports = router;
