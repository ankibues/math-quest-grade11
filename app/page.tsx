"use client";

import { useMemo, useState } from "react";

type Question = {
  topic: string;
  skill: string;
  prompt: string;
  context: string;
  choices: string[];
  answer: number;
  hint: string;
  why: string;
};

const topics = [
  "Functions",
  "Rational Expressions",
  "Transformations",
  "Exponential Functions",
  "Trig Geometry",
  "Trig Functions",
  "Discrete Functions",
];

const questions: Question[] = [
  { topic: "Functions", skill: "Domain & range", prompt: "A school rents a bus for $480, split equally among n students. Why is n = 0 excluded from C(n) = 480/n?", context: "Choose the explanation that connects the algebra to the situation.", choices: ["Zero students would make the cost negative.", "Division by zero is undefined, and there is nobody to share the cost.", "The graph would become a straight line.", "The cost must always be less than $480."], answer: 1, hint: "Ask what the denominator represents and what happens if it is zero.", why: "The denominator cannot be zero. In context, a trip cannot split a cost among zero students." },
  { topic: "Functions", skill: "Quadratic structure", prompt: "Two quadratics have the same zeros, −2 and 5. What must be true?", context: "Think about what the zeros determine—and what they do not.", choices: ["They are the same function.", "They have the same y-intercept.", "They can be written as a(x + 2)(x − 5), with possibly different nonzero a-values.", "They must open upward."], answer: 2, hint: "Start with factors. Is there still a multiplier you can change?", why: "The roots determine the factors, but a nonzero leading multiplier can stretch or reflect the graph." },
  { topic: "Rational Expressions", skill: "Restrictions", prompt: "Why must x = 3 remain excluded after (x² − 9)/(x − 3) simplifies to x + 3?", context: "The simplified expression looks harmless, but the original relation left a footprint.", choices: ["Because x + 3 is negative there.", "Because cancelling makes x = 3 an asymptote.", "Because the original denominator was zero there, creating a hole rather than a defined point.", "Because a quadratic cannot equal a linear expression."], answer: 2, hint: "Simplifying does not add a value that the original expression never had.", why: "Cancelling produces an equivalent rule only on the original domain; x = 3 remains a removable discontinuity." },
  { topic: "Rational Expressions", skill: "Algebraic reasoning", prompt: "A student says 1/x + 1/2 = 2/(x + 2). What is the quickest way to test the claim?", context: "You do not need a full proof to find whether an identity is plausible.", choices: ["Substitute one allowed value such as x = 2 and compare both sides.", "Cross out both 1s.", "Differentiate both sides.", "Assume x is very large."], answer: 0, hint: "A single counterexample can disprove a statement claimed to be true for every x.", why: "Testing x = 2 gives 1 on the left and 1/2 on the right, so the proposed identity is false." },
  { topic: "Transformations", skill: "Mapping points", prompt: "The point (2, 5) lies on y = f(x). Which point lies on y = −2f(x − 3) + 1?", context: "Track the horizontal move separately from the vertical output change.", choices: ["(−1, −9)", "(5, −9)", "(5, 11)", "(−1, 11)"], answer: 1, hint: "x − 3 shifts the input point right 3; then transform the y-value.", why: "The x-coordinate becomes 2 + 3 = 5, and the y-value becomes −2(5) + 1 = −9." },
  { topic: "Transformations", skill: "Inverse functions", prompt: "Why does reflecting y = f(x) across y = x produce the graph of its inverse relation?", context: "Focus on what reflection does to every ordered pair.", choices: ["It changes every y-value to its negative.", "It swaps each input-output pair (x, y) to (y, x).", "It makes every relation pass the vertical line test.", "It moves every point the same distance right."], answer: 1, hint: "What happens to the coordinates of a point reflected across y = x?", why: "An inverse reverses inputs and outputs; reflection across y = x swaps the coordinates." },
  { topic: "Exponential Functions", skill: "Growth structure", prompt: "A culture begins with 80 cells and doubles every 3 hours. Why is its growth exponential?", context: "Imagine checking it at equal 3-hour intervals. Choose the reasoning you would trust.", choices: ["It gains 80 cells each interval.", "It is multiplied by 2 each interval.", "Its graph eventually becomes steep.", "It starts with a positive value."], answer: 1, hint: "Compare one interval to the next: are you adding or multiplying?", why: "Exponential change uses a constant multiplicative factor over equal intervals—in this case, ×2." },
  { topic: "Exponential Functions", skill: "Model comparison", prompt: "Plan A adds $200 each year. Plan B grows by 8% each year. Why might Plan B eventually overtake Plan A?", context: "The important distinction is how the yearly change itself behaves.", choices: ["Eight is greater than two.", "Plan B adds the same larger amount every year.", "Plan B's increase is a percentage of an increasing balance, so its yearly gains grow.", "Every exponential model is immediately larger than every linear model."], answer: 2, hint: "Compare the amount added in year 2 with the amount added much later.", why: "Compound growth applies the percentage to a growing base, while linear growth adds a constant amount." },
  { topic: "Trig Geometry", skill: "Sine law ambiguity", prompt: "Why can the SSA case sometimes create two different triangles?", context: "Picture a fixed side swinging to meet a ray at the given angle.", choices: ["Sine is always positive.", "An acute angle and its supplement have the same sine, so two placements may fit.", "Every triangle has two longest sides.", "Cosine law always gives two answers."], answer: 1, hint: "Recall sin θ = sin(180° − θ).", why: "Two supplementary angles share a sine value, and both can sometimes satisfy the side-length constraints." },
  { topic: "Trig Geometry", skill: "Identity reasoning", prompt: "Without calculating an angle, why is sin²θ + cos²θ always 1?", context: "Connect the ratios to a point on a unit circle.", choices: ["Sine and cosine are always equal.", "Their values are the x- and y-coordinates on a unit circle, so x² + y² = 1.", "All trig ratios add to one.", "It follows from tan θ = 1."], answer: 1, hint: "Use the equation of a unit circle.", why: "On the unit circle, cos θ = x and sin θ = y; the circle equation is x² + y² = 1." },
  { topic: "Trig Functions", skill: "Periodic models", prompt: "A Ferris wheel height model has period 40 s. What does the period tell you?", context: "Interpret the feature before reaching for a formula.", choices: ["The rider is 40 m high.", "The wheel has radius 40 m.", "The rider's height pattern repeats every 40 seconds.", "The rider reaches the top after exactly 40 seconds."], answer: 2, hint: "Period measures the horizontal length of one complete cycle.", why: "A period is the time required for the full pattern to repeat." },
  { topic: "Trig Functions", skill: "Graph parameters", prompt: "For h(t) = 7 sin(30t) + 12, what does the 7 represent in context?", context: "Assume h is height in metres and t is time in seconds.", choices: ["The maximum height.", "The distance from the midline to a maximum or minimum height.", "The time for one cycle.", "The starting height."], answer: 1, hint: "The coefficient outside sine is the amplitude.", why: "Amplitude is half the vertical range—the distance from the midline to an extreme." },
  { topic: "Discrete Functions", skill: "Sequence structure", prompt: "A sequence is 5, 11, 17, 23, … Why is it arithmetic rather than geometric?", context: "Look for the operation that repeats from term to term.", choices: ["Each term is odd.", "Each term has 6 added; the common difference is constant.", "Each term is multiplied by 6.", "The sequence increases forever."], answer: 1, hint: "Compare differences and ratios between consecutive terms.", why: "Arithmetic sequences have a constant difference. Here every term is 6 more than the previous term." },
  { topic: "Discrete Functions", skill: "Recursive thinking", prompt: "A population follows P₁ = 120 and Pₙ = 1.05Pₙ₋₁ + 20. What does the rule say happens each period?", context: "Read the two operations in the order they appear.", choices: ["Add 5, then multiply by 20.", "Increase the previous population by 5%, then add 20.", "Add 120 every period.", "Multiply the original population by 1.05n."], answer: 1, hint: "Pₙ₋₁ means the previous term, not the original term.", why: "Each new term is 105% of the previous term, followed by an additional 20." },
];

