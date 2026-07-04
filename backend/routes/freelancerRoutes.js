const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const freelancerProfileController = require('../controllers/freelancerProfileController');

const freelancerOnly = [verifyToken, requireRole('FREELANCER')];

const profileUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'portfolioFiles', maxCount: 10 },
  { name: 'certificateFiles', maxCount: 10 },
]);

router.post('/profile', freelancerOnly, profileUpload, freelancerProfileController.completeProfile);
router.get('/profile/me', freelancerOnly, freelancerProfileController.getMyProfile);

// Dashboard is a template only - this just confirms access is authorized.
router.get('/dashboard', freelancerOnly, (req, res) => {
  res.json({ success: true, message: 'Freelancer dashboard access granted' });
});

module.exports = router;
