const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const clientProfileController = require('../controllers/clientProfileController');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Message = require('../models/Message');

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

// Dashboard stats - returns real counts for Active Contracts, Pending Proposals, Unread Messages
router.get('/stats', clientOnly, async (req, res) => {
  try {
    const clientId = req.user._id;

    // Get all projects belonging to this client
    const projects = await Project.find({ clientId });
    const projectIds = projects.map(p => p._id);

    // Count proposals that are accepted (these are active contracts)
    const activeContracts = await Proposal.countDocuments({
      project: { $in: projectIds },
      status: 'accepted'
    });

    // Count proposals that are still pending
    const pendingProposals = await Proposal.countDocuments({
      project: { $in: projectIds },
      status: 'pending'
    });

    // Count unread messages sent to this client
    const unreadMessages = await Message.countDocuments({
      receiver: clientId,
      read: false
    });

    res.json({ success: true, activeContracts, pendingProposals, unreadMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
});

module.exports = router;
