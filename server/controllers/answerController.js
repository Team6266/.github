const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Create new answer
// @route   POST /api/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.create({
      content,
      author: req.user._id,
      question: questionId
    });

    // Add answer to question's answers array
    question.answers.push(answer._id);
    await question.save();

    // Add answer to user's answersGiven array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { answersGiven: answer._id }
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username avatar reputation')
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user owns the answer
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    answer.content = req.body.content || answer.content;
    const updatedAnswer = await answer.save();

    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user owns the answer or is admin
    if (answer.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove answer from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    // Remove answer from user's answer
