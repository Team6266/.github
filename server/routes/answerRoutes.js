const express = require('express');
const router = express.Router();
const {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  addComment
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/question/:questionId', getAnswersByQuestion);

// Protected routes
router.post('/', protect, createAnswer);
router.put('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.put('/:id/vote', protect, voteAnswer);
router.put('/:id/accept', protect, acceptAnswer);
router.post('/:id/comment', protect, addComment);

module.exports = router;