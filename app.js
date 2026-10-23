const { lessons, docs, cases, questions, questionsToAsk, examExtra, glossary, sources, star, simulacro } = window.ALTA;
const KEY = "alta-mesa-gh";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

const saved = load();
const state = {
  view: { name: "home" },
  back: [],
  lessons: saved.lessons || {},
  cases: saved.cases || {},
  practiced: saved.practiced || {},
  exam: saved.exam || 0,
};
const session = { quiz: null, case: null, openQ: questions[0] ? questions[0].id : null };
let lastKey = "";

function persist() {
  localStorage.setItem(
    KEY,
    JSON.stringify({ lessons: state.lessons, cases: state.cases, practiced: state.practiced, exam: state.exam }),
  );
}

function esc(value) {
  return String(value)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026#39;");
}

function decisionLabel(id) {
  if (id === "aprobar") return "Aprobar";
  if (id === "observar") return "Observar";
  return "Escalar";
}

function go(view) {
  state.back.push(state.view);
  state.view = view;
  render();
}

function pop() {
  state.view = state.back.pop() || { name: "home" };
  render();
}

function jump(name) {
  state.view = { name };
  state.back = name === "home" ? [] : [{ name: "home" }];
  render();
}

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  learn: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/>',
  library: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/>',
  cases: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  interview: '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  exam: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  sim: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  glossary: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 8h8M8 12h6"/>',
  cheat: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  sources: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
};
const icon = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
const SECTION = { lesson: "learn", doc: "library", case: "cases", exam: "more", sim: "more", glossary: "more", cheat: "more", sources: "more" };
const TITLES = { home: "Inicio", learn: "Curso", lesson: "Módulo", library: "Legajo", doc: "Documento", cases: "Casos", case: "Caso", interview: "Oral", more: "Más", exam: "Examen final", sim: "Simulacro", glossary: "Glosario", cheat: "Ficha", sources: "Fuentes" };

function ring(pct, size = 64) {
  const r = 26, c = 2 * Math.PI * r;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${pct}% completado"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/><text x="32" y="37" text-anchor="middle">${pct}%</text></svg>`;
}

function progress() {
  const learned = lessons.filter((l) => state.lessons[l.id] && state.lessons[l.id].done).length;
  const solved = cases.filter((c) => state.cases[c.id] && state.cases[c.id].passed).length;
  const said = questions.filter((q) => state.practiced[q.id]).length;
  const examOk = state.exam >= 70 ? 1 : 0;
  const total = lessons.length + cases.length + questions.length + 1;
  return { learned, solved, said, examOk, pct: Math.round(((learned + solved + said + examOk) / total) * 100) };
}

function bar(value, max) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return `<span class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></span>`;
}

function shell(body) {
  const v = state.view;
  const active = SECTION[v.name] || v.name;
  const p = progress();
  const main = [["home", "Inicio"], ["learn", "Curso"], ["library", "Legajo"], ["cases", "Casos"], ["interview", "Oral"]];
  const extra = [["exam", "Examen final"], ["sim", "Simulacro"], ["glossary", "Glosario"], ["cheat", "Ficha imprimible"], ["sources", "Fuentes"]];
  const link = ([name, label]) => `<button data-act="jump" data-name="${name}" class="side-link ${active === name || v.name === name ? "on" : ""}">${icon(name)}<span>${label}</span></button>`;
  const dark = document.documentElement.dataset.theme === "dark";
  const tabs = [["home", "Inicio"], ["learn", "Curso"], ["library", "Legajo"], ["cases", "Casos"], ["interview", "Oral"], ["more", "Más"]];
  return `
    <aside class="side no-print">
      <div class="brand"><span class="mark">A</span><div><strong>ALTA</strong><small>Mesa de onboarding</small></div></div>
      <nav class="side-nav" aria-label="Secciones">${main.map(link).join("")}<p class="side-sep">Cierre</p>${extra.map(link).join("")}</nav>
      <div class="side-progress">${ring(p.pct, 52)}<div><strong>Tu avance</strong><small>${p.learned}/${lessons.length} módulos · ${p.solved}/${cases.length} casos</small></div></div>
    </aside>
    <div class="frame">
      <header class="top no-print">
        ${v.name === "home" ? `<div class="brand brand-m"><span class="mark">A</span><strong>ALTA</strong></div>` : `<button class="back" data-act="pop" aria-label="Volver">${icon("back")}<span>Volver</span></button>`}
        <span class="crumb">${TITLES[v.name] || ""}</span>
        <span class="top-tag">KYC · AML · Argentina</span>
        <button class="theme" data-act="theme" aria-label="Cambiar a modo ${dark ? "claro" : "oscuro"}" title="Modo ${dark ? "claro" : "oscuro"}">${icon(dark ? "sun" : "moon")}</button>
      </header>
      <main class="view" id="view">${body}</main>
    </div>
    <nav class="tabbar no-print" aria-label="Secciones">${tabs.map(([name, label]) => `<button data-act="jump" data-name="${name}" class="${active === name ? "on" : ""}">${icon(name)}<span>${label}</span></button>`).join("")}</nav>`;
}

