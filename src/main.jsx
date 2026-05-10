import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const technicalQuestions = [
  {
    id: "ev-equity-value",
    category: "Enterprise Value",
    question: "Explique EV vs Equity Value en 90 secondes.",
    answer: "Equity Value = valeur des actionnaires. C’est le prix des actions : share price × diluted shares outstanding. Enterprise Value = valeur de l’activité opérationnelle pour tous les investisseurs. Formule simple : EV = Equity Value + Debt + Preferred Stock + Minority Interest - Cash. En entretien : Equity Value regarde uniquement les actionnaires ; EV regarde la valeur du business indépendamment de sa structure de financement."
  },
  {
    id: "depreciation-3-statements",
    category: "Accounting",
    question: "Fais le lien entre les 3 statements après +10 de depreciation.",
    answer: "Income Statement : EBIT baisse de 10, si tax rate 30%, net income baisse de 7. Cash Flow Statement : on part du net income -7 puis on rajoute depreciation +10 car non-cash, donc CFO augmente de 3. Balance Sheet : PP&E baisse de 10, cash augmente de 3, retained earnings baisse de 7. Les deux côtés baissent net de 7, donc ça balance."
  },
  {
    id: "working-capital-fcf",
    category: "Accounting",
    question: "Calcule l’impact d’une hausse du Working Capital sur le FCF.",
    answer: "Une hausse du Working Capital consomme du cash, donc elle réduit le Free Cash Flow. Formule classique : FCF = EBIT(1 - tax rate) + D&A - Capex - Increase in NWC. Exemple : si NWC augmente de 20, FCF baisse de 20."
  },
  {
    id: "cash-subtracted-ev",
    category: "Enterprise Value",
    question: "Explique pourquoi cash est soustrait dans Enterprise Value.",
    answer: "On soustrait le cash car l’acheteur peut utiliser le cash de la cible pour rembourser une partie du prix d’acquisition. EV représente la valeur des opérations, pas le cash excédentaire. Exemple : si tu achètes une entreprise 100 avec 20 de cash, le coût économique net est plutôt 80."
  },
  {
    id: "dcf-steps",
    category: "DCF",
    question: "Décris les étapes d’un DCF sans regarder tes notes.",
    answer: "1) Projeter les Free Cash Flows sur 5-10 ans. 2) Calculer le Terminal Value, souvent avec Gordon Growth ou Exit Multiple. 3) Actualiser les FCF et Terminal Value au WACC. 4) Additionner pour obtenir Enterprise Value. 5) Passer à Equity Value en soustrayant net debt et autres claims. 6) Diviser par diluted shares pour obtenir le prix par action."
  },
  {
    id: "accretion-dilution",
    category: "M&A",
    question: "Explique accretion/dilution avec EPS simplement.",
    answer: "Une acquisition est accretive si l’EPS de l’acquéreur augmente après la transaction. Elle est dilutive si l’EPS baisse. On compare l’EPS standalone de l’acquéreur avec le pro forma EPS après acquisition. Les drivers : purchase price, financing mix cash/debt/stock, interest rate, cost of debt, synergies, foregone interest on cash, new shares issued, amortization, tax rate."
  },
  {
    id: "multiples",
    category: "Valuation",
    question: "Fais 5 questions sur les multiples : EV/EBITDA, P/E, EV/Sales.",
    answer: "EV/EBITDA compare la valeur de l’activité à un proxy de profit opérationnel avant D&A. P/E compare Equity Value à Net Income, donc dépend de la structure de capital. EV/Sales est utile pour sociétés peu profitables ou early-stage, mais moins précis car il ignore les marges. Toujours comparer à des sociétés similaires en croissance, marge, risque et business model."
  },
  {
    id: "lbo",
    category: "LBO",
    question: "Explique comment fonctionne un LBO en version entretien.",
    answer: "Un fonds achète une entreprise avec beaucoup de dette et un apport en equity. L’entreprise rembourse progressivement la dette avec ses cash flows. À la sortie, le fonds revend l’entreprise. Le rendement vient de : dette remboursée, croissance EBITDA, amélioration des marges, expansion du multiple de sortie. Plus l’equity initial est faible et plus le deleveraging est fort, plus l’IRR peut être élevé."
  },
  {
    id: "net-debt",
    category: "M&A",
    question: "Révise Net Debt = Debt - Cash + autres éléments assimilés.",
    answer: "Net Debt = dette financière - cash et cash equivalents. En pratique, on peut ajouter debt-like items : leases, pension deficit, provisions assimilées à dette, earn-outs, preferred stock selon le cas. On peut aussi soustraire cash-like items. En M&A, c’est clé pour passer d’Enterprise Value à Equity Purchase Price."
  },
  {
    id: "negative-nwc",
    category: "Accounting",
    question: "Explique pourquoi une entreprise peut avoir un BFR négatif.",
    answer: "Un BFR négatif veut dire que l’entreprise reçoit du cash de ses clients avant de payer ses fournisseurs. C’est fréquent dans retail, restaurants, abonnements ou marketplaces. Ce n’est pas forcément mauvais : ça peut être un avantage de cash conversion. Mais si c’est dû à des retards de paiement fournisseurs parce que l’entreprise manque de cash, ça peut être un signal de stress."
  },
  {
    id: "three-statements",
    category: "Accounting",
    question: "Walk me through the 3 financial statements.",
    answer: "Income Statement : revenue, expenses, and Net Income. Balance Sheet : assets, liabilities and shareholders’ equity, with Assets = Liabilities + Equity. Cash Flow Statement : starts with Net Income, adjusts for non-cash items and working capital, then includes investing and financing cash flows to arrive at net change in cash."
  },
  {
    id: "enterprise-value-formula",
    category: "Enterprise Value",
    question: "What’s the formula for Enterprise Value?",
    answer: "Enterprise Value = Equity Value + Debt + Preferred Stock + Minority Interest - Cash. In more advanced cases, you may adjust for leases, pensions, investments, NOLs and other debt-like or cash-like items."
  },
  {
    id: "valuation-methodologies",
    category: "Valuation",
    question: "What are the 3 major valuation methodologies?",
    answer: "Comparable Companies, Precedent Transactions and Discounted Cash Flow Analysis. Comps value a company relative to similar public companies; precedent transactions look at M&A deals; DCF values the present value of future cash flows and terminal value."
  },
  {
    id: "wacc",
    category: "DCF",
    question: "How do you calculate WACC?",
    answer: "WACC = Cost of Equity × % Equity + Cost of Debt × % Debt × (1 - Tax Rate) + Cost of Preferred × % Preferred. It reflects the blended required return of all capital providers."
  },
  {
    id: "cost-of-equity",
    category: "DCF",
    question: "How do you calculate Cost of Equity?",
    answer: "Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium. Sometimes you add size or industry premiums depending on the company and bank methodology."
  },
  {
    id: "why-lbo-lower-dcf",
    category: "LBO",
    question: "Would an LBO or DCF usually give a higher valuation?",
    answer: "Usually a DCF gives a higher valuation because it captures interim free cash flows plus terminal value. An LBO is based on what a financial sponsor can pay while still hitting a target IRR, so it often creates a valuation floor."
  },
  {
    id: "sell-side-ma-process",
    category: "M&A",
    question: "Walk me through a typical sell-side M&A process.",
    answer: "1) Prepare marketing materials and buyer list. 2) Send teaser / executive summary. 3) Sign NDAs and send CIM. 4) Receive first-round bids / IOIs. 5) Select bidders for next round. 6) Management presentations and deeper due diligence. 7) Final bids. 8) Negotiate purchase agreement and announce / close."
  },
  {
    id: "fully-diluted-shares-options",
    category: "Enterprise Value",
    question: "How do you calculate fully diluted shares with options?",
    answer: "Use the Treasury Stock Method. Add shares from in-the-money options, then assume the company uses the option exercise proceeds to repurchase shares at the current share price. Net new shares = options - (options × exercise price / share price)."
  },
  {
    id: "goodwill",
    category: "Accounting",
    question: "What is Goodwill and when does it increase?",
    answer: "Goodwill is created in an acquisition when the purchase price exceeds the fair value of identifiable net assets acquired. It usually increases when a company acquires another company and pays a premium over book value / fair value of net identifiable assets."
  },
  {
    id: "terminal-value",
    category: "DCF",
    question: "How do you calculate Terminal Value in a DCF?",
    answer: "Two common methods: Gordon Growth Method and Exit Multiple Method. Gordon Growth uses FCF × (1 + g) / (WACC - g). Exit Multiple applies a valuation multiple, such as EV/EBITDA, to the final projected year’s metric."
  }
];

