# python-quiz-show

Interactive flashcard-style quiz app built with React + Vite, deployed to GitHub Pages.

## Architecture

- `src/App.jsx` — home menu, lists available quizzes as cards
- `src/QuizEngine.jsx` — shared quiz runner (multiple choice + fill-in-the-blank, progress bar, results screen)
- `src/quizzes/index.js` — registry; import and add quiz objects here to make them appear in the menu
- `src/quizzes/<topic>.js` — one file per quiz; exports `meta` (id, title, description, topics) and `questions` array

## Adding a new quiz

1. Create `src/quizzes/your-topic.js` with `export const meta = { id, title, description, topics }` and `export const questions = [...]`
2. Add one line to `src/quizzes/index.js`: import and push into the `quizzes` array
3. Questions support two types:
   - `type: "mc"` — multiple choice: `{ id, type, topic, question, options[], answer, explanation }`
   - `type: "fitb"` — fill in the blank: `{ id, type, topic, question, answer[], displayAnswer, explanation }`

## Dev

```
npm run dev    # local dev server
npm run build  # production build to dist/
```

## Deploy

Pushes to `main` auto-deploy via GitHub Actions to GitHub Pages.
Live at: https://willmooreston.github.io/python-quiz-show/
