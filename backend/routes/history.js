const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// In-memory session store
const sessions = [];

// GET /api/history
router.get('/', authMiddleware, (req, res) => {
  try {
    const userSessions = sessions
      .filter((s) => s.userId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ sessions: userSessions });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// POST /api/history
router.post('/', authMiddleware, (req, res) => {
  try {
    const { transcript, result, patientLabel } = req.body;

    if (!transcript || !result) {
      return res.status(400).json({ error: 'Transcript and result are required' });
    }

    const session = {
      id: uuidv4(),
      userId: req.user.id,
      transcript,
      result,
      patientLabel: patientLabel || 'Unnamed Patient',
      date: new Date().toISOString(),
    };

    sessions.push(session);

    res.status(201).json({ session });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// GET /api/history/:id
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const session = sessions.find(
      (s) => s.id === req.params.id && s.userId === req.user.id
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

module.exports = router;