const microTasks = [
  "Ouvre ton PDF / support. C’est tout.",
  "Écris juste : EV = Equity Value + Debt - Cash.",
  "Lis une seule question technique.",
  "Mets ton téléphone à 3 mètres pendant 10 minutes.",
  "Écris le nom d’une banque où tu pourrais postuler.",
  "Réponds à une question sans chercher la perfection.",
  "Prépare uniquement ton espace de travail.",
  "Lance un timer de 10 minutes, pas plus."
];

const fitQuestions = [
  "Walk me through your CV.",
  "Why M&A?",
  "Why Private Equity?",
  "Why this bank / fund?",
  "Tell me about a time you worked under pressure.",
  "Tell me about a failure.",
  "Why should we hire you?",
  "What deal have you followed recently?",
  "What are your strengths and weaknesses?",
  "Where do you see yourself in 5 years?"
];

const applicationTasks = [
  "Ajoute 1 banque/fonds à ton pipeline.",
  "Écris un message LinkedIn à une alumni ESSEC.",
  "Adapte 3 lignes d’une lettre de motivation.",
  "Prépare une candidature imparfaite mais envoyable.",
  "Relis ton CV pendant 10 minutes max.",
  "Trouve 1 offre stage juillet/septembre 2026.",
  "Envoie 1 message de networking, même simple.",
  "Note le statut d’une candidature dans ton tracker."
];

