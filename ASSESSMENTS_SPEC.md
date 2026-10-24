# AglaStep Skills Lab — Web & Android Shared Specification

## Current release
- Schema version: 1.0.0
- Question bank: `assessments.json` (12 tracks, 60 multiple-choice scenario questions)
- Browser engine: `assessment-engine.js`
- Homepage entry: `/#assessment`
- Each track has five questions, feedback after each selection, and an end-of-track report.
- Static website: no login, local-only transient answers, no server storage.

## Shared data model
```json
{
  "schemaVersion": "1.0.0",
  "tracks": [{
    "id": "interview",
    "title": "Interview Readiness",
    "audience": "fresher",
    "questions": [{
      "id": "interview-01",
      "competency": "Interview Readiness",
      "type": "single-choice",
      "difficulty": "foundation",
      "prompt": "Question text",
      "options": ["Choice 1", "Choice 2", "Choice 3"],
      "correctIndex": 0,
      "explanation": "Why this answer is preferred"
    }]
  }]
}
```
Android Flutter app should load the same versioned JSON (bundled asset or a trusted read-only CDN), render track selection and questions, calculate `correct / total`, show feedback and create an end-of-track plan from missed questions. For v1 the web and Android should use the *same* question IDs and scoring logic. Track audience types are `fresher`, `agent`, and `mid`.

## Development principles
1. Content is educational practice, not a validated psychometric assessment, certification, hiring guarantee or diagnostic instrument.
2. Never publish personal contact details, interview recordings or assessment results in this public GitHub repository.
3. Obtain explicit consent and a secure storage provider before collecting any user profiles or analytics.
4. Questions, answer keys and explanations are public in the static JSON. Not suitable for proctored/high-stakes testing.
5. For future progress history, store user responses securely with transparent opt-in, retention and deletion controls.
6. Provide voice-based mock calls separately; the current multiple-choice engine is not a speech simulator.
7. Future question bank revisions need editorial review, topic accuracy checks, accessibility tests, and schema migrations.
8. Do not imply provider affiliations. Curated external courses may change URLs, cost or availability.

## Planned next steps
- Expand each track to 10–20 unique reviewed items with weighted competency subdomains.
- Add scenario branching, explain-then-retry, confidence tracking and pre/post checks.
- Personalized roadmap should use skill-level evidence and explain recommendation rationale.
- Flutter app should use immutable models for Track and Question; unit-test answer evaluation and migration behavior.
- Add ethical aggregate funnel metrics only with clear disclosures and consent.
