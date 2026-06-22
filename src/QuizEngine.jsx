import { useState } from "react";

const TOPIC_COLORS = {
  "Built-ins": "#38bdf8",
  "Slicing": "#a78bfa",
  "Strings": "#fb923c",
  "Dicts": "#34d399",
  "Comprehensions": "#f472b6",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TopicBadge({ topic }) {
  const color = TOPIC_COLORS[topic] || "#94a3b8";
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color,
      background: color + "1a", border: `1px solid ${color}44`,
      borderRadius: "4px", padding: "2px 8px", fontFamily: "monospace",
    }}>
      {topic}
    </span>
  );
}

function ProgressBar({ current, total, score }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "monospace" }}>
          Question {current} / {total}
        </span>
        <span style={{ color: "#34d399", fontSize: "13px", fontFamily: "monospace", fontWeight: 700 }}>
          {score} correct
        </span>
      </div>
      <div style={{ height: "4px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, #38bdf8, #a78bfa)",
          borderRadius: "2px", transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

function MCQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const choose = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
  };

  const isCorrect = selected === q.answer;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <TopicBadge topic={q.topic} />
        <span style={{ color: "#475569", fontSize: "11px", fontFamily: "monospace", marginLeft: "8px" }}>MULTIPLE CHOICE</span>
      </div>
      <p style={{ color: "#e2e8f0", fontSize: "16px", lineHeight: 1.6, marginBottom: "20px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {q.question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {q.options.map((opt) => {
          let bg = "#0f172a", border = "1px solid #1e293b", color = "#cbd5e1";
          if (revealed) {
            if (opt === q.answer) { bg = "#052e16"; border = "1px solid #34d399"; color = "#34d399"; }
            else if (opt === selected) { bg = "#1f0a0a"; border = "1px solid #ef4444"; color = "#ef4444"; }
            else { color = "#475569"; }
          } else if (selected === opt) {
            bg = "#1e293b"; border = "1px solid #38bdf8";
          }
          return (
            <button key={opt} onClick={() => choose(opt)} style={{
              background: bg, border, color, borderRadius: "8px", padding: "12px 16px",
              fontFamily: "monospace", fontSize: "14px", textAlign: "left",
              cursor: revealed ? "default" : "pointer", transition: "all 0.15s ease",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div style={{
          background: isCorrect ? "#052e16" : "#1f0a0a",
          border: `1px solid ${isCorrect ? "#34d399" : "#ef4444"}`,
          borderRadius: "8px", padding: "14px 16px", marginBottom: "16px",
        }}>
          <div style={{ color: isCorrect ? "#34d399" : "#ef4444", fontWeight: 700, marginBottom: "6px", fontFamily: "monospace" }}>
            {isCorrect ? "✓ Correct" : `✗ Answer: ${q.answer}`}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "monospace", lineHeight: 1.5 }}>{q.explanation}</div>
        </div>
      )}
      {revealed && (
        <button onClick={() => onAnswer(isCorrect)} style={{
          background: "linear-gradient(135deg, #38bdf8, #a78bfa)", border: "none",
          borderRadius: "8px", padding: "12px 24px", color: "#0a0a0f",
          fontWeight: 700, fontFamily: "monospace", fontSize: "14px", cursor: "pointer", width: "100%",
        }}>
          Next →
        </button>
      )}
    </div>
  );
}

function FITBQuestion({ q, onAnswer }) {
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const check = () => {
    if (!input.trim()) return;
    const normalized = input.trim().toLowerCase().replace(/\s+/g, "");
    const correct = q.answer.some(a => normalized === a.toLowerCase().replace(/\s+/g, ""));
    setIsCorrect(correct);
    setRevealed(true);
  };

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <TopicBadge topic={q.topic} />
        <span style={{ color: "#475569", fontSize: "11px", fontFamily: "monospace", marginLeft: "8px" }}>FILL IN THE BLANK</span>
      </div>
      <p style={{ color: "#e2e8f0", fontSize: "16px", lineHeight: 1.6, marginBottom: "20px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {q.question}
      </p>
      <input
        type="text" value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !revealed) check(); }}
        disabled={revealed}
        placeholder="type your answer…"
        style={{
          width: "100%", boxSizing: "border-box", background: "#0f172a",
          border: `1px solid ${revealed ? (isCorrect ? "#34d399" : "#ef4444") : "#334155"}`,
          borderRadius: "8px", padding: "12px 16px", color: "#e2e8f0",
          fontFamily: "monospace", fontSize: "15px", marginBottom: "12px", outline: "none",
        }}
      />
      {!revealed && (
        <button onClick={check} style={{
          background: "#1e293b", border: "1px solid #334155", borderRadius: "8px",
          padding: "10px 20px", color: "#94a3b8", fontFamily: "monospace",
          fontSize: "14px", cursor: "pointer", marginBottom: "16px",
        }}>
          Check
        </button>
      )}
      {revealed && (
        <div style={{
          background: isCorrect ? "#052e16" : "#1f0a0a",
          border: `1px solid ${isCorrect ? "#34d399" : "#ef4444"}`,
          borderRadius: "8px", padding: "14px 16px", marginBottom: "16px",
        }}>
          <div style={{ color: isCorrect ? "#34d399" : "#ef4444", fontWeight: 700, marginBottom: "6px", fontFamily: "monospace" }}>
            {isCorrect ? "✓ Correct" : `✗ Answer: ${q.displayAnswer}`}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "monospace", lineHeight: 1.5 }}>{q.explanation}</div>
        </div>
      )}
      {revealed && (
        <button onClick={() => onAnswer(isCorrect)} style={{
          background: "linear-gradient(135deg, #38bdf8, #a78bfa)", border: "none",
          borderRadius: "8px", padding: "12px 24px", color: "#0a0a0f",
          fontWeight: 700, fontFamily: "monospace", fontSize: "14px", cursor: "pointer", width: "100%",
        }}>
          Next →
        </button>
      )}
    </div>
  );
}

