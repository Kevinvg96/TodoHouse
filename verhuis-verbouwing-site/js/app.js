// ============================================================
// Checklist app: laadt taken + afvinkingen per lijst, toont
// "stempels" (wie + wanneer), laat toevoegen toe.
// De echte toegangscontrole gebeurt in de database (RLS) —
// dit script stuurt enkel door als er geen geldige sessie is.
// ============================================================

const PERSON_LABELS = { kevin: "Kevin", melissa: "Melissa" };

let sb;
let me = null;          // { id, display_name, initials }
let currentList = "verhuis";
let tasksCache = [];
let completionsByTask = {}; // task_id -> { shared/kevin/melissa: completion }

async function main() {
  if (!SUPABASE_URL.includes("supabase.co") || SUPABASE_ANON_KEY === "JOUW-ANON-KEY") {
    document.getElementById("gate").textContent =
      "Nog niet geconfigureerd — vul js/supabase-config.js aan (zie README.md).";
    return;
  }

  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  // confirm this user is an approved member (RLS also enforces this
  // server-side — this lookup just gives us the display name)
  const { data: memberRow, error: memberErr } = await sb
    .from("members")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (memberErr || !memberRow) {
    await sb.auth.signOut();
    alert("Dit account heeft nog geen toegang. Vraag Kevin om je toe te voegen aan de 'members' tabel.");
    window.location.href = "index.html";
    return;
  }

  me = memberRow;

  document.getElementById("gate").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("who-name").textContent = me.display_name;

  document.getElementById("btn-logout").addEventListener("click", async () => {
    await sb.auth.signOut();
    window.location.href = "index.html";
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentList = tab.dataset.list;
      loadList();
    });
  });

  document.getElementById("new-category").addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const cat = e.target.value.trim() || "Overig";
    const title = prompt(`Eerste taak in categorie "${cat}":`);
    if (!title || !title.trim()) return;
    await addTask(cat, title.trim(), false);
    e.target.value = "";
  });

  await loadList();
}

async function loadList() {
  const { data: tasks, error: tErr } = await sb
    .from("tasks")
    .select("*")
    .eq("list", currentList)
    .order("sort_order", { ascending: true });

  if (tErr) {
    console.error(tErr);
    return;
  }
  tasksCache = tasks;

  const ids = tasks.map(t => t.id);
  completionsByTask = {};
  if (ids.length) {
    const { data: completions, error: cErr } = await sb
      .from("completions")
      .select("*")
      .in("task_id", ids);
    if (cErr) console.error(cErr);
    (completions || []).forEach(c => {
      completionsByTask[c.task_id] = completionsByTask[c.task_id] || {};
      completionsByTask[c.task_id][c.person] = c;
    });
  }

  render();
}

function render() {
  const wrap = document.getElementById("categories");
  wrap.innerHTML = "";

  const categories = [];
  tasksCache.forEach(t => {
    if (!categories.includes(t.category)) categories.push(t.category);
  });

  let totalSlots = 0, doneSlots = 0;

  categories.forEach(cat => {
    const catTasks = tasksCache.filter(t => t.category === cat);
    const section = document.createElement("div");
    section.className = "category";

    const head = document.createElement("div");
    head.className = "category-head";
    head.innerHTML = `<span class="corner"></span><h2>${escapeHtml(cat)}</h2><span class="category-count"></span>`;
    section.appendChild(head);

    catTasks.forEach(task => {
      const row = document.createElement("div");
      row.className = "task";

      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.title;
      row.appendChild(title);

      const stamps = document.createElement("div");
      stamps.className = "stamps";

      const persons = task.requires_both ? ["kevin", "melissa"] : ["shared"];
      persons.forEach(person => {
        totalSlots++;
        const completion = (completionsByTask[task.id] || {})[person];
        if (completion) doneSlots++;

        const line = document.createElement("div");
        line.className = "stampline";

        const box = document.createElement("input");
        box.type = "checkbox";
        box.className = "stampbox";
        box.checked = !!completion;
        box.addEventListener("change", () => toggle(task, person, box.checked));
        line.appendChild(box);

        const meta = document.createElement("span");
        if (task.requires_both) {
          meta.innerHTML = completion
            ? `<b>${PERSON_LABELS[person]}</b> — ${escapeHtml(completion.completed_by_name)} · ${formatDate(completion.completed_at)}`
            : `<b>${PERSON_LABELS[person]}</b>`;
          meta.className = "stamp-meta" + (completion ? "" : " empty");
        } else {
          meta.className = "stamp-meta" + (completion ? "" : " empty");
          meta.textContent = completion
            ? `${completion.completed_by_name} · ${formatDate(completion.completed_at)}`
            : "nog niet afgevinkt";
        }
        line.appendChild(meta);
        stamps.appendChild(line);
      });

      row.appendChild(stamps);
      section.appendChild(row);
    });

    // quick-add row for this category
    const addRow = document.createElement("div");
    addRow.className = "add-row";
    addRow.innerHTML = `
      <input type="text" placeholder="Nieuwe taak in '${escapeHtml(cat)}'…">
      <label><input type="checkbox" class="dbl"> dubbel (Kevin + Melissa)</label>
      <button class="btn small">Toevoegen</button>
    `;
    const input = addRow.querySelector("input[type=text]");
    const dbl = addRow.querySelector(".dbl");
    const btn = addRow.querySelector("button");
    const submit = async () => {
      const val = input.value.trim();
      if (!val) return;
      await addTask(cat, val, dbl.checked);
      input.value = "";
      dbl.checked = false;
    };
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
    section.appendChild(addRow);

    wrap.appendChild(section);
  });

  const pct = totalSlots ? Math.round((doneSlots / totalSlots) * 100) : 0;
  document.getElementById("progress-label").textContent = `${doneSlots} / ${totalSlots} afgevinkt`;
  document.getElementById("progress-pct").textContent = `${pct}%`;
  document.getElementById("tape-fill").style.width = pct + "%";
}

async function toggle(task, person, checked) {
  if (checked) {
    const { error } = await sb.from("completions").insert({
      task_id: task.id,
      person,
      completed_by: me.id,
      completed_by_name: me.display_name,
    });
    if (error) { console.error(error); alert("Kon niet opslaan: " + error.message); }
  } else {
    const { error } = await sb
      .from("completions")
      .delete()
      .eq("task_id", task.id)
      .eq("person", person);
    if (error) { console.error(error); alert("Kon niet verwijderen: " + error.message); }
  }
  await loadList();
}

async function addTask(category, title, requiresBoth) {
  const maxSort = tasksCache.reduce((m, t) => Math.max(m, t.sort_order), 0);
  const { error } = await sb.from("tasks").insert({
    list: currentList,
    category,
    title,
    requires_both: requiresBoth,
    sort_order: maxSort + 1,
    created_by: me.id,
  });
  if (error) { console.error(error); alert("Kon taak niet toevoegen: " + error.message); return; }
  await loadList();
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
    " " + d.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

main();
