const express    = require('express');
const router     = express.Router();
const reviewCtrl = require('../controllers/reviewController');
const verifyToken  = require('../middleware/authMiddleware');
const requireRole  = require('../middleware/roleMiddleware');

const clientOnly     = [verifyToken, requireRole('CLIENT')];
const anyAuth        = [verifyToken];

// Client submits a review
router.post('/submit',                  clientOnly, reviewCtrl.submitReview);
// Check if client already reviewed a project
router.get('/check/:projectId',         clientOnly, reviewCtrl.checkReview);
// Get all reviews for a freelancer (public — any logged in user)
router.get('/freelancer/:freelancerId', anyAuth,    reviewCtrl.getFreelancerReviews);

module.exports = router;