const dayPlan = {
  Monday: ["Cours 9h-12h", "Bloc léger : 30 min technique", "Cours 16h-19h"],
  Tuesday: ["Sortie obligatoire avant 11h", "Bibliothèque/café : technique", "Candidatures + networking"],
  Wednesday: ["Matin : 1h technique", "Cours 13h-16h", "Soir : devoirs ESSEC"],
  Thursday: ["Matin : 1 candidature", "Cours 13h-16h", "Soir : 30 min fit"],
  Friday: ["Bibliothèque/café", "2h technique", "1h candidatures"],
  Saturday: ["Session café ou BU", "Mock interview", "Devoirs ESSEC"],
  Sunday: ["Review semaine", "Préparer lundi", "1h technique douce"]
};

const STORAGE_KEY = "alexandra_ib_prep_focus_hub_v3";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function pickRandom(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const m = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const s = (safeSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getModeDuration(mode) {
  if (mode === "procrastination") return 10 * 60;
  if (mode === "mock") return 12 * 60;
  if (mode === "applications") return 30 * 60;
  return 25 * 60;
}

function getFlagLabel(flag) {
  if (flag === "missed") return "Ratée";
  if (flag === "redo") return "À refaire même réussie";
  if (flag === "complete") return "À compléter";
  return "";
}

function getFlagEmoji(flag) {
  if (flag === "missed") return "❌";
  if (flag === "redo") return "🔁";
  if (flag === "complete") return "🧩";
  return "";
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearSavedState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function App() {
  const firstTechnicalQuestion = technicalQuestions[0];
  const savedState = useMemo(() => loadSavedState(), []);
  const [mode, setMode] = useState("start");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionDays, setSessionDays] = useState(savedState?.sessionDays ?? []);
  const [task, setTask] = useState(firstTechnicalQuestion.question);
  const [currentTechnicalQuestion, setCurrentTechnicalQuestion] = useState(firstTechnicalQuestion);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flags, setFlags] = useState(savedState?.flags ?? {});
  const [applications, setApplications] = useState(savedState?.applications ?? 0);
  const [technicalCompleted, setTechnicalCompleted] = useState(savedState?.technicalCompleted ?? 0);
  const [completedQuestions, setCompletedQuestions] = useState(savedState?.completedQuestions ?? []);
  const [showCompletedQuestions, setShowCompletedQuestions] = useState(false);
  const [expandedCompletedQuestionId, setExpandedCompletedQuestionId] = useState(null);
  const [expandedFlaggedQuestionId, setExpandedFlaggedQuestionId] = useState(null);
  const [mockCompleted, setMockCompleted] = useState(savedState?.mockCompleted ?? 0);
  const [mockAnswer, setMockAnswer] = useState(savedState?.mockAnswer ?? "");
  const [bank, setBank] = useState("");
  const [pipeline, setPipeline] = useState(savedState?.pipeline ?? []);
  const [notes, setNotes] = useState(savedState?.notes ?? "");
  const [customDayPlan, setCustomDayPlan] = useState(savedState?.customDayPlan ?? {});
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [lastSavedAt, setLastSavedAt] = useState(savedState?.lastSavedAt ?? null);

  const categories = useMemo(() => ["Toutes", ...Array.from(new Set(technicalQuestions.map(q => q.category)))], []);
  const filteredQuestions = useMemo(() => categoryFilter === "Toutes" ? technicalQuestions : technicalQuestions.filter(q => q.category === categoryFilter), [categoryFilter]);
  const flaggedQuestions = technicalQuestions.filter((question) => flags[question.id]);
  const totalWorkUnits = technicalCompleted + applications + mockCompleted;
  const sessionCount = sessionDays.length;
  const xp = Math.min(100, technicalCompleted * 5 + applications * 8 + mockCompleted * 7 + sessionCount * 5 + flaggedQuestions.length * 2);
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayPlan = customDayPlan[todayName] || dayPlan[todayName] || dayPlan.Tuesday;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          completeCurrentTask();
          return getModeDuration(mode);
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode, currentTechnicalQuestion]);

  useEffect(() => {
    const nextSavedAt = new Date().toLocaleString("fr-FR");
    saveState({ sessionDays, flags, applications, technicalCompleted, completedQuestions, mockCompleted, mockAnswer, pipeline, notes, customDayPlan, lastSavedAt: nextSavedAt });
    setLastSavedAt(nextSavedAt);
  }, [sessionDays, flags, applications, technicalCompleted, completedQuestions, mockCompleted, mockAnswer, pipeline, notes, customDayPlan]);

  function markTodayAsSessionDay() {
    const today = todayKey();
    setSessionDays((days) => days.includes(today) ? days : [...days, today]);
  }

  function setTechnicalQuestion(question) {
    if (!question) return;
    setCurrentTechnicalQuestion(question);
    setTask(question.question);
    setShowAnswer(false);
  }

  function completeTechnicalQuestion() {
    if (!currentTechnicalQuestion) return;
    setTechnicalCompleted((c) => c + 1);
    setCompletedQuestions((current) => current.some((item) => item.id === currentTechnicalQuestion.id) ? current : [...current, currentTechnicalQuestion]);
    setTechnicalQuestion(pickRandom(filteredQuestions));
  }

  function switchMode(newMode) {
    setMode(newMode);
    setRunning(false);
    setSeconds(getModeDuration(newMode));
    setShowAnswer(false);
    if (newMode === "procrastination") return setTask(pickRandom(microTasks));
    if (newMode === "technical") return setTechnicalQuestion(pickRandom(filteredQuestions));
    if (newMode === "mock") {
      setMockAnswer("");
      return setTask(pickRandom([...technicalQuestions.map(q => q.question), ...fitQuestions]));
    }
    if (newMode === "applications") return setTask(pickRandom(applicationTasks));
  }

  function nextTaskForMode() {
    if (mode === "procrastination") return pickRandom(microTasks);
    if (mode === "applications") return pickRandom(applicationTasks);
    if (mode === "mock") return pickRandom([...technicalQuestions.map(q => q.question), ...fitQuestions]);
    return pickRandom(filteredQuestions)?.question;
  }

  function completeCurrentTask() {
    markTodayAsSessionDay();
    if (mode === "technical") return completeTechnicalQuestion();
    setTask(nextTaskForMode());
    if (mode === "applications") setApplications((a) => a + 1);
    if (mode === "mock") {
      setMockCompleted((m) => m + 1);
      setMockAnswer("");
    }
  }

  function flagCurrentQuestion(flagType) {
    if (mode !== "technical" || !currentTechnicalQuestion) return;
    setFlags((currentFlags) => ({ ...currentFlags, [currentTechnicalQuestion.id]: flagType }));
  }

  function removeFlag(questionId) {
    setFlags((currentFlags) => {
      const nextFlags = { ...currentFlags };
      delete nextFlags[questionId];
      return nextFlags;
    });
  }

  function reviewQuestion(question) {
    setMode("technical");
    setRunning(false);
    setSeconds(getModeDuration("technical"));
    setTechnicalQuestion(question);
  }

  function addBank() {
    const trimmedBank = bank.trim();
    if (!trimmedBank) return;
    setPipeline((items) => [{ name: trimmedBank, status: "À faire" }, ...items]);
    setBank("");
  }

  function updateTodayPlanItem(index, value) {
    setCustomDayPlan((current) => {
      const currentPlan = [...todayPlan];
      currentPlan[index] = value;
      return { ...current, [todayName]: currentPlan };
    });
  }

  function addTodayPlanItem() {
    setCustomDayPlan((current) => ({ ...current, [todayName]: [...todayPlan, "Nouvelle tâche"] }));
  }

  function resetTodayPlan() {
    setCustomDayPlan((current) => {
      const next = { ...current };
      delete next[todayName];
      return next;
    });
  }

  function resetAllProgress() {
    clearSavedState();
    setSessionDays([]);
    setFlags({});
    setApplications(0);
    setTechnicalCompleted(0);
    setCompletedQuestions([]);
    setShowCompletedQuestions(false);
    setExpandedCompletedQuestionId(null);
    setExpandedFlaggedQuestionId(null);
    setMockCompleted(0);
    setMockAnswer("");
    setPipeline([]);
    setNotes("");
    setCustomDayPlan({});
    setLastSavedAt(null);
  }

  return (
    <div className="app">
      <div className="container">
        <header className="hero">
          <div>
            <span className="badge">M&A / PE Prep Hub</span>
            <h1>Alexandra vs TikTok</h1>
            <p>Tu n’as pas besoin d’être motivée. Clique sur un mode et suis la prochaine mini-action.</p>
          </div>
          <div className="xp-card">
            <div className="xp-top">
              <strong>🔥 Barre d’XP</strong>
              <span>{lastSavedAt ? `Sauvegardé : ${lastSavedAt}` : "Sauvegarde active"}</span>
            </div>
            <div className="xp-bar"><div style={{ width: `${xp}%` }} /></div>
            <p>{xp}% — {totalWorkUnits} actions utiles • {sessionCount} jours travaillés • {flaggedQuestions.length} flags</p>
          </div>
        </header>

        <section className="stats-grid">
          <button className="stat-card clickable" onClick={() => setShowCompletedQuestions(v => !v)}>
            <strong>{technicalCompleted}</strong><span>questions techniques terminées</span><small>Cliquer pour voir la liste</small>
          </button>
          <div className="stat-card"><strong>{applications}</strong><span>actions candidatures terminées</span></div>
          <div className="stat-card"><strong>{mockCompleted}</strong><span>mocks terminés</span></div>
          <div className="stat-card"><strong>{totalWorkUnits}</strong><span>total actions utiles</span></div>
        </section>

        {showCompletedQuestions && (
          <QuestionList
            title="Questions techniques complétées"
            badge={`${completedQuestions.length} uniques`}
            questions={completedQuestions}
            expandedId={expandedCompletedQuestionId}
            setExpandedId={setExpandedCompletedQuestionId}
            empty="Aucune question complétée pour l’instant."
          />
        )}

        <section className="mode-grid">
          <button onClick={() => switchMode("technical")}>🧠 Technique</button>
          <button onClick={() => switchMode("procrastination")}>🛡️ Je procrastine</button>
          <button onClick={() => switchMode("applications")}>📨 Candidatures</button>
          <button onClick={() => switchMode("mock")}>💼 Mock interview</button>
        </section>

        <main className="main-grid">
          <section className="card main-card">
            <div className="session-header">
              <div><small>Mode actuel</small><h2>{mode === "start" ? "Choisis un mode" : mode}</h2></div>
              <div className="timer">⏱️ {formatTime(seconds)}</div>
            </div>

            <div className="task-box">
              <small>Ta seule mission maintenant</small>
              <h3>{task}</h3>
              {mode === "technical" && currentTechnicalQuestion && (
                <div className="technical-tools">
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div className="button-row">
                    <button className="secondary" onClick={() => setShowAnswer(v => !v)}>{showAnswer ? "Cacher la réponse" : "Voir la réponse"}</button>
                    <button className="secondary" onClick={() => flagCurrentQuestion("missed")}>❌ Ratée</button>
                    <button className="secondary" onClick={() => flagCurrentQuestion("redo")}>🔁 À refaire</button>
                    <button className="secondary" onClick={() => flagCurrentQuestion("complete")}>🧩 À compléter</button>
                  </div>
                  {flags[currentTechnicalQuestion.id] && <span className="pill">{getFlagEmoji(flags[currentTechnicalQuestion.id])} {getFlagLabel(flags[currentTechnicalQuestion.id])}</span>}
                  {showAnswer && <div className="answer"><strong>Réponse attendue</strong><p>{currentTechnicalQuestion.answer}</p></div>}
                </div>
              )}
            </div>

            <div className="button-row">
              <button onClick={() => setRunning(v => !v)}>{running ? "⏸️ Pause" : "▶️ Start"}</button>
              <button className="secondary" onClick={() => { setRunning(false); setSeconds(getModeDuration(mode)); }}>🔄 Reset</button>
              <button className="secondary" onClick={completeCurrentTask}>✅ Fait / question suivante</button>
            </div>

            {mode === "mock" && <textarea value={mockAnswer} onChange={(e) => setMockAnswer(e.target.value)} placeholder="Réponds comme en entretien. Pas parfait, mais clair." />}
            {mode === "applications" && <div className="application-box"><div className="input-row"><input value={bank} onChange={(e) => setBank(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addBank(); }} placeholder="Nom banque/fonds à ajouter" /><button onClick={addBank}>Ajouter</button></div><button className="secondary" onClick={() => setApplications(a => a + 1)}>📨 J’ai fait une action candidature</button></div>}
          </section>

          <aside className="side-column">
            <section className="card">
              <div className="section-head">
                <h3>☕ Plan du jour</h3>
                <div className="button-row compact">
                  <button className="small-button" onClick={addTodayPlanItem}>+ tâche</button>
                  <button className="small-button ghost" onClick={resetTodayPlan}>Reset</button>
                </div>
              </div>
              {todayPlan.map((item, i) => (
                <div className="plan-item editable" key={`${item}-${i}`}>
                  <b>{i + 1}</b>
                  <input value={item} onChange={(e) => updateTodayPlanItem(i, e.target.value)} />
                </div>
              ))}
            </section>
            <section className="card"><h3>✨ Anti-friction</h3><p>Quand tu bloques, clique sur “Je procrastine” et fais seulement la micro-action.</p><div className="mini-stats"><span><b>{sessionCount}</b><br/>jours</span><span><b>{flaggedQuestions.length}</b><br/>flags</span></div></section>
          </aside>
        </main>

        <section className="two-grid">
          <QuestionList
            title="Questions techniques à revoir"
            badge={`${flaggedQuestions.length} flags`}
            questions={flaggedQuestions}
            expandedId={expandedFlaggedQuestionId}
            setExpandedId={setExpandedFlaggedQuestionId}
            empty="Aucune question flaggée pour l’instant."
            renderMeta={(q) => <span className="pill">{getFlagEmoji(flags[q.id])} {getFlagLabel(flags[q.id])}</span>}
            renderActions={(q) => <><button className="secondary small" onClick={() => reviewQuestion(q)}>Revoir maintenant</button><button className="secondary small" onClick={() => removeFlag(q.id)}>Retirer</button></>}
          />
          <section className="card"><h3>Pipeline candidatures</h3>{pipeline.length === 0 ? <p className="muted">Ajoute une banque/fonds dès que tu passes en mode Candidatures.</p> : pipeline.map((item, i) => <div className="pipeline-row" key={`${item.name}-${i}`}><span>{item.name}</span><span className="pill">{item.status}</span></div>)}</section>
        </section>

        <section className="card"><div className="notes-head"><h3>Notes rapides</h3><button className="secondary" onClick={resetAllProgress}>Réinitialiser toute ma progression</button></div><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex : question que je ne maîtrise pas, banque à contacter, devoir ESSEC à finir..." /></section>
      </div>
    </div>
  );
}

function QuestionList({ title, badge, questions, expandedId, setExpandedId, empty, renderMeta, renderActions }) {
  return (
    <section className="card">
      <div className="list-head"><h3>{title}</h3><span className="pill">{badge}</span></div>
      {questions.length === 0 ? <p className="muted">{empty}</p> : <div className="question-list">
        {questions.map((q) => <div className="question-item" key={q.id}>
          <button className="question-button" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>{expandedId === q.id ? "▼" : "▶"} {q.question}</button>
          {renderMeta && renderMeta(q)}
          {expandedId === q.id && <div className="answer"><strong>Réponse</strong><p>{q.answer}</p></div>}
          {renderActions && <div className="button-row">{renderActions(q)}</div>}
        </div>)}
      </div>}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
