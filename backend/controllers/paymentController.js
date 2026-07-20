const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

/* ── Create Stripe Checkout Session ──────────────── */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { proposalId } = req.body;

    const proposal = await Proposal.findById(proposalId).populate('project freelancer');
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const project = proposal.project;
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Determine return domain URL
    const origin = req.headers.origin || 'http://localhost:3000';

    // Stripe checkout session parameters
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Escrow Payment: ${project.title}`,
              description: `Payment to freelancer: ${proposal.freelancer?.fullName || 'Freelancer'}`,
            },
            unit_amount: Math.round(proposal.bidAmount * 100), // Stripe takes amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/client/project/${project._id}?payment_success=true&proposal_id=${proposalId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/client/project/${project._id}?payment_cancelled=true`,
      metadata: {
        proposalId: proposalId.toString(),
        projectId: project._id.toString(),
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment session', error: error.message });
  }
};

/* ── Stripe Webhook Handler ──────────────────────── */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { proposalId, projectId } = session.metadata;

    try {
      // 1. Accept the proposal
      await Proposal.findByIdAndUpdate(proposalId, { status: 'accepted' });

      // 2. Reject other proposals for this project
      await Proposal.updateMany(
        { project: projectId, _id: { $ne: proposalId } },
        { status: 'rejected' }
      );

      // 3. Mark project in progress and escrowed
      await Project.findByIdAndUpdate(projectId, {
        status: 'In Progress',
        paymentStatus: 'Escrow',
      });

      console.log(`Payment confirmed & Escrow established for Project ${projectId}`);
    } catch (dbErr) {
      console.error('Database update failed on checkout.session.completed:', dbErr);
    }
  }

  res.json({ received: true });
};

/* ── Fallback Direct Confirmation (for instant activation) ── */
exports.confirmDirectPayment = async (req, res) => {
  try {
    const { proposalId, projectId } = req.body;

    // Direct confirmation from frontend URL verification
    await Proposal.findByIdAndUpdate(proposalId, { status: 'accepted' });
    await Proposal.updateMany(
      { project: projectId, _id: { $ne: proposalId } },
      { status: 'rejected' }
    );
    await Project.findByIdAndUpdate(projectId, {
      status: 'In Progress',
      paymentStatus: 'Escrow',
    });

    res.status(200).json({ success: true, message: 'Direct payment activated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Direct confirmation failed', error: error.message });
  }
};
