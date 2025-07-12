const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  },
  tags: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
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
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for vote count
questionSchema.virtual('voteCount').get(function() {
  let upvotes = this.votes.filter(vote => vote.type === 'upvote').length;
  let downvotes = this.votes.filter(vote => vote.type === 'downvote').length;
  return upvotes - downvotes;
});

// Virtual for answer count
questionSchema.virtual('answerCount').get(function() {
  return this.answers.length;
});

// Virtual for accepted answer status
questionSchema.virtual('hasAcceptedAnswer').get(function() {
  return !!this.acceptedAnswer;
});

questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);