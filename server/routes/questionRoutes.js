const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  getPopularTags
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getQuestions);
router.get('/tags', getPopularTags);
router.get('/:id', getQuestion);

// Protected routes
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.put('/:id/vote', protect, voteQuestion);

module.exports = router;