function home() {
  const p = progress();
  const paths = [
    ["01", "learn", "Aprender el criterio", `${lessons.length} módulos cortos, desde cero, con un control al final de cada uno.`, bar(p.learned, lessons.length)],
    ["02", "library", "Leer un legajo", `${docs.length} documentos: qué son, qué mirar y la frase para decirlo en voz alta.`, ""],
    ["03", "cases", "Resolver la mesa", `${cases.length} empresas ficticias. Marcá los errores en los documentos y decidí.`, bar(p.solved, cases.length)],
    ["04", "interview", "Ensayar el oral", "Preguntas con respuesta modelo, STAR y simulacro con reloj.", bar(p.said, questions.length)],
    ["05", "more", "Examen, glosario y ficha", "Examen final, glosario, fuentes oficiales y ficha imprimible.", ""],
  ];
  return `
    <section class="hero card">
      <div>
        <p class="kicker">Para la entrevista de onboarding</p>
        <h1>Conocé al cliente antes de abrirle la puerta.</h1>
        <p class="lead">Minicurso de KYC, AML y legajos de personas jurídicas en Argentina. Criterio de mesa, documentos y ${cases.length} sociedades ficticias para aprobar, observar o escalar.</p>
        <div class="row-btns"><button class="btn" data-act="jump" data-name="learn">Empezar el curso</button><button class="btn ghost" data-act="jump" data-name="cases">Ir a los casos</button></div>
      </div>
      <div class="hero-ring">${ring(p.pct, 132)}<small>avance total</small></div>
    </section>
    <section class="stats">
      <div class="stat card"><span>Módulos</span><b>${p.learned}<i>/${lessons.length}</i></b>${bar(p.learned, lessons.length)}</div>
      <div class="stat card"><span>Casos</span><b>${p.solved}<i>/${cases.length}</i></b>${bar(p.solved, cases.length)}</div>
      <div class="stat card"><span>Respuestas</span><b>${p.said}<i>/${questions.length}</i></b>${bar(p.said, questions.length)}</div>
      <div class="stat card"><span>Examen</span><b>${state.exam ? state.exam + "%" : "—"}</b>${bar(state.exam || 0, 100)}</div>
    </section>
    <h2>Recorrido</h2>
    <div class="grid">${paths
      .map(([num, name, title, text, b]) => `
        <button class="tile card" data-act="jump" data-name="${name}">
          <span class="num">${num}</span>
          <strong>${title}</strong><span class="muted small">${text}</span>${b}
        </button>`)
      .join("")}</div>
    <div class="grid two mt-lg">
      <section class="card pocket">
        <p class="kicker">Ficha de bolsillo</p>
        <ul class="bars">
          <li>Beneficiario final: persona humana, 10% o control. Res. UIF 112/2021.</li>
          <li>PEP: el cargo y dos años más. Hermanos sí. Abuelos no. Res. 192/2024.</li>
          <li>SA: art. 257 LGS, hasta tres ejercicios, y sigue hasta que lo reemplazan. Igual pedí acta reciente.</li>
          <li>SRL: gerentes, no directorio. IGJ es CABA, no el país.</li>
          <li>Hit de lista: no se cierra solo y no se le manda al cliente.</li>
          <li>Sin diligencia completa no hay alta. El ROS lo decide el Oficial, y no se avisa.</li>
        </ul>
      </section>
      <section class="card">
        <p class="kicker">Cómo usar el fin de semana</p>
        <ol class="steps">
          <li><b>Viernes.</b> Módulos 1 a 3. Quedate con la ficha, no con un número de resolución que no cierres.</li>
          <li><b>Sábado.</b> El resto de los módulos, el legajo y los dos primeros casos. El primero está guiado.</li>
          <li><b>Domingo.</b> El resto de los casos en voz alta, el examen y el oral. Decisión, motivo, próximo paso.</li>
        </ol>
      </section>
    </div>
    <p class="muted small mt-lg">Material de estudio. Las sociedades no existen. En el puesto manda el manual del sujeto obligado y la resolución sectorial vigente. Los umbrales en pesos cambian.</p>
    <button class="linkish mt" data-act="reset">Reiniciar la práctica</button>`;
}

function learn() {
  const rows = lessons
    .map((lesson) => {
      const mark = state.lessons[lesson.id];
      const extra = mark && mark.done ? ` · control ${mark.score}%` : mark && mark.read ? " · empezado" : "";
      return `<button class="row card ${mark && mark.done ? "done" : ""}" data-act="go" data-name="lesson" data-id="${lesson.id}">
        <span class="num">${lesson.num}</span>
        <span class="grow"><strong>${esc(lesson.title)}</strong><span class="muted small">${lesson.minutes} min${extra}</span></span>
        <span class="chev">${mark && mark.done ? "✓" : "›"}</span>
      </button>`;
    })
    .join("");
  return `<p class="kicker">CURSO</p><h1>Desde cero, en orden.</h1>
    <p class="lead">Cada módulo cierra con tres preguntas.</p><div class="list mt">${rows}</div>`;
}

