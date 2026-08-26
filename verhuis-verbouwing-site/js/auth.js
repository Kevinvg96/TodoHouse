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
}
