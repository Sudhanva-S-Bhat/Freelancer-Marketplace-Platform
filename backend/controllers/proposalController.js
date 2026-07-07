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

    // If accepted, update the project status to 'In Progress'
    if (status === 'accepted') {
      proposal.project.status = 'In Progress';
      await proposal.project.save();
    }

    res.status(200).json({ success: true, message: `Proposal ${status}`, proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
