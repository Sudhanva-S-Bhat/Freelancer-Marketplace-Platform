const Review          = require('../models/Review');
const Project         = require('../models/Project');
const FreelancerProfile = require('../models/FreelancerProfile');

/* ── Client: Submit a review ─────────────────── */
exports.submitReview = async (req, res) => {
  try {
    const clientId  = req.user._id;
    const { projectId, rating, comment } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.client.toString() !== clientId.toString())
      return res.status(403).json({ success: false, message: 'Not your project' });
    if (project.status !== 'Completed')
      return res.status(400).json({ success: false, message: 'Project must be completed first' });

    // Find the accepted proposal to get freelancer id
    const Proposal = require('../models/Proposal');
    const accepted = await Proposal.findOne({ project: projectId, status: 'accepted' });
    if (!accepted) return res.status(404).json({ success: false, message: 'No accepted freelancer for this project' });

    const existing = await Review.findOne({ project: projectId, client: clientId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this project' });

    const review = await Review.create({
      project:    projectId,
      freelancer: accepted.freelancer,
      client:     clientId,
      rating:     Number(rating),
      comment:    comment || '',
    });

    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/* ── Get reviews for a freelancer ────────────── */
exports.getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const reviews = await Review.find({ freelancer: freelancerId })
      .populate('client',  'fullName username')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ success: true, reviews, averageRating: avg, totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/* ── Check if client already reviewed a project ─ */
exports.checkReview = async (req, res) => {
  try {
    const clientId  = req.user._id;
    const { projectId } = req.params;
    const review = await Review.findOne({ project: projectId, client: clientId });
    res.json({ success: true, hasReviewed: !!review, review: review || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