type Response = { choice: number; confidence: number; note: string };

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "quiz" | "results">("welcome");
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, Response>>({});
  const [choice, setChoice] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const q = questions[index];

  const topicResults = useMemo(() => topics.map(topic => {
    const ids = questions.map((item, i) => item.topic === topic ? i : -1).filter(i => i >= 0);
    const correct = ids.filter(i => responses[i]?.choice === questions[i].answer).length;
    const avgConfidence = ids.reduce((sum, i) => sum + (responses[i]?.confidence ?? 0), 0) / ids.length;
    return { topic, correct, total: ids.length, avgConfidence };
  }), [responses]);

  function start() { setScreen("quiz"); }
  function check() {
    if (choice === null || confidence === null) { setError("Choose an idea and your confidence before checking."); return; }
    setResponses(prev => ({ ...prev, [index]: { choice, confidence, note } }));
    setError(""); setChecked(true);
  }
  function advance() {
    if (index === questions.length - 1) { setScreen("results"); return; }
    const next = index + 1;
    const saved = responses[next];
    setIndex(next); setChoice(saved?.choice ?? null); setConfidence(saved?.confidence ?? null); setNote(saved?.note ?? ""); setChecked(false); setShowHint(false); setError("");
  }
  function restart() {
    setResponses({}); setIndex(0); setChoice(null); setConfidence(null); setNote(""); setChecked(false); setShowHint(false); setScreen("welcome");
  }

  if (screen === "welcome") return <Welcome onStart={start} />;
  if (screen === "results") return <Results results={topicResults} responses={responses} onRestart={restart} />;

  const currentTopic = topics.indexOf(q.topic);
  const progress = ((index + (checked ? 1 : 0)) / questions.length) * 100;
  return (
    <main className="app-shell">
      <div className="page-frame">
        <header className="topbar">
          <div><div className="eyebrow">Ontario MCR3U diagnostic</div><h1>Math Quest: Grade 11 Check-In</h1><p className="subtitle">Follow the patterns. Explain your thinking. Notice what you know.</p></div>
          <div className="progress-number"><strong>{index + 1} / {questions.length}</strong><span>investigations</span><div className="meter"><i style={{ width: `${progress}%` }} /></div></div>
        </header>
        <nav className="topics" aria-label="Topic progress">{topics.map((topic, i) => <div key={topic} className={`chip ${i < currentTopic ? "done" : ""} ${i === currentTopic ? "current" : ""}`}><b>{topic}</b><small>{i < currentTopic ? "explored" : i === currentTopic ? "in progress" : "up next"}</small></div>)}</nav>
        <section className="workspace">
          <article className="question-card">
            <div className="qmeta"><span>Investigation {String(index + 1).padStart(2, "0")}</span>{q.skill}</div>
            <h2 className="prompt">{q.prompt}</h2><p className="scenario">{q.context}</p>
            <div className="thinking-line" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="choices" role="radiogroup" aria-label="Reasoning choices">{q.choices.map((text, i) => <button key={text} className={`choice ${choice === i ? "selected" : ""} ${checked && i === q.answer ? "correct" : ""} ${checked && choice === i && i !== q.answer ? "incorrect" : ""}`} role="radio" aria-checked={choice === i} disabled={checked} onClick={() => { setChoice(i); setError(""); }}><span className="letter">{String.fromCharCode(65 + i)}</span><span>{text}</span></button>)}</div>
            {checked && <div className={`feedback ${choice === q.answer ? "success" : "review"}`} role="status"><strong>{choice === q.answer ? "Your reasoning holds up." : "A useful place to pause."}</strong><p>{q.why}</p></div>}
          </article>
          <aside className="thinking-card">
            <span className="lab-tag">Your field notes</span><h2>What makes you say that?</h2><p>Choose the idea you trust most, then name how certain you feel. Confidence helps distinguish a gap from a lucky guess.</p>
            <div className="confidence-label">How confident are you right now?</div><div className="confidence">{["Still testing", "Fairly sure", "Certain"].map((label, i) => <button key={label} disabled={checked} className={`conf ${confidence === i + 1 ? "selected" : ""}`} onClick={() => { setConfidence(i + 1); setError(""); }}>{label}</button>)}</div>
            <div className="note"><label htmlFor="why">One sentence of reasoning <small>(optional)</small></label><textarea id="why" disabled={checked} value={note} onChange={e => setNote(e.target.value)} placeholder="I notice that…" /></div>
            <button className="hint" type="button" aria-expanded={showHint} onClick={() => setShowHint(v => !v)}>{showHint ? "Hide thinking nudge" : "Reveal a thinking nudge"}</button>
            {showHint && <div className="hint-box">{q.hint}</div>}
            {error && <p className="error" role="alert">{error}</p>}
            <div className="actions">{!checked ? <button className="continue" onClick={check}>Check my reasoning →</button> : <button className="continue" onClick={advance}>{index === questions.length - 1 ? "See my review map →" : "Next investigation →"}</button>}</div>
            <div className="footer-note">No grades. Your responses only shape a suggested review path.</div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <main className="app-shell welcome"><div className="welcome-card"><div className="eyebrow">MCR3U knowledge check</div><h1>Find your next best step in Grade 11 math.</h1><p className="welcome-lead">This is not a test for a mark. It is a 14-question thinking lab that notices what you understand, how you reason, and where a short review could help.</p><div className="welcome-grid"><div><span>01</span><b>Choose the reasoning</b><p>Questions ask why a method or pattern works.</p></div><div><span>02</span><b>Name your confidence</b><p>Separate strong knowledge from uncertain guesses.</p></div><div><span>03</span><b>Get a review map</b><p>Leave with clear topics and skills to revisit.</p></div></div><div className="course-strip">{topics.map(t => <span key={t}>{t}</span>)}</div><button className="start-button" onClick={onStart}>Begin the check-in <span>→</span></button><p className="time-note">About 15–20 minutes · Calculator optional · You can use hints</p></div></main>;
}

