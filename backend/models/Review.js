const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    project:    { type: mongoose.Schema.Types.ObjectId, ref: 'Project',    required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
    client:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per project per client
reviewSchema.index({ project: 1, client: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