function Results({ score, total, missed, onRetry, onMissed, onMenu }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 90 ? "🟢 Sharp" : pct >= 70 ? "🟡 Getting there" : "🔴 Needs reps";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "56px", marginBottom: "8px" }}>
        {pct >= 90 ? "🐍" : pct >= 70 ? "🤔" : "📚"}
      </div>
      <div style={{ color: "#e2e8f0", fontSize: "28px", fontWeight: 800, fontFamily: "monospace", marginBottom: "4px" }}>
        {score} / {total}
      </div>
      <div style={{ color: "#94a3b8", fontFamily: "monospace", marginBottom: "4px" }}>{pct}% — {grade}</div>

      {missed.length > 0 && (
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "10px", padding: "16px", margin: "24px 0", textAlign: "left",
        }}>
          <div style={{ color: "#ef4444", fontFamily: "monospace", fontWeight: 700, marginBottom: "10px", fontSize: "12px", letterSpacing: "0.08em" }}>
            MISSED ({missed.length})
          </div>
          {missed.map(q => (
            <div key={q.id} style={{ color: "#64748b", fontFamily: "monospace", fontSize: "13px", marginBottom: "6px", lineHeight: 1.4 }}>
              <span style={{ color: TOPIC_COLORS[q.topic] || "#94a3b8" }}>[{q.topic}]</span>{" "}
              {q.question.split("\n")[0].slice(0, 60)}{q.question.length > 60 ? "…" : ""}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onRetry} style={{
          background: "linear-gradient(135deg, #38bdf8, #a78bfa)", border: "none",
          borderRadius: "8px", padding: "12px 24px", color: "#0a0a0f",
          fontWeight: 700, fontFamily: "monospace", fontSize: "14px", cursor: "pointer",
        }}>
          Shuffle & Retry All
        </button>
        {missed.length > 0 && (
          <button onClick={onMissed} style={{
            background: "#1f0a0a", border: "1px solid #ef4444", borderRadius: "8px",
            padding: "12px 24px", color: "#ef4444", fontWeight: 700,
            fontFamily: "monospace", fontSize: "14px", cursor: "pointer",
          }}>
            Drill Missed ({missed.length})
          </button>
        )}
        <button onClick={onMenu} style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px",
          padding: "12px 24px", color: "#94a3b8", fontWeight: 700,
          fontFamily: "monospace", fontSize: "14px", cursor: "pointer",
        }}>
          ← All Quizzes
        </button>
      </div>
    </div>
  );
}

export default function QuizEngine({ quiz, onBack }) {
  const [deck, setDeck] = useState(() => shuffle(quiz.questions));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [done, setDone] = useState(false);

  const handleAnswer = (correct) => {
    const q = deck[idx];
    const newScore = correct ? score + 1 : score;
    const newMissed = correct ? missed : [...missed, q];
    if (idx + 1 >= deck.length) {
      setScore(newScore);
      setMissed(newMissed);
      setDone(true);
    } else {
      setScore(newScore);
      setMissed(newMissed);
      setIdx(idx + 1);
    }
  };

  const retryAll = () => {
    setDeck(shuffle(quiz.questions));
    setIdx(0); setScore(0); setMissed([]); setDone(false);
  };

  const drillMissed = () => {
    setDeck(shuffle(missed));
    setIdx(0); setScore(0); setMissed([]); setDone(false);
  };

  const q = deck[idx];

  return (
    <div style={{
      minHeight: "100vh", background: "#060912",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ marginBottom: "32px" }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", color: "#475569",
            fontFamily: "monospace", fontSize: "12px", cursor: "pointer",
            padding: 0, marginBottom: "12px", letterSpacing: "0.06em",
          }}>
            ← All Quizzes
          </button>
          <div style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", marginBottom: "4px" }}>
            {quiz.meta.title.toUpperCase()}
          </div>
          <h1 style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 800, fontSize: "20px", margin: 0 }}>
            Interview Drill
          </h1>
        </div>

        <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "14px", padding: "28px" }}>
          {!done ? (
            <>
              <ProgressBar current={idx + 1} total={deck.length} score={score} />
              {q.type === "mc"
                ? <MCQuestion key={q.id} q={q} onAnswer={handleAnswer} />
                : <FITBQuestion key={q.id} q={q} onAnswer={handleAnswer} />
              }
            </>
          ) : (
            <Results score={score} total={deck.length} missed={missed} onRetry={retryAll} onMissed={drillMissed} onMenu={onBack} />
          )}
        </div>

        {!done && (
          <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {quiz.meta.topics.map((topic) => {
              const color = TOPIC_COLORS[topic] || "#94a3b8";
              return (
                <span key={topic} style={{ color, fontSize: "11px", fontFamily: "monospace", opacity: 0.6 }}>
                  ● {topic}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