function Results({ results, responses, onRestart }: { results: { topic: string; correct: number; total: number; avgConfidence: number }[]; responses: Record<number, Response>; onRestart: () => void }) {
  const total = results.reduce((sum, r) => sum + r.correct, 0);
  const review = [...results].sort((a, b) => a.correct - b.correct || b.avgConfidence - a.avgConfidence).slice(0, 3);
  const label = total >= 12 ? "Strong foundation" : total >= 9 ? "Ready with a few tune-ups" : total >= 6 ? "A focused review will help" : "Start with the foundations";
  return <main className="app-shell results-page"><div className="results-frame"><div className="eyebrow">Your review map</div><header className="results-header"><div><h1>{label}</h1><p>You explored all seven strands. Use this map as a conversation starter—not a final judgement.</p></div><div className="score-seal"><strong>{total}</strong><span>of 14 ideas</span></div></header><section className="result-grid">{results.map(r => { const pct = r.correct / r.total * 100; const status = r.correct === 2 ? "Ready" : r.correct === 1 ? "Revisit" : "Review first"; return <article key={r.topic} className="result-card"><div><h2>{r.topic}</h2><span className={`status s${r.correct}`}>{status}</span></div><div className="result-meter"><i style={{ width: `${pct}%` }} /></div><p>{r.correct} of {r.total} reasoning checks · confidence {r.avgConfidence < 1.5 ? "still developing" : r.avgConfidence < 2.5 ? "moderate" : "high"}</p></article> })}</section><section className="prescription"><div><span className="lab-tag">Suggested first review</span><h2>Begin where a small insight can unlock the most.</h2></div><ol>{review.map((r, i) => <li key={r.topic}><span>{i + 1}</span><div><b>{r.topic}</b><p>{r.correct === 0 ? "Rebuild the core idea with examples, then try a fresh problem." : "Review the missed idea and explain it aloud in your own words."}{r.avgConfidence > 2.4 && r.correct < 2 ? " Your confidence was high here, so compare your reasoning carefully with a worked example." : ""}</p></div></li>)}</ol></section><div className="results-actions"><button className="start-button" onClick={onRestart}>Try the check-in again</button><button className="print-button" onClick={() => window.print()}>Print review map</button></div><p className="results-note">Completed {Object.keys(responses).length} investigations. Results stay on this device and disappear when the page is refreshed.</p></div></main>;
}
