const { lessons, docs, cases, questions, questionsToAsk } = window.ALTA;
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
};
const session = { quiz: null, case: null, openQ: questions[0] ? questions[0].id : null };
let lastKey = "";

function persist() {
  localStorage.setItem(
    KEY,
    JSON.stringify({ lessons: state.lessons, cases: state.cases, practiced: state.practiced }),
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

function shell(body) {
  const v = state.view;
  const home = v.name === "home";
  const tabs = [
    ["home", "Inicio"],
    ["learn", "Curso"],
    ["library", "Legajo"],
    ["cases", "Casos"],
    ["interview", "Oral"],
  ];
  const head = home
    ? `<div class="brand"><span class="mark">A</span><strong class="display">ALTA</strong></div>`
    : `<button class="back" data-act="pop">← Volver</button>`;
  return `
    <header class="top">${head}<span class="spacer">KYC · AML · Argentina</span></header>
    <main>${body}</main>
    <nav class="nav">${tabs
      .map(
        ([name, label]) =>
          `<button data-act="jump" data-name="${name}" class="${v.name === name ? "on" : ""}">${label}</button>`,
      )
      .join("")}</nav>`;
}

function home() {
  const learned = lessons.filter((l) => state.lessons[l.id] && state.lessons[l.id].done).length;
  const solved = cases.filter((c) => state.cases[c.id] && state.cases[c.id].passed).length;
  const said = questions.filter((q) => state.practiced[q.id]).length;
  const paths = [
    ["01", "learn", "Aprender el criterio", "Siete módulos cortos, desde cero, con un control al final de cada uno."],
    ["02", "library", "Leer un legajo", "Doce documentos: qué son, qué mirar y la frase para decirlo en voz alta."],
    ["03", "cases", "Resolver la mesa", "Seis empresas ficticias. Marcá hallazgos y decidí. Después ves el criterio."],
    ["04", "interview", "Ensayar el oral", "Doce preguntas con respuesta en cuatro tiempos, y preguntas para hacerles vos."],
  ];
  return `
    <p class="kicker">PARA LA ENTREVISTA DE ONBOARDING</p>
    <h1>Conocé al cliente antes de abrirle la puerta.</h1>
    <p class="lead">Minicurso de KYC, AML y legajos de personas jurídicas en Argentina. Criterio de mesa, documentos y seis sociedades ficticias para aprobar, observar o escalar.</p>
    <section class="stats">
      <div class="stat"><b>${learned}/${lessons.length}</b><span>Módulos</span></div>
      <div class="stat"><b>${solved}/${cases.length}</b><span>Casos</span></div>
      <div class="stat"><b>${said}/${questions.length}</b><span>Respuestas</span></div>
    </section>
    <section class="pocket">
      <p class="kicker">FICHA DE BOLSILLO</p>
      <ul>
        <li>Beneficiario final: persona humana, 10% o control. Res. UIF 112/2021.</li>
        <li>PEP: el cargo y dos años más. Hermanos sí. Abuelos no. Res. 192/2024.</li>
        <li>SA: art. 257 LGS, hasta tres ejercicios, y sigue hasta que lo reemplazan. Igual pedí acta reciente.</li>
        <li>SRL: gerentes, no directorio. IGJ es CABA, no el país.</li>
        <li>Hit de lista: no se cierra solo y no se le manda al cliente.</li>
        <li>Sin diligencia completa no hay alta. El ROS lo decide el Oficial, y no se avisa.</li>
      </ul>
    </section>
    ${paths
      .map(
        ([num, name, title, text]) => `
        <button class="path" data-act="jump" data-name="${name}">
          <span class="num">${num}</span>
          <span><strong>${title}</strong><span class="muted small">${text}</span></span>
        </button>`,
      )
      .join("")}
    <h2>Cómo usar el fin de semana</h2>
    <ol class="bars">
      <li><b>Viernes.</b> Módulos 1 a 3. Quedate con la ficha, no con un número de resolución que no cierres.</li>
      <li><b>Sábado.</b> Módulos 4 a 7, el legajo, y los dos primeros casos. El primero está guiado.</li>
      <li><b>Domingo.</b> El resto de los casos en voz alta y el oral. Decisión, motivo, próximo paso.</li>
    </ol>
    <p class="muted small mt-lg">Material de estudio. Las sociedades no existen. En el puesto manda el manual del sujeto obligado y la resolución sectorial vigente. Los umbrales en pesos cambian.</p>
    <button class="linkish mt" data-act="reset">Reiniciar la práctica</button>`;
}

function learn() {
  const rows = lessons
    .map((lesson) => {
      const mark = state.lessons[lesson.id];
      const extra = mark && mark.done ? ` · control ${mark.score}%` : mark && mark.read ? " · empezado" : "";
      return `<button class="row" data-act="go" data-name="lesson" data-id="${lesson.id}">
        <span class="num">${lesson.num}</span>
        <span><strong>${esc(lesson.title)}</strong><span class="muted small">${lesson.minutes} min${extra}</span></span>
      </button>`;
    })
    .join("");
  return `<p class="kicker">CURSO</p><h1>Desde cero, en orden.</h1>
    <p class="lead">Cada módulo cierra con tres preguntas.</p><div class="mt">${rows}</div>`;
}

function blocks(list) {
  return list
    .map((block) => {
      if (block.type === "h") return `<h2>${esc(block.text)}</h2>`;
      if (block.type === "p") return `<p class="small mt">${esc(block.text)}</p>`;
      if (block.type === "ul") return `<ul class="bars">${block.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
      return `<aside class="phrase"><p class="kicker">${esc(block.title)}</p><p>${esc(block.text)}</p></aside>`;
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
    state.lessons[id] = { read: true, score, done: true };
    persist();
    quiz = `<section class="quiz mt-lg" style="padding:1rem">
      <p class="kicker">CONTROL</p><p class="score">${score}%</p>
      <p class="muted small mt">${score === 100 ? "Cerrado. Pasá al módulo que sigue o a un caso." : "Releé los puntos que fallaste. En el oral se nota el criterio, no el apunte."}</p>
      <button class="linkish" data-act="redoq">Rehacer el control</button>
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
    quiz = `<section class="quiz mt-lg" style="padding:1rem">
      <p class="kicker">CONTROL ${q.index + 1} / ${total}</p>
      <h2 style="margin-top:0.6rem">${esc(item.prompt)}</h2>
      ${options}
      ${q.checked ? `<p class="muted small mt">${esc(item.why)}</p><button class="btn mt" data-act="nextq">${q.index + 1 === total ? "Ver resultado" : "Siguiente"}</button>` : `<button class="btn mt" data-act="check" ${q.pick === null ? "disabled" : ""}>Verificar</button>`}
    </section>`;
  }
  return `<p class="kicker">MÓDULO ${lesson.num}</p><h1>${esc(lesson.title)}</h1><p class="lead">${esc(lesson.lead)}</p>${blocks(lesson.blocks)}${quiz}`;
}

function library() {
  const rows = docs
    .map(
      (doc) => `<button class="row" data-act="go" data-name="doc" data-id="${doc.id}">
        <span class="num">${doc.num}</span>
        <span><strong>${esc(doc.title)}</strong><span class="muted small">${esc(doc.short)}</span></span>
      </button>`,
    )
    .join("");
  return `<p class="kicker">LEGAJO</p><h1>Qué se pide y qué se mira.</h1><div class="mt">${rows}</div>`;
}

function docView(id) {
  const doc = docs.find((item) => item.id === id);
  if (!doc) return `<p class="muted">Esa pieza no está.</p>`;
  const index = docs.findIndex((item) => item.id === id);
  const next = docs[index + 1];
  return `<p class="kicker">DOCUMENTO ${doc.num}</p><h1>${esc(doc.title)}</h1>
    <p class="small mt">${esc(doc.what)}</p>
    <h2>Qué mirar</h2><ul class="bars">${doc.lookFor.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <h2>Errores de mesa</h2><ul class="bars">${doc.pitfalls.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <aside class="phrase"><p class="kicker">PARA DECIRLO</p><p>${esc(doc.phrase)}</p></aside>
    ${next ? `<button class="linkish mt" data-act="go" data-name="doc" data-id="${next.id}">Siguiente: ${esc(next.title)}</button>` : ""}`;
}

function caseIndex() {
  const rows = cases
    .map((item) => {
      const mark = state.cases[item.id];
      const extra = `${item.guided ? " · caso guiado" : ""}${mark ? ` · mejor ${mark.score}` : ""}${mark && mark.passed ? " · listo" : ""}`;
      return `<button class="row" data-act="go" data-name="case" data-id="${item.id}">
        <span class="num">${item.code}</span>
        <span><strong>${esc(item.company)}</strong><span class="muted small">${esc(item.place)}${extra}</span></span>
      </button>`;
    })
    .join("");
  return `<p class="kicker">MESA</p><h1>Seis legajos, una decisión.</h1>
    <p class="lead">Marcá solo los hallazgos que impiden aprobar así como está. Después elegí.</p><div class="mt">${rows}</div>`;
}

function ensureCase(id) {
  if (!session.case || session.case.id !== id) {
    session.case = { id, step: "read", doc: 0, selected: [], choice: null };
  }
  return session.case;
}

function grade(item, choice, selected) {
  let raw = 0;
  item.findings.forEach((finding) => {
    if (finding.correct === selected.includes(finding.id)) raw += 10;
  });
  const score = Math.round((raw / (item.findings.length * 10)) * 60) + (choice === item.decision ? 40 : 0);
  return { score, passed: choice === item.decision && score >= 75 };
}

function caseView(id) {
  const item = cases.find((entry) => entry.id === id);
  if (!item) return `<p class="muted">Esa pieza no está.</p>`;
  const play = ensureCase(id);
  if (play.step === "result") return caseResult(item, play);
  if (play.step === "find") {
    const list = item.findings
      .map((finding) => {
        const on = play.selected.includes(finding.id);
        return `<button class="find ${on ? "on" : ""}" data-act="toggle" data-id="${finding.id}"><span class="box">${on ? "✓" : ""}</span><span>${esc(finding.text)}</span></button>`;
      })
      .join("");
    return `<p class="kicker">${item.code} · HALLAZGOS</p><h1>Marcá solo lo que impide aprobar así como está.</h1>
      <p class="lead">Podés no marcar nada. Inventar un defecto también resta.</p>${list}
      <button class="btn mt" data-act="step" data-step="decide">Elegir la decisión</button>`;
  }
  if (play.step === "decide") {
    const options = [
      ["aprobar", "sage", "El legajo cierra y el riesgo entra en el carril estándar."],
      ["observar", "brass", "Falta papel subsanable. No se habilita hasta que llegue."],
      ["escalar", "oxide", "Hay opacidad, PEP, hit o un juicio que no es solo de la mesa."],
    ];
    return `<p class="kicker">${item.code} · DECISIÓN</p><h1>¿Qué hacés con ${esc(item.company)}?</h1>
      ${options
        .map(
          ([id, tone, hint]) =>
            `<button class="choice" data-act="decide" data-d="${id}"><span class="kicker ${tone === "sage" ? "sage" : ""} ${tone === "oxide" ? "oxide" : ""}">${decisionLabel(id)}</span><span class="small" style="display:block;margin-top:0.3rem">${hint}</span></button>`,
        )
        .join("")}`;
  }
  const sheet = item.docs[play.doc];
  return `<p class="kicker">${item.code}${item.guided ? " · CASO GUIADO" : ""}</p>
    <h1>${esc(item.company)}</h1>
    <p class="muted small mt">${esc(item.kind)} · ${esc(item.place)}</p>
    <p class="small mt">${esc(item.briefing)}</p>
    <div class="docgrid">
      <div class="cell"><span class="label">Producto</span><p class="small mt">${esc(item.product)}</p></div>
      <div class="cell"><span class="label">Orden de lectura</span><p class="small mt">Quién es, quién controla, quién firma, si cierra la operatoria.</p></div>
    </div>
    <div class="pager">
      <button class="linkish" data-act="doc" data-dir="-1" ${play.doc === 0 ? "disabled" : ""}>Anterior</button>
      <span class="muted small">Hoja ${play.doc + 1} de ${item.docs.length}</span>
      <button class="linkish" data-act="doc" data-dir="1" ${play.doc === item.docs.length - 1 ? "disabled" : ""}>Siguiente</button>
    </div>
    <article class="paper">
      <p class="kicker">${esc(sheet.meta)}</p>
      <h2 style="margin-top:0.35rem">${esc(sheet.title)}</h2>
      ${sheet.rows
        .map(
          (row) =>
            `<div class="rowline"><div class="label">${esc(row.label)}</div><p class="small" style="margin-top:0.25rem">${esc(row.value)}</p></div>`,
        )
        .join("")}
      ${sheet.note ? `<p class="note">${esc(sheet.note)}</p>` : ""}
    </article>
    <button class="btn mt" data-act="step" data-step="find">${play.doc < item.docs.length - 1 ? "Ya leí lo necesario" : "Pasar a los hallazgos"}</button>`;
}

function caseResult(item, play) {
  const result = grade(item, play.choice, play.selected);
  const prev = state.cases[item.id];
  const stored = {
    decision: play.choice,
    score: Math.max(prev ? prev.score : 0, result.score),
    passed: Boolean((prev && prev.passed) || result.passed),
    findings: play.selected,
  };
  if (!prev || result.score >= prev.score) state.cases[item.id] = stored;
  else if (result.passed) state.cases[item.id] = { ...prev, passed: true };
  persist();
  const next = cases[cases.findIndex((entry) => entry.id === item.id) + 1];
  const verb = decisionLabel(item.decision).toLowerCase();
  const note = result.passed
    ? "Listo para la mesa. La decisión era la correcta y los hallazgos cierran."
    : play.choice === item.decision
      ? "La decisión estaba bien. Te faltó precisión en los hallazgos."
      : `La mesa ${verb}ía. Mirá por qué, sin apurarte.`;
  const findings = item.findings
    .map((finding) => {
      const on = play.selected.includes(finding.id);
      const ok = finding.correct === on;
      return `<li style="margin-top:0.8rem">
        <p class="${ok ? "sage" : "oxide"} small">${ok ? "Bien" : "Revisar"} · ${on ? "lo marcaste" : "no lo marcaste"}${finding.correct ? " · era un hallazgo" : " · no era un hallazgo"}</p>
        <p class="small mt">${esc(finding.text)}</p>
        <p class="muted small mt">${esc(finding.why)}</p>
      </li>`;
    })
    .join("");
  return `<p class="kicker">${item.code}</p><h1>${esc(item.company)}</h1>
    <p class="score ${result.passed ? "ok" : "no"}">${result.score}</p>
    <p class="muted small mt">${note}</p>
    <h2>Decisión</h2>
    <p class="small mt">Elegiste ${decisionLabel(play.choice).toLowerCase()}. Correspondía ${verb}.</p>
    <h2>Hallazgos</h2><ul class="bars">${findings}</ul>
    <h2>Criterio</h2>${item.debrief.map((text) => `<p class="small mt">${esc(text)}</p>`).join("")}
    <aside class="phrase"><p class="kicker">FRASE</p><p>${esc(item.phrase)}</p></aside>
    <p class="muted small mt">${esc(item.nextStep)}</p>
    <div class="stack mt">
      <button class="btn ghost" data-act="redo-case">Rehacer el caso</button>
      ${next ? `<button class="btn" data-act="go" data-name="case" data-id="${next.id}">Siguiente caso</button>` : ""}
    </div>`;
}

function interview() {
  const list = questions
    .map((item, index) => {
      const on = session.openQ === item.id;
      const body = on
        ? `<div style="padding:0 1rem 1rem">
            ${[
              ["En una frase", item.line],
              ["Qué miro", item.look],
              ["Qué decido", item.decide],
              ["Qué no hago", item.avoid],
            ]
              .map(([label, text]) => `<p class="kicker mt">${label}</p><p class="small mt">${esc(text)}</p>`)
              .join("")}
            <button class="btn ${state.practiced[item.id] ? "" : "ghost"} mt" data-act="practice" data-id="${item.id}">${state.practiced[item.id] ? "Practicada" : "Marcar como practicada"}</button>
          </div>`
        : "";
      return `<article class="q"><button class="row" data-act="openq" data-id="${item.id}" style="border:0">
        <span class="num">${String(index + 1).padStart(2, "0")}</span><span>${esc(item.q)}</span>
      </button>${body}</article>`;
    })
    .join("");
  return `<p class="kicker">ORAL</p><h1>Decisión, motivo, próximo paso.</h1>
    <p class="lead">Contestala en voz alta y recién después abrí la guía.</p>
    <div class="stack mt">${list}</div>
    <h2>Preguntáles vos</h2>
    <ul class="ask bars">${questionsToAsk.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>`;
}

function body() {
  const v = state.view;
  if (v.name === "home") return home();
  if (v.name === "learn") return learn();
  if (v.name === "lesson") return lessonView(v.id);
  if (v.name === "library") return library();
  if (v.name === "doc") return docView(v.id);
  if (v.name === "cases") return caseIndex();
  if (v.name === "case") return caseView(v.id);
  if (v.name === "interview") return interview();
  return home();
}

function render() {
  const key = state.view.name + ":" + (state.view.id || "");
  const scroll = key !== lastKey;
  lastKey = key;
  document.getElementById("app").innerHTML = shell(body());
  if (scroll) window.scrollTo(0, 0);
}

document.getElementById("app").addEventListener("click", (event) => {
  const node = event.target.closest("[data-act]");
  if (!node || node.disabled) return;
  const act = node.dataset.act;
  if (act === "jump") return jump(node.dataset.name);
  if (act === "pop") return pop();
  if (act === "go") {
    if (node.dataset.name === "case") session.case = null;
    if (node.dataset.name === "lesson") session.quiz = null;
    return go({ name: node.dataset.name, id: node.dataset.id });
  }
  if (act === "reset") {
    state.lessons = {};
    state.cases = {};
    state.practiced = {};
    session.quiz = null;
    session.case = null;
    persist();
    return render();
  }
  if (act === "pick") {
    session.quiz.pick = Number(node.dataset.i);
    return render();
  }
  if (act === "check") {
    const lesson = lessons.find((item) => item.id === session.quiz.id);
    session.quiz.checked = true;
    if (session.quiz.pick === lesson.quiz[session.quiz.index].correct) session.quiz.correct += 1;
    return render();
  }
  if (act === "nextq") {
    session.quiz.index += 1;
    session.quiz.pick = null;
    session.quiz.checked = false;
    return render();
  }
  if (act === "redoq") {
    session.quiz = { id: session.quiz.id, index: 0, pick: null, checked: false, correct: 0 };
    return render();
  }
  if (act === "doc") {
    session.case.doc += Number(node.dataset.dir);
    return render();
  }
  if (act === "step") {
    session.case.step = node.dataset.step;
    return render();
  }
  if (act === "toggle") {
    const id = node.dataset.id;
    const selected = session.case.selected;
    session.case.selected = selected.includes(id) ? selected.filter((item) => item !== id) : selected.concat(id);
    return render();
  }
  if (act === "decide") {
    session.case.choice = node.dataset.d;
    session.case.step = "result";
    return render();
  }
  if (act === "redo-case") {
    session.case = { id: session.case.id, step: "read", doc: 0, selected: [], choice: null };
    return render();
  }
  if (act === "openq") {
    session.openQ = session.openQ === node.dataset.id ? null : node.dataset.id;
    return render();
  }
  if (act === "practice") {
    state.practiced[node.dataset.id] = !state.practiced[node.dataset.id];
    persist();
    return render();
  }
});

render();
