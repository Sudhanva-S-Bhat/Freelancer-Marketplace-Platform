const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const clientProfileController = require('../controllers/clientProfileController');

const clientOnly = [verifyToken, requireRole('CLIENT')];

const profileUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
]);

router.post('/profile', clientOnly, profileUpload, clientProfileController.completeProfile);
router.get('/profile/me', clientOnly, clientProfileController.getMyProfile);

// Dashboard is a template only - this just confirms access is authorized.
router.get('/dashboard', clientOnly, (req, res) => {
  res.json({ success: true, message: 'Client dashboard access granted' });
});

module.exports = router;
