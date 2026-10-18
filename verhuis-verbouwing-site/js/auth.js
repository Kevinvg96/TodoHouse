// ============================================================
// Login pagina: inloggen, account aanmaken, doorsturen naar app.html
// ============================================================

const setupEl = document.getElementById("setup-check");
const shellEl = document.getElementById("login-shell");

if (!SUPABASE_URL.includes("supabase.co") || SUPABASE_ANON_KEY === "JOUW-ANON-KEY") {
  setupEl.innerHTML = `<div class="setup-warning">
    <b>Nog niet geconfigureerd.</b><br>
    Vul js/supabase-config.js aan met je Supabase URL en anon key
    (zie README.md) voor je deze site gebruikt.
  </div>`;
} else {
  shellEl.style.display = "flex";
  boot();
}

async function boot() {
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Vangnet: komt de herstel-link toch op deze pagina terecht
  // (redirect-URL niet toegestaan in Supabase), stuur door naar reset.html.
  if (window.location.hash.includes("type=recovery")) {
    window.location.href = "reset.html" + window.location.hash;
    return;
  }

  // already logged in? go straight to the app
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    window.location.href = "app.html";
    return;
  }

  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const msgEl = document.getElementById("msg");

  function showMsg(text, kind) {
    msgEl.textContent = text;
    msgEl.className = "msg show " + kind;
  }

  document.getElementById("btn-login").addEventListener("click", async () => {
    const { error } = await sb.auth.signInWithPassword({
      email: emailEl.value.trim(),
      password: passEl.value,
    });
    if (error) {
      showMsg(error.message, "error");
      return;
    }
    window.location.href = "app.html";
  });

  document.getElementById("btn-signup").addEventListener("click", async () => {
    const { error } = await sb.auth.signUp({
      email: emailEl.value.trim(),
      password: passEl.value,
    });
    if (error) {
      showMsg(error.message, "error");
      return;
    }
    showMsg(
      "Account aangemaakt. Vraag Kevin om je e-mailadres toe te voegen aan de 'members' tabel in Supabase — daarna kan je aanmelden.",
      "ok"
    );
  });

  document.getElementById("link-forgot").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    if (!email) {
      showMsg("Vul eerst je e-mailadres in en klik dan opnieuw op 'Wachtwoord vergeten?'.", "error");
      return;
    }
    const redirectTo = new URL("reset.html", window.location.href).href;
    await sb.auth.resetPasswordForEmail(email, { redirectTo });
    // Bewust steeds hetzelfde antwoord: niet verklappen of een e-mailadres bestaat.
    showMsg(
      "Als dit e-mailadres bij een account hoort, ontvang je zo meteen een mail met een link om je wachtwoord te herstellen.",
      "ok"
    );
  });
}
