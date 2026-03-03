// app.js
const lectures = window.LECTURES || [];

function getLectureIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return Number.isFinite(id) ? id : null;
}

function renderHome() {
  const grid = document.getElementById("lecture-grid");
  if (!grid) return;

  grid.innerHTML = lectures
    .map(
      (lec) => `
      <a class="lecture-button" href="lecture.html?id=${lec.id}">
        <div class="lecture-num">Lecture ${lec.id}</div>
        <div class="lecture-title">${lec.title}</div>
        <div class="lecture-sub subtle">${lec.subtitle ?? ""}</div>
      </a>
    `
    )
    .join("");
}

function renderLecturePage() {
  const shelf = document.getElementById("wine-shelf");
  if (!shelf) return;

  const id = getLectureIdFromUrl();
  const lecture = lectures.find((l) => l.id === id);

  if (!lecture) {
    document.getElementById("lecture-title").textContent = "Lecture not found";
    document.getElementById("lecture-notes").innerHTML =
      `<p class="subtle">Check the link or lecture id.</p>`;
    return;
  }

  document.title = `Lecture ${lecture.id} • ${lecture.title}`;
  document.getElementById("lecture-title").textContent =
    `Lecture ${lecture.id}: ${lecture.title}`;
  document.getElementById("lecture-subtitle").textContent = lecture.subtitle || "";
  const notesWrapper = document.getElementById("lecture-notes");
const notesEl = document.getElementById("notes");

// If notesPath exists, load external HTML.
// Else fall back to lecture.notes (old behavior).
if (lecture.notesPath) {
// Optional: show a quick loading state
if (notesEl) notesEl.innerHTML = `<p class="subtle">Loading notes…</p>`;
loadNotes(lecture.notesPath);
} else {
if (notesWrapper) notesWrapper.innerHTML = lecture.notes || "";
}

  // “Wine objects” rendered consistently
  shelf.innerHTML = lecture.wines
    .map(
      (wine) => `
      <figure class="wine-card" tabindex="0" aria-label="${escapeHtml(wine.name)}">
        <img class="wine-img" src="${wine.image}" alt="${escapeHtml(wine.name)}" />
        <figcaption class="wine-caption">
          <div class="wine-name">${escapeHtml(wine.name)}</div>
          <div class="wine-rating">${escapeHtml(wine.rating || "")}</div>
        </figcaption>
      </figure>
    `
    )
    .join("");
}

async function loadNotes(notesPath) {
  const notesEl = document.getElementById("notes");
  try {
    const res = await fetch(notesPath);
    if (!res.ok) throw new Error(`Failed to load notes: ${res.status}`);
    notesEl.innerHTML = await res.text();
  } catch (err) {
    notesEl.innerHTML = `<p class="muted">Notes unavailable.</p>`;
    console.error(err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderHome();
renderLecturePage();