const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    danceForm: {
      type: String,
      default: 'Kathak',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisted', 'winner', 'rejected'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ competitionId: 1, userId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
