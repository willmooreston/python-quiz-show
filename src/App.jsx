import { useState } from "react";
import { quizzes } from "./quizzes/index.js";
import QuizEngine from "./QuizEngine.jsx";

function QuizCard({ quiz, onStart }) {
  return (
    <button
      onClick={onStart}
      style={{
        background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "12px",
        padding: "20px 24px", textAlign: "left", cursor: "pointer", width: "100%",
        transition: "border-color 0.15s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#38bdf8"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e293b"}
    >
      <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>
        {quiz.meta.title}
      </div>
      <div style={{ color: "#64748b", fontFamily: "monospace", fontSize: "13px", marginBottom: "14px" }}>
        {quiz.meta.description}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ color: "#475569", fontFamily: "monospace", fontSize: "11px" }}>
          {quiz.questions.length} questions
        </span>
      </div>
    </button>
  );
}

export default function App() {
  const [activeQuiz, setActiveQuiz] = useState(null);

  if (activeQuiz) {
    return <QuizEngine quiz={activeQuiz} onBack={() => setActiveQuiz(null)} />;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#060912",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", marginBottom: "4px" }}>
            INTERVIEW DRILLS
          </div>
          <h1 style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 800, fontSize: "24px", margin: 0 }}>
            Quiz Show
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.meta.id} quiz={quiz} onStart={() => setActiveQuiz(quiz)} />
          ))}
        </div>
      </div>
    </div>
  );
}
