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

const baseQuestions: Question[] = [
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

const extraQuestions: Question[] = [
  { topic: "Functions", skill: "Function notation", prompt: "A taxi fare is modelled by F(d), where d is distance in kilometres. What does F(8) mean?", context: "Read the notation as a relationship between an input and an output.", choices: ["The taxi travels at 8 km/h.", "The fare, in dollars, for an 8 km trip.", "The distance travelled for an $8 fare.", "The function increases by 8 each trip."], answer: 1, hint: "Say F of 8 in words using the units in the situation.", why: "The input d is distance, so F(8) is the fare produced by an 8 km input." },
  { topic: "Functions", skill: "Maximum & minimum", prompt: "A ball follows h(t) = −5(t − 2)² + 21. How can you identify its maximum height without expanding?", context: "Use what vertex form reveals directly.", choices: ["The maximum is 2.", "The maximum is 21 because the parabola opens down and its vertex is (2, 21).", "The maximum is −5.", "The maximum needs the quadratic formula."], answer: 1, hint: "In a(x − h)² + k, the vertex is (h, k).", why: "The negative leading coefficient makes the vertex a maximum, and vertex form shows its height is 21." },
  { topic: "Functions", skill: "Radicals", prompt: "Why does √72 simplify to 6√2 rather than 36√2?", context: "Look for the largest perfect-square factor inside the radical.", choices: ["Because 72 = 36 × 2 and √36 = 6.", "Square roots divide a number by 12.", "Because √72 = √36 × 2.", "Because 6 + 2 = 8."], answer: 0, hint: "Use √(ab) = √a · √b.", why: "Since 72 = 36 × 2, √72 = √36√2 = 6√2." },
  { topic: "Functions", skill: "Quadratic formula", prompt: "For 2x² + 3x + 7 = 0, what does the negative discriminant tell you?", context: "The discriminant is b² − 4ac.", choices: ["Two equal real roots.", "No real roots, so the graph has no x-intercepts.", "The parabola opens downward.", "The equation cannot be graphed."], answer: 1, hint: "A negative number has no real square root.", why: "A negative discriminant means no real solutions, matching no x-intercepts." },
  { topic: "Functions", skill: "Linear–quadratic systems", prompt: "What do the solutions of y = x + 1 and y = x² − 3 represent on a graph?", context: "A system asks where both equations are true at once.", choices: ["The vertices.", "The points where the line and parabola intersect.", "Only the y-intercepts.", "The slopes."], answer: 1, hint: "The same x and y must satisfy both equations.", why: "System solutions are shared ordered pairs, shown as intersection points." },
  { topic: "Rational Expressions", skill: "Exponent rules", prompt: "Why is x³ · x⁴ = x⁷ rather than x¹²?", context: "Write each power as repeated multiplication.", choices: ["There are seven factors of x altogether.", "Exponents are never multiplied.", "Three times four equals seven for variables.", "The bases should be added."], answer: 0, hint: "Expand both powers and count factors.", why: "Multiplying powers with the same base combines all factors, so exponents add." },
  { topic: "Rational Expressions", skill: "Rational exponents", prompt: "What does 27^(2/3) mean?", context: "Interpret the denominator and numerator separately.", choices: ["Take the cube root of 27, then square.", "Divide 27 by 3, then square.", "Square 27, then divide by 3.", "Take two-thirds of 27."], answer: 0, hint: "In a^(m/n), n names the root and m the power.", why: "27^(2/3) = (∛27)² = 9." },
  { topic: "Transformations", skill: "Transforming x²", prompt: "Why is y = (x − 4)² + 1 shifted right 4 and up 1 from y = x²?", context: "Separate the input change from the output change.", choices: ["The input must be 4 larger to produce the same square; then every output gains 1.", "Both signs show direction directly.", "The 4 changes width.", "The vertex stays at the origin."], answer: 0, hint: "Which x-value makes the squared part zero?", why: "The square is zero at x = 4, moving the vertex right; +1 raises every output." },
  { topic: "Transformations", skill: "Transforming √x", prompt: "Where does y = √(x + 3) − 2 begin?", context: "The parent y = √x begins at (0, 0).", choices: ["(3, −2)", "(−3, −2)", "(−3, 2)", "(3, 2)"], answer: 1, hint: "Set x + 3 equal to zero.", why: "The radicand first reaches zero at x = −3, and the outside shift gives y = −2." },
  { topic: "Transformations", skill: "Transforming 1/x", prompt: "Which asymptotes does y = 1/(x − 2) + 5 have?", context: "Move the parent asymptotes with the graph.", choices: ["x = 2 and y = 5.", "x = 0 and y = 0.", "x = −2 and y = −5.", "There are no asymptotes."], answer: 0, hint: "The parent asymptotes are x = 0 and y = 0.", why: "A right-2, up-5 translation moves the asymptotes to x = 2 and y = 5." },
  { topic: "Exponential Functions", skill: "Exponential decay", prompt: "A medication retains 70% each hour. Why is the decay factor 0.70 rather than 0.30?", context: "Separate the portion lost from the portion remaining.", choices: ["Seventy percent is carried into the next hour.", "Thirty percent is positive.", "Decay factors must exceed 1.", "Both factors make the same model."], answer: 0, hint: "New amount = old amount × fraction remaining.", why: "Losing 30% leaves 70%, so the new amount is 0.70 times the previous amount." },
  { topic: "Exponential Functions", skill: "Compound interest", prompt: "Why does monthly compounding usually produce more than annual compounding at the same nominal rate?", context: "Assume the investment time is the same.", choices: ["Interest begins earning interest sooner and more often.", "The principal is added monthly.", "The annual rate becomes larger.", "Growth becomes linear."], answer: 0, hint: "When does newly earned interest join the balance?", why: "Frequent compounding adds interest sooner, allowing it to earn more interest." },
  { topic: "Exponential Functions", skill: "Exponential transformations", prompt: "For g(x) = 3·2^(x − 1) + 4, why is y = 4 a horizontal asymptote?", context: "Consider the exponential part far to the left.", choices: ["2^(x − 1) approaches 0, leaving outputs close to 4.", "The graph crosses y = 4 at x = 1.", "The coefficient 3 becomes zero.", "Every exponential has asymptote y = 4."], answer: 0, hint: "The exponential term approaches zero without reaching it.", why: "As x decreases, the exponential part approaches zero, so g(x) approaches 4." },
  { topic: "Trig Geometry", skill: "Special angles", prompt: "Why is sin 30° = 1/2 without a calculator?", context: "Use a 30°–60°–90° triangle.", choices: ["The opposite side is half the hypotenuse.", "Thirty is half of sixty.", "Sine halves an angle.", "The adjacent side equals the hypotenuse."], answer: 0, hint: "Recall the side ratio 1 : √3 : 2.", why: "Opposite 30° is 1 while the hypotenuse is 2, giving 1/2." },
  { topic: "Trig Geometry", skill: "Angles beyond 90°", prompt: "Why is cos 120° negative?", context: "Locate 120° in standard position.", choices: ["Its terminal arm is in quadrant II, where x-values are negative.", "All obtuse angles have negative sine.", "The reference angle is negative.", "Cosine is negative after every 90°."], answer: 0, hint: "Cosine is the x-coordinate on the unit circle.", why: "At 120° the terminal arm is in quadrant II, so its x-coordinate is negative." },
  { topic: "Trig Geometry", skill: "Trig equations", prompt: "If sin θ = 1/2 for 0° ≤ θ ≤ 360°, why are there two solutions?", context: "Think about unit-circle symmetry.", choices: ["Sine is positive in quadrants I and II, giving 30° and 150°.", "Every trig equation has two answers.", "The calculator rounds one answer into two.", "Sine is positive in III and IV."], answer: 0, hint: "Find the reference angle and the positive-sine quadrants.", why: "The reference angle is 30°, and sine is positive at 30° and 150°." },
  { topic: "Trig Geometry", skill: "Reciprocal trig ratios", prompt: "Why is sec θ undefined when cos θ = 0?", context: "Use their reciprocal relationship.", choices: ["sec θ = 1/cos θ, so the denominator would be zero.", "Secant only works in triangles.", "Zero has no angle.", "Cosine and secant must be equal."], answer: 0, hint: "Write secant explicitly as a fraction.", why: "Secant is the reciprocal of cosine, so cos θ = 0 requires division by zero." },
  { topic: "Trig Geometry", skill: "2D & 3D applications", prompt: "Why should you draw simpler labelled right triangles inside a 3D navigation problem?", context: "Measurements may lie in different planes.", choices: ["It shows which distances and angles belong together in each plane.", "Every 3D problem uses Pythagoras twice.", "A diagram makes units unnecessary.", "It guarantees an integer answer."], answer: 0, hint: "Which measurements form each triangle?", why: "Separating planes prevents combining sides and angles that do not share a triangle." },
  { topic: "Trig Functions", skill: "Graphing sine & cosine", prompt: "At x = 0°, what is the key difference between y = sin x and y = cos x?", context: "Use the unit-circle point at zero degrees.", choices: ["Sine starts at 0; cosine starts at 1.", "Sine starts at 1; cosine at 0.", "Both start at 0.", "Both start at −1."], answer: 0, hint: "The unit-circle point is (1, 0).", why: "Cosine is the x-coordinate, 1, and sine is the y-coordinate, 0." },
  { topic: "Trig Functions", skill: "Equation from a graph", prompt: "A sinusoid ranges from 4 to 18. What are its amplitude and midline?", context: "Use the maximum and minimum together.", choices: ["Amplitude 7; midline y = 11.", "Amplitude 14; midline y = 7.", "Amplitude 11; midline y = 7.", "Amplitude 18; midline y = 4."], answer: 0, hint: "Half the range; average the extremes.", why: "(18 − 4)/2 = 7 and (18 + 4)/2 = 11." },
  { topic: "Trig Functions", skill: "Trig applications I", prompt: "A tide peaks at 2 a.m. and again at 14:30. What feature is 12.5 hours?", context: "Consecutive matching points mark one repeat.", choices: ["The period.", "The amplitude.", "The phase shift.", "The midline."], answer: 0, hint: "Measure peak to peak.", why: "The time between identical cycle positions is the period." },
  { topic: "Trig Functions", skill: "Trig applications II", prompt: "Why is cosine convenient when a Ferris-wheel rider starts at the top?", context: "Both sine and cosine can model the motion.", choices: ["Cosine naturally begins at an extreme, needing little or no phase shift.", "Sine cannot model circles.", "Cosine has greater amplitude.", "Only cosine is periodic."], answer: 0, hint: "Compare the starting points of the parent curves.", why: "Cosine starts at a maximum, matching a rider who begins at the top." },
  { topic: "Discrete Functions", skill: "Series", prompt: "What is the difference between 3, 7, 11, … and 3 + 7 + 11 + …?", context: "The same terms form different objects.", choices: ["A sequence lists terms; a series adds them.", "A series must be geometric.", "A sequence is finite.", "There is no difference."], answer: 0, hint: "Notice commas versus addition signs.", why: "A sequence is an ordered list; a series is a sum." },
  { topic: "Discrete Functions", skill: "Geometric sequences", prompt: "Why is 160, 80, 40, 20, … geometric?", context: "Find the invariant operation.", choices: ["Each term is multiplied by 1/2.", "Each decreases by 80.", "Every term is even.", "The terms approach zero."], answer: 0, hint: "Divide a term by the previous term.", why: "The constant ratio is 1/2, defining a geometric sequence." },
  { topic: "Discrete Functions", skill: "Geometric series", prompt: "Why can 8 + 4 + 2 + 1 + … have a finite sum?", context: "The additions continue but become smaller.", choices: ["Its common ratio has magnitude below 1, so partial sums approach a limit.", "Every infinite list has a last term.", "The terms become exactly zero.", "Eight is finite."], answer: 0, hint: "Follow repeated multiplication by 1/2.", why: "When |r| < 1, terms shrink and partial sums converge—in this case to 16." },
  { topic: "Discrete Functions", skill: "Pascal’s triangle", prompt: "Why do 1, 4, 6, 4, 1 appear in (a + b)⁴?", context: "Connect the row to choices made while multiplying.", choices: ["They count ways to choose which factors contribute b.", "They are prime numbers.", "They are powers of 4.", "Every quartic uses them."], answer: 0, hint: "How many ways can two of four factors contribute b?", why: "The row contains binomial coefficients, counting combinations for each power pairing." },
];

const questions: Question[] = [...baseQuestions, ...extraQuestions].sort((a, b) => topics.indexOf(a.topic) - topics.indexOf(b.topic));

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
  const [attemptedCheck, setAttemptedCheck] = useState(false);
  const q = questions[index];

  const topicResults = useMemo(() => topics.map(topic => {
    const ids = questions.map((item, i) => item.topic === topic ? i : -1).filter(i => i >= 0);
    const correct = ids.filter(i => responses[i]?.choice === questions[i].answer).length;
    const avgConfidence = ids.reduce((sum, i) => sum + (responses[i]?.confidence ?? 0), 0) / ids.length;
    return { topic, correct, total: ids.length, avgConfidence };
  }), [responses]);

  function start() { setScreen("quiz"); }
  function check() {
    setAttemptedCheck(true);
    if (choice === null || confidence === null) {
      const firstMissing = choice === null ? "answer-choices" : "confidence-choice";
      window.setTimeout(() => document.getElementById(firstMissing)?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
      return;
    }
    setResponses(prev => ({ ...prev, [index]: { choice, confidence, note } }));
    setChecked(true);
  }
  function advance() {
    if (index === questions.length - 1) { setScreen("results"); return; }
    const next = index + 1;
    const saved = responses[next];
    setIndex(next); setChoice(saved?.choice ?? null); setConfidence(saved?.confidence ?? null); setNote(saved?.note ?? ""); setChecked(false); setShowHint(false); setAttemptedCheck(false);
  }
  function restart() {
    setResponses({}); setIndex(0); setChoice(null); setConfidence(null); setNote(""); setChecked(false); setShowHint(false); setAttemptedCheck(false); setScreen("welcome");
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
            <div id="answer-choices" className={`required-field ${attemptedCheck && choice === null ? "needs-attention" : ""}`}><div className="field-heading"><span>Choose the idea you trust most</span><span className="required-tag">Required</span></div><div className="choices" role="radiogroup" aria-label="Reasoning choices" aria-describedby={attemptedCheck && choice === null ? "answer-needed" : undefined}>{q.choices.map((text, i) => <button key={text} className={`choice ${choice === i ? "selected" : ""} ${checked && i === q.answer ? "correct" : ""} ${checked && choice === i && i !== q.answer ? "incorrect" : ""}`} role="radio" aria-checked={choice === i} disabled={checked} onClick={() => setChoice(i)}><span className="letter">{String.fromCharCode(65 + i)}</span><span>{text}</span></button>)}</div>{attemptedCheck && choice === null && <p id="answer-needed" className="field-error" role="alert">Select one answer before checking your reasoning.</p>}</div>
            {checked && <div className={`feedback ${choice === q.answer ? "success" : "review"}`} role="status"><strong>{choice === q.answer ? "Your reasoning holds up." : "A useful place to pause."}</strong><p>{q.why}</p></div>}
          </article>
          <aside className="thinking-card">
            <span className="lab-tag">Your field notes</span><h2>What makes you say that?</h2><p>Choose the idea you trust most, then name how certain you feel. Confidence helps distinguish a gap from a lucky guess.</p>
            <div id="confidence-choice" className={`required-field confidence-field ${attemptedCheck && confidence === null ? "needs-attention" : ""}`}><div className="confidence-label">How confident are you right now? <span className="required-tag">Required</span></div><div className="confidence" role="radiogroup" aria-label="Confidence" aria-describedby={attemptedCheck && confidence === null ? "confidence-needed" : undefined}>{["Still testing", "Fairly sure", "Certain"].map((label, i) => <button key={label} role="radio" aria-checked={confidence === i + 1} disabled={checked} className={`conf ${confidence === i + 1 ? "selected" : ""}`} onClick={() => setConfidence(i + 1)}>{label}</button>)}</div>{attemptedCheck && confidence === null && <p id="confidence-needed" className="field-error" role="alert">Choose the confidence level that feels closest.</p>}</div>
            <div className="note"><label htmlFor="why">One sentence of reasoning <small>(optional)</small></label><textarea id="why" disabled={checked} value={note} onChange={e => setNote(e.target.value)} placeholder="I notice that…" /></div>
            <button className="hint" type="button" aria-expanded={showHint} onClick={() => setShowHint(v => !v)}>{showHint ? "Hide thinking nudge" : "Reveal a thinking nudge"}</button>
            {showHint && <div className="hint-box">{q.hint}</div>}
            <div className="actions">{!checked ? <button className="continue" onClick={check}>{attemptedCheck && (choice === null || confidence === null) ? "Complete the highlighted step" : "Check my reasoning →"}</button> : <button className="continue" onClick={advance}>{index === questions.length - 1 ? "See my review map →" : "Next investigation →"}</button>}</div>
            <div className="footer-note">No grades. Your responses only shape a suggested review path.</div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <main className="app-shell welcome"><div className="welcome-card"><div className="eyebrow">Complete MCR3U knowledge check</div><h1>Find your next best step in Grade 11 math.</h1><p className="welcome-lead">This is not a test for a mark. It is a 40-question thinking lab—one investigation for every lesson area—that notices what you understand, how you reason, and where review could help before Grade 12.</p><div className="welcome-grid"><div><span>01</span><b>Choose the reasoning</b><p>Questions ask why a method or pattern works.</p></div><div><span>02</span><b>Name your confidence</b><p>Separate strong knowledge from uncertain guesses.</p></div><div><span>03</span><b>Get a review map</b><p>Leave with clear topics and skills to revisit.</p></div></div><div className="course-strip">{topics.map(t => <span key={t}>{t}</span>)}</div><button className="start-button" onClick={onStart}>Begin the full check-in <span>→</span></button><p className="time-note">About 35–45 minutes · Calculator optional · Hints are allowed</p></div></main>;
}

function Results({ results, responses, onRestart }: { results: { topic: string; correct: number; total: number; avgConfidence: number }[]; responses: Record<number, Response>; onRestart: () => void }) {
  const total = results.reduce((sum, r) => sum + r.correct, 0);
  const review = [...results].sort((a, b) => a.correct - b.correct || b.avgConfidence - a.avgConfidence).slice(0, 3);
  const skillRows = questions.map((question, i) => ({
    topic: question.topic,
    skill: question.skill,
    correct: responses[i]?.choice === question.answer,
    confidence: responses[i]?.confidence ?? 0,
  }));
  const ratio = total / questions.length;
  const label = ratio >= .85 ? "Strong foundation" : ratio >= .68 ? "Ready with a few tune-ups" : ratio >= .45 ? "A focused review will help" : "Start with the foundations";
  return <main className="app-shell results-page"><div className="results-frame"><div className="eyebrow">Your self-assessment report</div><header className="results-header"><div><h1>{label}</h1><p>You explored all seven strands and every lesson area. This report shows where you feel comfortable and what to review before Grade 12.</p></div><div className="score-seal"><strong>{total}</strong><span>of {questions.length} ideas</span></div></header><section className="result-grid">{results.map(r => { const pct = r.correct / r.total * 100; const status = pct >= 80 ? "Comfortable" : pct >= 50 ? "Developing" : "Review first"; const statusClass = pct >= 80 ? "s2" : pct >= 50 ? "s1" : "s0"; return <article key={r.topic} className="result-card"><div><h2>{r.topic}</h2><span className={`status ${statusClass}`}>{status}</span></div><div className="result-meter"><i style={{ width: `${pct}%` }} /></div><p>{r.correct} of {r.total} reasoning checks · confidence {r.avgConfidence < 1.5 ? "still developing" : r.avgConfidence < 2.5 ? "moderate" : "high"}</p></article> })}</section><section className="prescription"><div><span className="lab-tag">Suggested first review</span><h2>Begin where a small insight can unlock the most.</h2></div><ol>{review.map((r, i) => <li key={r.topic}><span>{i + 1}</span><div><b>{r.topic}</b><p>{r.correct / r.total < .5 ? "Rebuild the core ideas with examples, then try fresh problems." : "Review the missed ideas and explain them aloud in your own words."}{r.avgConfidence > 2.4 && r.correct < r.total ? " Your confidence was high here, so compare your reasoning carefully with worked examples." : ""}</p></div></li>)}</ol></section><section className="skill-report"><div className="skill-report-heading"><div><span className="lab-tag">Lesson-by-lesson record</span><h2>Your comfort map</h2></div><p>✓ understood · ↻ review · confidence shows how you felt before feedback</p></div><div className="skill-table-wrap"><table className="skill-table"><thead><tr><th>Unit</th><th>Lesson skill</th><th>Check</th><th>Confidence</th></tr></thead><tbody>{skillRows.map((row, i) => <tr key={`${row.topic}-${row.skill}-${i}`}><td>{row.topic}</td><td>{row.skill}</td><td><span className={`skill-mark ${row.correct ? "got-it" : "review-it"}`}>{row.correct ? "✓ Understood" : "↻ Review"}</span></td><td>{row.confidence === 3 ? "Certain" : row.confidence === 2 ? "Fairly sure" : "Still testing"}</td></tr>)}</tbody></table></div></section><section className="report-help"><b>Save and share this report</b><p>Select <strong>Save report as PDF / Print</strong>, choose “Save as PDF” in the print window, then attach the file to an email to your teacher. Nothing is sent automatically.</p></section><div className="results-actions"><button className="start-button" onClick={() => window.print()}>Save report as PDF / Print</button><button className="print-button" onClick={onRestart}>Try the check-in again</button></div><p className="results-note">Private by design: answers stay only in this browser session. Nothing is uploaded or emailed by the app.</p></div></main>;
}
