const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote']
    }
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for vote count
answerSchema.virtual('voteCount').get(function() {
  let upvotes = this.votes.filter(vote => vote.type === 'upvote').length;
  let downvotes = this.votes.filter(vote => vote.type === 'downvote').length;
  return upvotes - downvotes;
});

answerSchema.set('toJSON', { virtuals: true });
answerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Answer', answerSchema);