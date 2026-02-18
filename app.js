const STATE_KEY = "eyeAlgoState_v1";
const el = (id) => document.getElementById(id);

const homeView = el("homeView");
const wizardView = el("wizardView");

const algoList = el("algoList");
const algoTitle = el("algoTitle");

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

const ALGOS = [
  { id: "red-eye", title: "Red eye", path: "data/red-eye.json", blurb: "Trauma/non-trauma, IOP, pain/photophobia → next steps" },
];

let algo = null;
let history = [];
let currentNodeId = null;

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

    const meta = document.createElement("div");
    meta.className = "nodeMeta";
    meta.innerHTML = `<code>${escapeHtml(id)}</code> • ${node.type}${node.severity ? " • " + escapeHtml(node.severity) : ""}`;
    d.appendChild(meta);

    const body = document.createElement("div");
    body.className = "nodeBody";

    if (node.type === "question") {
      const help = node.help ? `<div class="muted small" style="margin-top:6px">${escapeHtml(node.help)}</div>` : "";
      const answers = (node.answers ?? []).map(a => `• ${escapeHtml(a.label)} → <code>${escapeHtml(a.next)}</code>`).join("<br>");
      body.innerHTML = `${help}<div style="margin-top:10px">${answers}</div>`;
    } else {
      const bullets = (node.bullets ?? []).map(b => `<li>${escapeHtml(b)}</li>`).join("");
      body.innerHTML = `<ul class="bullets">${bullets}</ul>`;
      if (node.next?.length) {
        const nxt = node.next.map(n => `• ${escapeHtml(n.label)} → <code>${escapeHtml(n.next)}</code>`).join("<br>");
        body.innerHTML += `<div style="margin-top:10px">${nxt}</div>`;
      }
    }
    d.appendChild(body);
    treeView.appendChild(d);
  }
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function summaryText() {
  const lines = [];
  lines.push(algo?.title ? `Algorithm: ${algo.title}` : "Algorithm");
  if (history.length) {
    lines.push("");
    lines.push("Path taken:");
    history.forEach((h, i) => lines.push(`${i+1}. ${h.q} → ${h.a}`));
  }
  const node = algo?.nodes?.[currentNodeId];
  if (node?.type === "outcome") {
    lines.push("");
    lines.push("Outcome / next steps:");
    lines.push(node.title ?? "Outcome");
    (node.bullets ?? []).forEach(b => lines.push(`- ${b}`));
  }
  return lines.join("\n");
}
async function copySummary() {
  const text = summaryText();
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Copied to clipboard.";
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
function initHome() {
  algoList.innerHTML = "";
  ALGOS.forEach(a => {
    const b = document.createElement("button");
    b.className = "algoBtn";
    b.innerHTML = `<div class="name">${a.title}</div><div class="meta">${a.blurb}</div>`;
    b.onclick = () => loadAlgo(a);
    algoList.appendChild(b);
  });
}
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
