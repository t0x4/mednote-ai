const express = require('express');
const fs = require('fs');
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/transcribe
router.post('/transcribe', authMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });

    // Clean up temp file
    fs.unlink(req.file.path, () => {});

    res.json({ transcript: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    // Clean up temp file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// POST /api/analyze
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const systemPrompt = `You are an AI medical assistant. Based on the conversation between a doctor and a patient:

1. Generate a structured medical note in SOAP format:
- Subjective
- Objective
- Assessment
- Plan

2. Suggest possible diagnoses (not final)

3. Provide recommendations

4. Keep it professional but clear

Return the response in this exact JSON format:
{
  "medicalNote": {
    "subjective": "...",
    "objective": "...",
    "assessment": "...",
    "plan": "..."
  },
  "diagnoses": ["diagnosis1", "diagnosis2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "confidence": 0.85,
  "timeSaved": "~15 minutes"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Conversation:\n"${transcript}"` },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    const result = JSON.parse(responseText);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze transcript' });
  }
});

module.exports = router;
