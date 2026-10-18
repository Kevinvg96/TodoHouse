// ============================================================
// Wachtwoord herstellen: de link in de mail brengt de gebruiker
// hier (met een tijdelijke herstel-sessie). Daarna nieuw
// wachtwoord instellen via sb.auth.updateUser().
// ============================================================

const MIN_LENGTH = 12; // pas aan indien gewenst (zet ook gelijk in Supabase > Auth > Password)

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const waitEl = document.getElementById("reset-wait");
const formEl = document.getElementById("reset-form");
const msgEl = document.getElementById("msg");

function showMsg(text, kind) {
  msgEl.textContent = text;
  msgEl.className = "msg show " + kind;
}

function showForm() {
  waitEl.style.display = "none";
  formEl.style.display = "block";
}

// Herstel-sessie detecteren (event of reeds aanwezige sessie)
sb.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") showForm();
});

setTimeout(async () => {
  if (formEl.style.display === "block") return;
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    showForm();
  } else {
    waitEl.style.display = "none";
    showMsg("Deze link is ongeldig of verlopen. Vraag op de aanmeldpagina een nieuwe aan via 'Wachtwoord vergeten?'.", "error");
  }
}, 1500);

document.getElementById("btn-save").addEventListener("click", async () => {
  const pw1 = document.getElementById("pw1").value;
  const pw2 = document.getElementById("pw2").value;
  if (pw1.length < MIN_LENGTH) {
    showMsg("Je wachtwoord moet minstens " + MIN_LENGTH + " tekens bevatten.", "error");
    return;
  }
  if (pw1 !== pw2) {
    showMsg("De twee wachtwoorden zijn niet gelijk.", "error");
    return;
  }
  const { error } = await sb.auth.updateUser({ password: pw1 });
  if (error) {
    showMsg(error.message, "error");
    return;
  }
  showMsg("Wachtwoord gewijzigd. Je wordt doorgestuurd…", "ok");
  formEl.style.display = "none";
  await sb.auth.signOut();
  setTimeout(() => { window.location.href = "index.html"; }, 1500);
});
