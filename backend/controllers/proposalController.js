const Proposal = require('../models/Proposal');
const Project = require('../models/Project');

// Freelancer: Submit a new proposal
exports.submitProposal = async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount, estimatedTime } = req.body;
    const freelancerId = req.user._id;

    // Check if project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Project is no longer open for bidding' });
    }

    // Check if freelancer already bid
    const existingProposal = await Proposal.findOne({ project: projectId, freelancer: freelancerId });
    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this project' });
    }

    const proposal = new Proposal({
      project: projectId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
      estimatedTime
    });

    await proposal.save();

    res.status(201).json({ success: true, message: 'Proposal submitted successfully', proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Freelancer: Get all proposals I've submitted
exports.getMyProposals = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    // Populate project details
    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate('project', 'title budget status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Freelancer: Get active/completed contracts
exports.getMyContracts = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const proposals = await Proposal.find({ 
      freelancer: freelancerId, 
      status: 'accepted' 
    })
      .populate({
        path: 'project',
        populate: {
          path: 'clientId',
          select: 'fullName username'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, contracts: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Client: Get all proposals for a specific project
exports.getProjectProposals = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clientId = req.user._id;

    // Verify client owns the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.clientId.toString() !== clientId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these proposals' });
    }

    const proposals = await Proposal.find({ project: projectId })
      .populate('freelancer', 'fullName email username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Client: Accept or Reject a proposal
exports.updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const clientId = req.user._id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const proposal = await Proposal.findById(proposalId).populate('project');
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify client owns the project
    if (proposal.project.clientId.toString() !== clientId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = status;
    await proposal.save();

    // When accepted, move the project to In Progress
    if (status === 'accepted') {
      proposal.project.status = 'In Progress';
      proposal.project.paymentStatus = 'Escrow';
      await proposal.project.save();

      // Send the freelancer a message so it shows up in their inbox and contracts
      await Message.create({
        sender:   clientId,
        receiver: proposal.freelancer,
        project:  proposal.project._id,
        content:  `🎉 Congratulations! Your bid on "${proposal.project.title}" has been accepted. You can now start working on the project.`,
      });
    }

    res.status(200).json({ success: true, message: `Proposal ${status}`, proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Freelancer: Edit a pending proposal
exports.editProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { coverLetter, bidAmount, estimatedTime } = req.body;
    const freelancerId = req.user._id;

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    // Make sure it belongs to this freelancer
    if (proposal.freelancer.toString() !== freelancerId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only pending proposals can be edited
    if (proposal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending proposals can be edited' });
    }

    if (coverLetter)   proposal.coverLetter   = coverLetter;
    if (bidAmount)     proposal.bidAmount     = bidAmount;
    if (estimatedTime) proposal.estimatedTime = estimatedTime;

    await proposal.save();

    res.json({ success: true, message: 'Proposal updated', proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
