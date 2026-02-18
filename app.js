const STATE_KEY = "eyeAlgoState_v1";
const el = (id) => document.getElementById(id);

const homeView = el("homeView");
const wizardView = el("wizardView");

const homeSearchInput = el("homeSearchInput");
const algoList = el("algoList");
const algoTitle = el("algoTitle");

const redFlagsBlock = el("redFlagsBlock");
const questionBlock = el("questionBlock");
const questionText = el("questionText");
const questionHelp = el("questionHelp");
const answerButtons = el("answerButtons");

const outcomeBlock = el("outcomeBlock");
const outcomeTitle = el("outcomeTitle");
const outcomeBullets = el("outcomeBullets");
const outcomeNext = el("outcomeNext");

const breadcrumb = el("breadcrumb");
const severityPill = el("severityPill");

const btnHome = el("btnHome");
const btnReset = el("btnReset");
const btnBack = el("btnBack");
const btnCopy = el("btnCopy");
const copyStatus = el("copyStatus");

const treeView = el("treeView");
const treeSearch = el("treeSearch");

// Add your new JSON files to this array as you create them
const ALGOS = [
  { id: "red-eye", title: "Red eye", path: "data/red-eye.json", blurb: "Trauma/non-trauma, IOP, pain/photophobia → next steps" },
  { id: "double-vision", title: "Double Vision & Strabismus", path: "data/double-vision.json", blurb: "Monocular vs Binocular, Cranial Nerve Palsies" },
  { id: "flashes-floaters", title: "Flashes & Floaters", path: "data/flashes-floaters.json", blurb: "Acute onset, PVD, tears, detachments" }
];

let algo = null;
let history = [];
let currentNodeId = null;
let favourites = JSON.parse(localStorage.getItem("eyeAlgosFavs") || "[]");
let recents = JSON.parse(localStorage.getItem("eyeAlgosRecents") || "[]");

function saveState() {
  const state = { algoId: algo?.id ?? null, history, currentNodeId };
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function setView(which) {
  if (which === "home") {
    homeView.classList.remove("hidden");
    wizardView.classList.add("hidden");
    initHome(homeSearchInput.value); // Refresh list on return to home
  } else {
    homeView.classList.add("hidden");
    wizardView.classList.remove("hidden");
  }
}

function pillForSeverity(sev) {
  severityPill.classList.remove("hidden","emergency","urgent","routine");
  if (!sev) { severityPill.classList.add("hidden"); return; }
  const s = String(sev).toLowerCase();
  severityPill.classList.add(s);
  severityPill.textContent = s.charAt(0).toUpperCase() + s.slice(1);
}

function renderBreadcrumb() {
  breadcrumb.innerHTML = "";
  history.forEach(h => {
    const span = document.createElement("span");
    span.className = "crumb";
    span.textContent = `${h.q} → ${h.a}`;
    breadcrumb.appendChild(span);
  });
}

function renderNode(nodeId) {
  currentNodeId = nodeId;
  const node = algo.nodes[nodeId];
  if (!node) {
    showOutcome("Error", ["Node not found: " + nodeId], "urgent");
    saveState();
    return;
  }
  
  renderBreadcrumb();
  pillForSeverity(node.severity);

  // Red Flags logic
  if (algo.disclaimer && algo.disclaimer.length > 0) {
    redFlagsBlock.classList.remove("hidden");
    redFlagsBlock.innerHTML = "<strong>🚨 Red Flags & Guidelines:</strong><ul>" + 
      algo.disclaimer.map(d => `<li>${d}</li>`).join("") + "</ul>";
  } else {
    redFlagsBlock.classList.add("hidden");
  }

  if (node.type === "question") {
    outcomeBlock.classList.add("hidden");
    questionBlock.classList.remove("hidden");

    questionText.textContent = node.text;
    questionHelp.textContent = node.help ?? "";
    questionHelp.style.display = node.help ? "block" : "none";

    answerButtons.innerHTML = "";
    (node.answers ?? []).forEach(ans => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = ans.label;
      b.onclick = () => {
        history.push({ nodeId, q: node.text, a: ans.label });
        renderNode(ans.next);
        saveState();
      };
      answerButtons.appendChild(b);
    });

  } else if (node.type === "outcome") {
    questionBlock.classList.add("hidden");
    outcomeBlock.classList.remove("hidden");

    outcomeTitle.textContent = node.title ?? "Outcome";
    outcomeBullets.innerHTML = "";
    (node.bullets ?? []).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      outcomeBullets.appendChild(li);
    });

    outcomeNext.innerHTML = "";
    (node.next ?? []).forEach(n => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = n.label;
      b.onclick = () => renderNode(n.next);
      outcomeNext.appendChild(b);
    });

    pillForSeverity(node.severity ?? "routine");
  }
  copyStatus.textContent = "";
  saveState();
}

function showOutcome(title, bullets, severity) {
  questionBlock.classList.add("hidden");
  outcomeBlock.classList.remove("hidden");
  outcomeTitle.textContent = title;
  outcomeBullets.innerHTML = "";
  bullets.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    outcomeBullets.appendChild(li);
  });
  outcomeNext.innerHTML = "";
  pillForSeverity(severity);
}

