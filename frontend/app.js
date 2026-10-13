const API = (window.API_URL || "").replace(/\/$/, "");

const $ = (id) => document.getElementById(id);
const form = $("aluno-form");
const msg = $("msg");

let cursos = [];

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).error || ""; } catch {}
    throw new Error(`Erro ${res.status} ${detail}`.trim());
  }
  return res.status === 204 ? null : res.json();
}

function showError(err) {
  msg.textContent = err.message;
}

const nomeCurso = (idCurso) =>
  cursos.find((c) => String(c.id) === String(idCurso))?.nomeDoCurso ?? "—";

// ---------- CURSOS ----------
async function loadCursos() {
  cursos = await request("/cursos");
  $("curso").innerHTML = cursos
    .map((c) => `<option value="${c.id}">${c.nomeDoCurso}</option>`)
    .join("");
  $("cursos-list").innerHTML = cursos
    .map(
      (c) => `<li>${c.nomeDoCurso}
        <button class="danger" data-del-curso="${c.id}">Apagar</button></li>`
    )
    .join("");
}

$("curso-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await request("/cursos", {
      method: "POST",
      body: JSON.stringify({ nomeDoCurso: $("novo-curso").value.trim() }),
    });
    e.target.reset();
    await refresh();
  } catch (err) { showError(err); }
});

$("cursos-list").addEventListener("click", async (e) => {
  const id = e.target.dataset.delCurso;
  if (!id || !confirm("Apagar curso?")) return;
  try {
    await request(`/cursos/${id}`, { method: "DELETE" });
    await refresh();
  } catch (err) { showError(err); }
});

// ---------- ALUNOS ----------
async function loadAlunos() {
  const alunos = await request("/alunos");
  $("alunos-body").innerHTML = alunos
    .map(
      (a) => `<tr>
        <td>${a.nome}</td><td>${a.apelido}</td>
        <td>${nomeCurso(a.idCurso)}</td><td>${a.anoCurricular}</td>
        <td class="actions">
          <button class="secondary" data-edit="${a.id}">Editar</button>
          <button class="danger" data-del="${a.id}">Apagar</button>
        </td></tr>`
    )
    .join("");
}

async function refresh() {
  msg.textContent = "";
  try {
    await loadCursos();
    await loadAlunos();
  } catch (err) { showError(err); }
}

function resetForm() {
  form.reset();
  $("aluno-id").value = "";
  $("submit-btn").textContent = "Adicionar";
  $("cancel-btn").hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // mantém o tipo original do id do curso (número no json-server, string no Mongo)
  const curso = cursos.find((c) => String(c.id) === $("curso").value);
  const body = {
    nome: $("nome").value.trim(),
    apelido: $("apelido").value.trim(),
    idCurso: curso.id,
    anoCurricular: Number($("ano").value),
  };
  const id = $("aluno-id").value;
  try {
    await request(id ? `/alunos/${id}` : "/alunos", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    resetForm();
    await loadAlunos();
  } catch (err) { showError(err); }
});

$("alunos-body").addEventListener("click", async (e) => {
  const { edit, del } = e.target.dataset;
  try {
    if (del) {
      if (!confirm("Apagar aluno?")) return;
      await request(`/alunos/${del}`, { method: "DELETE" });
      await loadAlunos();
    } else if (edit) {
      const a = await request(`/alunos/${edit}`);
      $("aluno-id").value = a.id;
      $("nome").value = a.nome;
      $("apelido").value = a.apelido;
      $("curso").value = String(a.idCurso);
      $("ano").value = a.anoCurricular;
      $("submit-btn").textContent = "Guardar";
      $("cancel-btn").hidden = false;
    }
  } catch (err) { showError(err); }
});

$("cancel-btn").addEventListener("click", resetForm);

refresh();