function blocks(list) {
  return list
    .map((block) => {
      if (block.type === "h") return `<h2>${esc(block.text)}</h2>`;
      if (block.type === "p") return `<p>${esc(block.text)}</p>`;
      if (block.type === "ul") return `<ul class="bars">${block.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
      return `<aside class="phrase card"><p class="kicker">${esc(block.title)}</p><p>${esc(block.text)}</p></aside>`;
    })
    .join("");
}

function lessonView(id) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return `<p class="muted">Esa pieza no está.</p>`;
  if (!state.lessons[id]) state.lessons[id] = { read: true, score: 0, done: false };
  else state.lessons[id].read = true;
  persist();
  if (!session.quiz || session.quiz.id !== id) {
    session.quiz = { id, index: 0, pick: null, checked: false, correct: 0 };
  }
  const q = session.quiz;
  const total = lesson.quiz.length;
  let quiz;
  if (q.index >= total) {
    const score = Math.round((q.correct / total) * 100);
    const prevScore = state.lessons[id] && state.lessons[id].done ? state.lessons[id].score : 0;
    state.lessons[id] = { read: true, score: Math.max(prevScore, score), done: true };
    persist();
    const nextL = lessons[lessons.findIndex((l) => l.id === id) + 1];
    quiz = `<section class="quiz card mt-lg">
      <p class="kicker">Control</p><div class="result-inline">${ring(score, 84)}<p class="big">${q.correct} de ${total}</p></div>
      <p class="muted small mt">${score === 100 ? "Cerrado. Pasá al módulo que sigue o a un caso." : "Releé los puntos que fallaste. En el oral se nota el criterio, no el apunte."}</p>
      <div class="row-btns mt"><button class="btn ghost" data-act="redoq">Rehacer el control</button>${nextL ? `<button class="btn" data-act="go" data-name="lesson" data-id="${nextL.id}">Siguiente módulo →</button>` : `<button class="btn" data-act="jump" data-name="cases">Ir a los casos →</button>`}</div>
    </section>`;
  } else {
    const item = lesson.quiz[q.index];
    const options = item.options
      .map((option, i) => {
        let cls = "choice";
        if (!q.checked && q.pick === i) cls += " on";
        if (q.checked && i === item.correct) cls += " good";
        if (q.checked && q.pick === i && i !== item.correct) cls += " bad";
        return `<button class="${cls}" data-act="pick" data-i="${i}" ${q.checked ? "disabled" : ""}>${esc(option)}</button>`;
      })
      .join("");
    quiz = `<section class="quiz card mt-lg">
      <p class="kicker">Control ${q.index + 1} / ${total}</p>${bar(q.index, total)}
      <h3>${esc(item.prompt)}</h3>
      ${options}
      ${q.checked ? `<p class="why">${q.pick === item.correct ? "✓ Correcto. " : "✗ No. "}${esc(item.why)}</p><button class="btn mt" data-act="nextq">${q.index + 1 === total ? "Ver resultado" : "Siguiente"}</button>` : `<button class="btn mt" data-act="check" ${q.pick === null ? "disabled" : ""}>Verificar</button>`}
    </section>`;
  }
  return `<p class="kicker">Módulo ${lesson.num} · ${lesson.minutes} min</p><h1>${esc(lesson.title)}</h1><p class="lead">${esc(lesson.lead)}</p><article class="prose">${blocks(lesson.blocks)}</article>${quiz}`;
}

function library() {
  const rows = docs
    .map(
      (doc) => `<button class="row card" data-act="go" data-name="doc" data-id="${doc.id}">
        <span class="num">${doc.num}</span>
        <span class="grow"><strong>${esc(doc.title)}</strong><span class="muted small">${esc(doc.short)}</span></span><span class="chev">›</span>
      </button>`,
    )
    .join("");
  return `<p class="kicker">LEGAJO</p><h1>Qué se pide y qué se mira.</h1><div class="list mt">${rows}</div>`;
}

function docView(id) {
  const doc = docs.find((item) => item.id === id);
  if (!doc) return `<p class="muted">Esa pieza no está.</p>`;
  const index = docs.findIndex((item) => item.id === id);
  const next = docs[index + 1];
  return `<p class="kicker">Documento ${doc.num}</p><h1>${esc(doc.title)}</h1>
    <p class="lead">${esc(doc.what)}</p>
    <h2>Qué mirar</h2><ul class="bars">${doc.lookFor.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <h2>Errores de mesa</h2><ul class="bars">${doc.pitfalls.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <aside class="phrase card"><p class="kicker">PARA DECIRLO</p><p>${esc(doc.phrase)}</p></aside>
    ${next ? `<button class="btn mt" data-act="go" data-name="doc" data-id="${next.id}">Siguiente: ${esc(next.title)} →</button>` : ""}`;
}

function caseIndex() {
  const rows = cases
    .map((item) => {
      const mark = state.cases[item.id];
      const badge = mark && mark.passed ? `<span class="pill ok">Listo · ${mark.score}</span>` : mark ? `<span class="pill warn">Mejor ${mark.score}</span>` : item.guided ? `<span class="pill">Guiado</span>` : "";
      return `<button class="row card" data-act="go" data-name="case" data-id="${item.id}">
        <span class="num code">${item.code}</span>
        <span class="grow"><strong>${esc(item.company)}</strong><span class="muted small">${esc(item.kind || "")} · ${esc(item.place)}</span></span>
        ${badge}<span class="chev">›</span>
      </button>`;
    })
    .join("");
  return `<p class="kicker">Mesa</p><h1>${cases.length} legajos, una decisión cada uno.</h1>
    <p class="lead">Leé las hojas, marcá las filas con error, confirmá los hallazgos y decidí. Puntaje: hallazgos 45, filas marcadas 15, decisión 40. Aprobás con la decisión correcta y 75 o más.</p><div class="list mt">${rows}</div>`;
}

function newCase(id) {
  return { id, step: "read", doc: 0, selected: [], flags: [], choice: null, saved: false };
}

function ensureCase(id) {
  if (!session.case || session.case.id !== id) session.case = newCase(id);
  return session.case;
}

function errRows(item) {
  const errs = [];
  item.docs.forEach((d) => d.rows.forEach((r) => { if (r.err) errs.push(d.id + ":" + r.label); }));
  return errs;
}

function grade(item, choice, selected, flags) {
  let raw = 0;
  item.findings.forEach((finding) => {
    if (finding.correct === selected.includes(finding.id)) raw += 1;
  });
  const findPart = raw / item.findings.length;
  const errs = errRows(item);
  const hit = flags.filter((k) => errs.includes(k)).length;
  const fp = flags.length - hit;
  const flagPart = errs.length ? hit / (errs.length + fp) : fp ? Math.max(0, 1 - fp / 3) : 1;
  const score = Math.round(findPart * 45 + flagPart * 15) + (choice === item.decision ? 40 : 0);
  return { score, passed: choice === item.decision && score >= 75, hit, fp, errs };
}

function caseView(id) {
  const item = cases.find((entry) => entry.id === id);
  if (!item) return `<p class="muted">Esa pieza no está.</p>`;
  const play = ensureCase(id);
  const steps = [["read", "Leer"], ["find", "Hallazgos"], ["decide", "Decisión"], ["result", "Resultado"]];
  const si = steps.findIndex(([k]) => k === play.step);
  const stepper = `<ol class="stepper">${steps.map(([k, l], i) => `<li class="${i < si ? "past" : i === si ? "on" : ""}"><span>${i + 1}</span>${l}</li>`).join("")}</ol>`;
  if (play.step === "result") return stepper + caseResult(item, play);
  if (play.step === "find") {
    const list = item.findings
      .map((finding) => {
        const on = play.selected.includes(finding.id);
        return `<button class="find card ${on ? "on" : ""}" data-act="toggle" data-id="${finding.id}" aria-pressed="${on}"><span class="box">${on ? "✓" : ""}</span><span>${esc(finding.text)}</span></button>`;
      })
      .join("");
    return `${stepper}<p class="kicker">${item.code} · Hallazgos</p><h1>Marcá solo lo que impide aprobar así como está.</h1>
      <p class="lead">Las filas que marcaste en los documentos ya tildaron su hallazgo. Podés ajustar. Podés no marcar nada: inventar un defecto también resta.</p>
      <p class="muted small">Filas marcadas en los documentos: ${play.flags.length}.</p>
      <div class="list">${list}</div>
      <div class="row-btns mt"><button class="btn ghost" data-act="step" data-step="read">← Volver a los documentos</button><button class="btn" data-act="step" data-step="decide">Elegir la decisión</button></div>`;
  }
  if (play.step === "decide") {
    const options = [
      ["aprobar", "ok", "El legajo cierra y el riesgo entra en el carril estándar."],
      ["observar", "warn", "Falta papel subsanable. No se habilita hasta que llegue."],
      ["escalar", "bad", "Hay opacidad, PEP, hit o un juicio que no es solo de la mesa."],
    ];
    return `${stepper}<p class="kicker">${item.code} · Decisión</p><h1>¿Qué hacés con ${esc(item.company)}?</h1>
      <div class="grid three mt">${options
        .map(([id, tone, hint]) => `<button class="decision card tone-${tone}" data-act="decide" data-d="${id}"><strong>${decisionLabel(id)}</strong><span class="small muted">${hint}</span></button>`)
        .join("")}</div>
      <button class="btn ghost mt" data-act="step" data-step="find">← Volver a los hallazgos</button>`;
  }
  const sheet = item.docs[play.doc];
  return `${stepper}<p class="kicker">${item.code}${item.guided ? " · Caso guiado" : ""}</p>
    <h1>${esc(item.company)}</h1>
    <p class="muted small">${esc(item.kind || "")} · ${esc(item.place)}</p>
    <p class="mt">${esc(item.briefing)}</p>
    <div class="grid two mt">
      <div class="card cell"><span class="label">Producto</span><p class="small">${esc(item.product)}</p></div>
      <div class="card cell"><span class="label">Orden de lectura</span><p class="small">Quién es, quién controla, quién firma, si cierra la operatoria.</p></div>
    </div>
    <div class="tabs-docs mt" role="tablist">${item.docs.map((d, i) => `<button role="tab" class="${i === play.doc ? "on" : ""}" data-act="docto" data-i="${i}" aria-selected="${i === play.doc}">${i + 1}. ${esc(d.title)}${d.rows.some((r) => play.flags.includes(d.id + ":" + r.label)) ? " ⚑" : ""}</button>`).join("")}</div>
    <p class="muted small mt">Tocá una fila para marcarla como error (⚑). Las marcas tildan el hallazgo que corresponde y también puntúan.</p>
    <article class="paper card">
      <span class="stamp" aria-hidden="true">FICTICIO</span>
      <p class="kicker">${esc(sheet.meta)}</p>
      <h2 class="paper-title">${esc(sheet.title)}</h2>
      ${sheet.rows
        .map((row) => {
          const k = sheet.id + ":" + row.label;
          const on = play.flags.includes(k);
          return `<button class="rowline ${on ? "on" : ""}" data-act="flag" data-k="${esc(k)}" aria-pressed="${on}"><span class="label">${esc(row.label)}${on ? ' <span class="flagtag">⚑ marcado</span>' : ""}</span><span class="small">${esc(row.value)}</span></button>`;
        })
        .join("")}
      ${sheet.note ? `<p class="note">${esc(sheet.note)}</p>` : ""}
    </article>
    <div class="pager">
      <button class="btn ghost" data-act="doc" data-dir="-1" ${play.doc === 0 ? "disabled" : ""}>← Anterior</button>
      <span class="muted small">Hoja ${play.doc + 1} de ${item.docs.length}</span>
      ${play.doc < item.docs.length - 1 ? `<button class="btn ghost" data-act="doc" data-dir="1">Siguiente →</button>` : `<button class="btn" data-act="step" data-step="find">Pasar a los hallazgos</button>`}
    </div>
    ${play.doc < item.docs.length - 1 ? `<button class="linkish" data-act="step" data-step="find">Ya leí lo necesario: ir a los hallazgos</button>` : ""}`;
}

function caseResult(item, play) {
  const result = grade(item, play.choice, play.selected, play.flags);
  if (!play.saved) {
    play.saved = true;
    const prev = state.cases[item.id];
    state.cases[item.id] = {
      decision: play.choice,
      score: Math.max(prev ? prev.score : 0, result.score),
      passed: Boolean((prev && prev.passed) || result.passed),
    };
    persist();
  }
  const next = cases[cases.findIndex((entry) => entry.id === item.id) + 1];
  const verb = decisionLabel(item.decision).toLowerCase();
  const note = result.passed
    ? "Listo para la mesa. La decisión era la correcta y los hallazgos cierran."
    : play.choice === item.decision
      ? "La decisión estaba bien. Te faltó precisión en los hallazgos o en las filas."
      : `La mesa no hacía eso: correspondía ${verb}. Mirá por qué, sin apurarte.`;
  const findings = item.findings
    .map((finding) => {
      const on = play.selected.includes(finding.id);
      const ok = finding.correct === on;
      return `<li class="card fb ${ok ? "ok" : "bad"}">
        <p class="small"><span class="pill ${ok ? "ok" : "bad"}">${ok ? "Bien" : "Revisar"}</span> ${on ? "Lo marcaste" : "No lo marcaste"}${finding.correct ? " · era un hallazgo" : " · no era un hallazgo"}</p>
        <p class="mt-s"><b>${esc(finding.text)}</b></p>
        <p class="muted small mt-s">${esc(finding.why)}</p>
      </li>`;
    })
    .join("");
  return `<p class="kicker">${item.code} · Resultado</p><h1>${esc(item.company)}</h1>
    <section class="card result ${result.passed ? "ok" : "no"}">
      ${ring(result.score, 96)}
      <div><p class="big">${result.passed ? "Aprobado" : "Todavía no"}</p><p class="muted small">${note}</p>
      <p class="small mt-s">Elegiste <b>${decisionLabel(play.choice).toLowerCase()}</b>. Correspondía <b>${verb}</b>.</p></div>
    </section>
    <h2>Hallazgos</h2><ul class="list plain">${findings}</ul>
    ${flagSummary(item, play, result)}<h2>Criterio</h2>${item.debrief.map((text) => `<p class="mt-s">${esc(text)}</p>`).join("")}
    <aside class="phrase card"><p class="kicker">Frase</p><p>${esc(item.phrase)}</p></aside>
    <p class="muted small mt">${esc(item.nextStep)}</p>
    <div class="row-btns mt">
      <button class="btn ghost" data-act="redo-case">Rehacer el caso</button>
      ${next ? `<button class="btn" data-act="go" data-name="case" data-id="${next.id}">Siguiente caso →</button>` : `<button class="btn" data-act="jump" data-name="cases">Volver a los casos</button>`}
    </div>`;
}

function flagSummary(item, play, result) {
  const errs = result.errs;
  const fp = play.flags.filter((k) => !errs.includes(k));
  const miss = errs.filter((k) => !play.flags.includes(k));
  const name = (k) => esc(k.split(":").slice(1).join(":"));
  return `<h2>Filas marcadas</h2>
    <p class="mt-s">${errs.length ? `Encontraste ${result.hit} de ${errs.length} filas con error.` : "Este legajo no tenía filas con error."}${fp.length ? ` Marcaste ${fp.length} fila(s) sin error.` : ""}</p>
    ${miss.length ? `<p class="small mt-s"><span class="pill warn">Te faltó</span> ${miss.map(name).join(" · ")}</p>` : ""}
    ${fp.length ? `<p class="small mt-s"><span class="pill bad">Sin error</span> ${fp.map(name).join(" · ")}</p>` : ""}`;
}

function interview() {
  const list = questions
    .map((item, index) => {
      const on = session.openQ === item.id;
      const body = on
        ? `<div class="q-body">
            ${[["En una frase", item.line], ["Qué miro", item.look], ["Qué decido", item.decide], ["Qué no hago", item.avoid]]
              .map(([label, text]) => `<p class="kicker mt">${label}</p><p class="mt-s">${esc(text)}</p>`)
              .join("")}
            <button class="btn ${state.practiced[item.id] ? "" : "ghost"} mt" data-act="practice" data-id="${item.id}">${state.practiced[item.id] ? "✓ Practicada" : "Marcar como practicada"}</button>
          </div>`
        : "";
      return `<article class="q card ${on ? "open" : ""}"><button class="q-head" data-act="openq" data-id="${item.id}" aria-expanded="${on}">
        <span class="num">${String(index + 1).padStart(2, "0")}</span><span class="grow">${esc(item.q)}</span>${state.practiced[item.id] ? '<span class="pill ok">✓</span>' : ""}<span class="chev">${on ? "–" : "+"}</span>
      </button>${body}</article>`;
    })
    .join("");
  const said = questions.filter((q) => state.practiced[q.id]).length;
  return `<p class="kicker">Oral</p><h1>Decisión, motivo, próximo paso.</h1>
    <p class="lead">Contestala en voz alta y recién después abrí la guía. Practicadas: ${said}/${questions.length}.</p>${bar(said, questions.length)}
    <div class="list mt">${list}</div>
    <h2>Preguntales vos</h2>
    <ul class="bars card pad">${questionsToAsk.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
    <h2>Ejemplos STAR</h2><p class="muted small">Situación, Tarea, Acción, Resultado. Adaptalos a tu experiencia real: no inventes.</p>
    <div class="grid two mt">${star.map((x) => `<article class="card pad"><p class="kicker">${esc(x.q)}</p>${[["S", x.s], ["T", x.t], ["A", x.a], ["R", x.r]].map(([k, v]) => `<p class="small mt-s"><b class="star">${k}</b> ${esc(v)}</p>`).join("")}</article>`).join("")}</div>
    <button class="btn mt-lg" data-act="jump" data-name="sim">Simulacro de entrevista →</button>`;
}

function more() {
  const items = [["exam", "Examen final", `${examPool().length} preguntas de todos los módulos. Aprobás con 70%.${state.exam ? " Mejor: " + state.exam + "%" : ""}`], ["sim", "Simulacro de entrevista", "Preguntas al azar con reloj, para contestar en voz alta."], ["glossary", "Glosario", "Siglas y conceptos en una línea."], ["cheat", "Ficha imprimible", "Una hoja para repasar el lunes antes de entrar."], ["sources", "Fuentes oficiales", "Normas y organismos citados."]];
  return `<p class="kicker">Más</p><h1>Cerrar el fin de semana.</h1><div class="grid two mt">${items.map(([n, t, d]) => `<button class="tile card" data-act="go" data-name="${n}"><span class="tile-ico">${icon(n)}</span><strong>${t}</strong><span class="muted small">${d}</span></button>`).join("")}</div>`;
}

function examPool() {
  const pool = [];
  lessons.forEach((l) => l.quiz.forEach((q) => pool.push(q)));
  examExtra.forEach((q) => pool.push(q));
  return pool;
}

function exam() {
  const pool = examPool();
  if (!session.exam) session.exam = { answers: {}, done: false };
  const e = session.exam;
  if (e.done) {
    const ok = pool.filter((q, i) => e.answers[i] === q.correct).length;
    const pct = Math.round((ok / pool.length) * 100);
    if (!e.saved) { e.saved = true; if (pct > (state.exam || 0)) { state.exam = pct; persist(); } }
    const wrong = pool.map((q, i) => [q, i]).filter(([q, i]) => e.answers[i] !== q.correct);
    return `<p class="kicker">Examen final</p><h1>${pct >= 70 ? "Aprobado." : "Todavía no."}</h1>
      <section class="card result ${pct >= 70 ? "ok" : "no"}">${ring(pct, 96)}<div><p class="big">${ok} de ${pool.length} correctas</p><p class="muted small">Aprobás con 70%. Tu mejor marca: ${state.exam}%.</p></div></section>
      ${wrong.length ? `<h2>Para repasar (${wrong.length})</h2>` : ""}
      <ul class="list plain">${wrong.map(([q, i]) => `<li class="card fb bad"><p class="small muted">Pregunta ${i + 1} · elegiste: ${esc(q.options[e.answers[i]])}</p><p class="mt-s"><b>${esc(q.prompt)}</b></p><p class="small mt-s"><span class="pill ok">Correcta</span> ${esc(q.options[q.correct])}</p><p class="muted small mt-s">${esc(q.why)}</p></li>`).join("")}</ul>
      <button class="btn mt" data-act="exam-reset">Rehacer examen</button>`;
  }
  const answered = Object.keys(e.answers).length;
  return `<div class="sticky-prog card"><span class="small"><b>${answered}</b>/${pool.length} respondidas</span>${bar(answered, pool.length)}</div>
    <p class="kicker">Examen final · ${pool.length} preguntas</p><h1>Sin ayuda. Elegí y seguí.</h1>
    ${pool.map((q, i) => `<section class="quiz card" id="ex-${i}"><p class="kicker">Pregunta ${i + 1}</p><h3>${esc(q.prompt)}</h3>
      ${q.options.map((o, j) => `<button class="choice ${e.answers[i] === j ? "on" : ""}" data-act="exam-pick" data-q="${i}" data-i="${j}" aria-pressed="${e.answers[i] === j}">${esc(o)}</button>`).join("")}</section>`).join("")}
    <button class="btn mt-lg" data-act="exam-done" ${answered < pool.length ? "disabled" : ""}>${answered < pool.length ? `Faltan ${pool.length - answered} para corregir` : "Corregir el examen"}</button>`;
}

function glossaryView() {
  return `<p class="kicker">Glosario</p><h1>Siglas sin miedo.</h1>
    <input class="search" type="search" placeholder="Buscar una sigla o concepto…" data-act="gsearch" aria-label="Buscar en el glosario" />
    <dl class="gloss mt">${glossary.map(([t, d]) => `<div class="card gitem" data-text="${esc((t + " " + d).toLowerCase())}"><dt>${esc(t)}</dt><dd class="small">${esc(d)}</dd></div>`).join("")}</dl>`;
}

function sourcesView() {
  return `<p class="kicker">Fuentes</p><h1>Normas y organismos.</h1>
    <p class="muted mt-s">Verificadas en octubre de 2026 contra las páginas oficiales. Las normas cambian: antes de la entrevista revisá la página de la UIF «Resoluciones aplicables a cada sujeto obligado».</p>
    <div class="list mt">${sources.map(([t, u]) => `<a class="row card" href="${esc(u)}" target="_blank" rel="noopener"><span class="grow"><strong>${esc(t)}</strong><span class="muted small">${esc(u.replace(/^https?:\/\//, "").split("/")[0])}</span></span><span class="chev">↗</span></a>`).join("")}</div>`;
}

function cheat() {
  const sec = (t, items) => `<section class="cheat-sec"><h3>${t}</h3><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></section>`;
  return `<div class="no-print"><p class="kicker">Ficha</p><h1>Una hoja para el lunes.</h1><button class="btn mt-s" data-act="print">Imprimir / guardar PDF</button></div>
  <div class="cheat card">
    <h1>Ficha de onboarding · PJ Argentina</h1>
    ${sec("Marco", ["Ley 25.246 (mod. Ley 27.739/2024). UIF regula; art. 20 = sujetos obligados.", "Bancos: Res. UIF 14/2023 (rige desde 1/4/2023; reemplazó a 30/2017), según 56/2024, 199/2024 y 78/2025 (umbrales).", "BF: art. 4 bis Ley 25.246 y Res. UIF 112/2021 → humano ≥10% capital/votos o control.", "PEP: Res. UIF 35/2023, texto según 192/2024. Cargo + 2 años. Hermanos sí, abuelos no.", "RePET: Res. UIF 207/2025 → congelar sin demora, avisar a la UIF, ROS FT en 24 h máx.", "GAFI: evaluación publicada el 18/12/2024; fuera de lista gris, en seguimiento intensificado."])}
    ${sec("Orden de lectura", ["Quién es (estatuto, inscripción, CUIT)", "Quién controla (BF hasta humanos)", "Quién firma (acta vigente, poder con facultades)", "Qué va a hacer (objeto vs actividad vs perfil vs balances)", "PEP / listas (RePET, ONU, OFAC por política)"])}
    ${sec("Qué cruzar", ["Razón social y CUIT idénticos en todo", "Mandatos vigentes (SA: hasta 3 ejercicios, art. 257 LGS)", "Reformas inscriptas; socia extranjera inscripta (art. 123 LGS)", "Firmas certificadas; balances legalizados por el CPCE", "Domicilio coincidente y reciente", "Fechas coherentes (acta antes de inscripción, constancias recientes)"])}
    ${sec("Decisión", ["<b>Aprobar</b>: cierra todo y el riesgo es estándar.", "<b>Observar</b>: falta o error subsanable; nada opera hasta que llegue.", "<b>Escalar</b>: PEP, hit, BF opaco, perfil incoherente, sospecha. Decide Compliance.", "Nunca: tipping-off, cerrar un hit solo, aprobar «y después vemos»."])}
    ${sec("Lavado", ["Colocación → estratificación → integración", "ROS: lo firma el Oficial de Cumplimiento (art. 21 inc. f: integra el órgano de administración)", "Conservación: 10 años mínimo (art. 21 inc. n)"])}
    <p class="muted small">Material de estudio. Sociedades ficticias.</p>
  </div>`;
}

function simTime() {
  const s = session.sim;
  return Math.floor((s.paused ? s.elapsed : s.elapsed + (Date.now() - s.start)) / 1000);
}

function fmt(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function sim() {
  if (!session.sim) session.sim = { i: 0, order: simulacro.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 8), start: Date.now(), elapsed: 0, paused: false };
  const s = session.sim;
  if (s.i >= s.order.length) return `<p class="kicker">Simulacro</p><h1>Terminaste.</h1><p class="lead">Repasá en Oral las que te costaron.</p><button class="btn mt" data-act="sim-reset">Otro simulacro</button>`;
  const t = simTime();
  return `<p class="kicker">Simulacro · ${s.i + 1}/${s.order.length}</p>${bar(s.i, s.order.length)}
    <section class="card sim">
      <h2 class="sim-q">${esc(simulacro[s.order[s.i]])}</h2>
      <p class="muted">Contestá en voz alta. Apuntá a 60–90 segundos: decisión, motivo, próximo paso.</p>
      <p class="timer ${t > 90 ? "over" : t >= 60 ? "good" : ""}" id="timer" aria-live="off">${fmt(t)}</p>
      <div class="row-btns center">
        <button class="btn ghost" data-act="sim-pause">${s.paused ? "▶ Seguir" : "❚❚ Pausa"}</button>
        <button class="btn ghost" data-act="sim-restart">↺ Reiniciar reloj</button>
        <button class="btn" data-act="sim-next">${s.i + 1 === s.order.length ? "Terminar" : "Siguiente pregunta →"}</button>
      </div>
    </section>
    <button class="linkish mt" data-act="sim-reset">Mezclar de nuevo</button>`;
}

function body() {
  const v = state.view;
  const views = { home, learn, library, cases: caseIndex, interview, more, exam, glossary: glossaryView, sources: sourcesView, cheat, sim };
  if (v.name === "lesson") return lessonView(v.id);
  if (v.name === "doc") return docView(v.id);
  if (v.name === "case") return caseView(v.id);
  return (views[v.name] || home)();
}

function render(forceTop) {
  const c = session.case;
  const key = [state.view.name, state.view.id || "", state.view.name === "case" && c ? c.step : "", session.exam && session.exam.done ? "d" : "", session.sim ? session.sim.i : ""].join(":");
  const scroll = forceTop || key !== lastKey;
  lastKey = key;
  const prevFocus = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : null;
  document.getElementById("app").innerHTML = shell(body());
  if (scroll) { window.scrollTo({ top: 0 }); document.getElementById("view").classList.add("anim"); }
  if (prevFocus === "gsearch") document.querySelector("[data-act=gsearch]").focus();
}

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "dark" ? "#0f1115" : "#f6f7fb");
}

applyTheme(localStorage.getItem(KEY + ":theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

document.getElementById("app").addEventListener("input", (event) => {
  if (event.target.dataset.act !== "gsearch") return;
  const q = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".gitem").forEach((n) => { n.hidden = q && !n.dataset.text.includes(q); });
});

document.getElementById("app").addEventListener("click", (event) => {
  const node = event.target.closest("[data-act]");
  if (!node || node.disabled) return;
  const act = node.dataset.act;
  if (act === "gsearch") return;
  if (act === "theme") {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(KEY + ":theme", t);
    applyTheme(t);
    return render();
  }
  if (act === "print") return window.print();
  if (act === "jump") return jump(node.dataset.name);
  if (act === "pop") return pop();
  if (act === "flag") {
    const play = session.case;
    const item = cases.find((c) => c.id === play.id);
    const k = node.dataset.k;
    play.flags = play.flags.includes(k) ? play.flags.filter((x) => x !== k) : [...play.flags, k];
    const [d, ...rest] = k.split(":");
    const doc = item.docs.find((x) => x.id === d);
    const row = doc && doc.rows.find((x) => x.label === rest.join(":"));
    const err = row && row.err;
    if (err && item.findings.some((f) => f.id === err)) {
      const any = play.flags.some((f) => { const [dd, ...ll] = f.split(":"); const dc = item.docs.find((x) => x.id === dd); const r = dc && dc.rows.find((x) => x.label === ll.join(":")); return r && r.err === err; });
      play.selected = play.selected.filter((x) => x !== err);
      if (any) play.selected.push(err);
    }
    return render();
  }
  if (act === "exam-pick") { session.exam.answers[node.dataset.q] = Number(node.dataset.i); return render(); }
  if (act === "exam-done") { session.exam.done = true; return render(true); }
  if (act === "exam-reset") { session.exam = null; return render(true); }
  if (act === "sim-next") { const s = session.sim; s.i++; s.start = Date.now(); s.elapsed = 0; s.paused = false; return render(); }
  if (act === "sim-pause") { const s = session.sim; if (s.paused) { s.start = Date.now(); s.paused = false; } else { s.elapsed += Date.now() - s.start; s.paused = true; } return render(); }
  if (act === "sim-restart") { const s = session.sim; s.start = Date.now(); s.elapsed = 0; return render(); }
  if (act === "sim-reset") { session.sim = null; return render(true); }
  if (act === "go") {
    if (node.dataset.name === "case") session.case = null;
    if (node.dataset.name === "lesson") session.quiz = null;
    if (node.dataset.name === "sim" && session.sim) { session.sim.start = Date.now(); session.sim.elapsed = 0; session.sim.paused = false; }
    return go({ name: node.dataset.name, id: node.dataset.id });
  }
  if (act === "reset") {
    if (!window.confirm("¿Borrar todo tu avance (módulos, casos, oral y examen)?")) return;
    state.lessons = {};
    state.cases = {};
    state.practiced = {};
    state.exam = 0;
    session.quiz = null;
    session.case = null;
    session.exam = null;
    session.sim = null;
    persist();
    return render(true);
  }
  if (act === "pick") { session.quiz.pick = Number(node.dataset.i); return render(); }
  if (act === "check") {
    const lesson = lessons.find((item) => item.id === session.quiz.id);
    session.quiz.checked = true;
    if (session.quiz.pick === lesson.quiz[session.quiz.index].correct) session.quiz.correct += 1;
    return render();
  }
  if (act === "nextq") { session.quiz.index += 1; session.quiz.pick = null; session.quiz.checked = false; session.quiz.saved = false; return render(); }
  if (act === "redoq") { session.quiz = { id: session.quiz.id, index: 0, pick: null, checked: false, correct: 0 }; return render(); }
  if (act === "doc") { const c = session.case; const n = cases.find((x) => x.id === c.id).docs.length; c.doc = Math.max(0, Math.min(n - 1, c.doc + Number(node.dataset.dir))); return render(); }
  if (act === "docto") { session.case.doc = Number(node.dataset.i); return render(); }
  if (act === "step") { session.case.step = node.dataset.step; return render(); }
  if (act === "toggle") {
    const id = node.dataset.id;
    const selected = session.case.selected;
    session.case.selected = selected.includes(id) ? selected.filter((item) => item !== id) : selected.concat(id);
    return render();
  }
  if (act === "decide") { session.case.choice = node.dataset.d; session.case.step = "result"; session.case.saved = false; return render(); }
  if (act === "redo-case") { session.case = newCase(session.case.id); return render(true); }
  if (act === "openq") { session.openQ = session.openQ === node.dataset.id ? null : node.dataset.id; return render(); }
  if (act === "practice") { state.practiced[node.dataset.id] = !state.practiced[node.dataset.id]; persist(); return render(); }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.view.name !== "home") pop();
});

render();

setInterval(() => {
  const t = document.getElementById("timer");
  if (!t || !session.sim || session.sim.paused || state.view.name !== "sim") return;
  const sec = simTime();
  t.textContent = fmt(sec);
  t.className = "timer " + (sec > 90 ? "over" : sec >= 60 ? "good" : "");
}, 500);