async function loadAlgo(algoMeta, restoreState = null) {
  const res = await fetch(algoMeta.path, { cache: "no-store" });
  algo = await res.json();
  algoTitle.textContent = algo.title ?? algoMeta.title;
  setView("wizard");

  history = [];
  currentNodeId = algo.start;

  if (restoreState?.algoId === algo.id && restoreState.currentNodeId) {
    history = Array.isArray(restoreState.history) ? restoreState.history : [];
    currentNodeId = restoreState.currentNodeId;
  }
  renderTree();
  renderNode(currentNodeId);
}

// Search & Tree logic
function renderTree(filter = "") {
  if (!algo) return;
  const q = filter.trim().toLowerCase();
  treeView.innerHTML = "";
  const entries = Object.entries(algo.nodes);
  
  for (const [id, node] of entries) {
    const hay = (node.text ?? "") + " " + (node.title ?? "") + " " + (node.help ?? "") + " " + (node.bullets ?? []).join(" ");
    if (q && !hay.toLowerCase().includes(q)) continue;

    const d = document.createElement("details");
    const s = document.createElement("summary");
    s.textContent = node.type === "question" ? node.text : node.title;
    d.appendChild(s);
    treeView.appendChild(d);
  }
}

// ESR Copy Template
function summaryText() {
  const lines = [];
  lines.push(`Presenting complaint: ${algo?.title || "Clinical Pathway"}`);
  lines.push(`Working differential: [Type here]`);
  lines.push(`Examination summary: [Type here]`);
  
  const node = algo?.nodes?.[currentNodeId];
  let plan = "\nPlan: ";
  if (node?.type === "outcome") {
    plan += (node.title ?? "Outcome") + "\n- " + (node.bullets ?? []).join("\n- ");
  } else {
    plan += "[Type here]";
  }
  lines.push(plan);
  
  if (history.length) {
    lines.push("\n--- Triage Pathway Log ---");
    history.forEach((h, i) => lines.push(`${i+1}. ${h.q} -> ${h.a}`));
  }
  return lines.join("\n");
}

async function copySummary() {
  const text = summaryText();
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "ESR Template copied to clipboard.";
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyStatus.textContent = "Copied to clipboard (fallback).";
  }
}

// Home screen logic (Favourites, Recents, Search)
function trackRecent(id) {
  recents = [id, ...recents.filter(r => r !== id)].slice(0, 5);
  localStorage.setItem("eyeAlgosRecents", JSON.stringify(recents));
}

function toggleFav(id, e) {
  e.stopPropagation();
  if (favourites.includes(id)) {
    favourites = favourites.filter(f => f !== id);
  } else {
    favourites.push(id);
  }
  localStorage.setItem("eyeAlgosFavs", JSON.stringify(favourites));
  initHome(homeSearchInput.value);
}

function initHome(filterText = "") {
  algoList.innerHTML = "";
  const q = filterText.toLowerCase();

  // Sort: Favourites first, then Recents, then Alphabetical
  const sortedAlgos = [...ALGOS].sort((a, b) => {
    const aFav = favourites.includes(a.id);
    const bFav = favourites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.title.localeCompare(b.title);
  });

  sortedAlgos.forEach(a => {
    if (q && !a.title.toLowerCase().includes(q) && !a.blurb.toLowerCase().includes(q)) return;

    const b = document.createElement("button");
    b.className = "algoBtn";
    
    const isFav = favourites.includes(a.id);
    const isRecent = recents.includes(a.id);
    const tags = `${isFav ? "⭐ Fav " : ""}${isRecent ? "🕒 Recent" : ""}`;

    b.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="name">${a.title}</span>
        <span class="fav-star" style="cursor:pointer; font-size: 1.5rem; color: #f39c12;">${isFav ? "★" : "☆"}</span>
      </div>
      <div class="meta">${a.blurb}</div>
      <div class="meta" style="color:#2ecc71; font-size: 0.8em; margin-top: 5px;">${tags}</div>
    `;
    
    b.querySelector('.fav-star').onclick = (e) => toggleFav(a.id, e);
    b.onclick = (e) => {
      if(!e.target.classList.contains('fav-star')) {
        trackRecent(a.id);
        loadAlgo(a);
      }
    };
    algoList.appendChild(b);
  });
}

// Event Listeners
btnHome.onclick = () => setView("home");
btnReset.onclick = () => { if (!algo) return; history = []; renderNode(algo.start); saveState(); };
btnBack.onclick = () => {
  if (!algo) return;
  const last = history.pop();
  if (!last) { renderNode(algo.start); saveState(); return; }
  currentNodeId = last.nodeId;
  renderNode(currentNodeId);
  saveState();
};
btnCopy.onclick = () => copySummary();
homeSearchInput.addEventListener("input", (e) => initHome(e.target.value));
treeSearch.addEventListener("input", (e) => renderTree(e.target.value));

async function boot() {
  initHome();
  setView("home");

  const st = loadState();
  if (st?.algoId) {
    const meta = ALGOS.find(a => a.id === st.algoId);
    if (meta) await loadAlgo(meta, st);
  }

  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("service-worker.js"); }
    catch (e) { console.warn("SW registration failed", e); }
  }
}

boot();
