let lang = 'en';

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.getElementById('btnMs').classList.toggle('active', l === 'ms');
  document.getElementById('btnEn').classList.toggle('active', l === 'en');
  const t = T[l];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (t[k] !== undefined) el.placeholder = t[k];
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const k = el.getAttribute('data-i18n-title');
    if (t[k] !== undefined) el.title = t[k];
  });
  document.getElementById('chatWelcome').textContent = t.chat_welcome;
  document.title = l === 'ms' ? 'Mohammad Adam Zuhair' : 'Mohammad Adam Zuhair';
}

/* ─── DARK MODE ─── */
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
  root.setAttribute('data-theme', 'dark'); themeBtn.textContent = '☀️';
}
themeBtn.addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', dark ? 'light' : 'dark');
  themeBtn.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
});

/* ─── SCROLL REVEAL ─── */
const revObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(r => revObs.observe(r));

/* ─── SKILL BARS ─── */
document.querySelectorAll('.skill-bar').forEach(b => b.style.width = '0%');
const barObs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.skill-bar').forEach(b => b.style.width = b.dataset.width + '%'); });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

/* ─── ACTIVE NAV ─── */
const allSections = document.querySelectorAll('section[id]');
const allNavAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  allSections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
  allNavAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* ─── CONTACT FORM ─── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const ok = document.getElementById('formSuccess');
  btn.textContent = lang === 'ms' ? 'Menghantar...' : 'Sending...';
  btn.disabled = true;
  try {
    // Menggunakan FormSubmit (Percuma & pantas).
    // NOTA: Untuk penghantaran mesej pertama, anda perlu sahkan (verify) pautan dalam emel anda.
    const r = await fetch('https://formsubmit.co/ajax/mazmyusuf@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('fName').value,
        email: document.getElementById('fEmail').value,
        message: document.getElementById('fMsg').value,
        _subject: "Mesej Baharu dari Portfolio DamZu!"
      })
    });
    if (r.ok) { ok.style.display = 'block'; this.reset(); setTimeout(() => ok.style.display = 'none', 5000); }
    else { window.location.href = 'mailto:mazmyusuf@gmail.com'; }
  } catch { window.location.href = 'mailto:mazmyusuf@gmail.com'; }
  btn.textContent = T[lang].form_send;
  btn.disabled = false;
});

/* ─── CHATBOT ─── */
const fab = document.getElementById('chatFab');
const cWin = document.getElementById('chatWindow');
const cClose = document.getElementById('chatClose');
const cIn = document.getElementById('chatInput');
const cSend = document.getElementById('chatSend');
const cMsgs = document.getElementById('chatMessages');

fab.addEventListener('click', () => { cWin.classList.toggle('open'); if (cWin.classList.contains('open')) cIn.focus(); });
cClose.addEventListener('click', () => cWin.classList.remove('open'));

function addMsg(text, role) {
  const d = document.createElement('div');
  d.className = 'msg ' + (role === 'user' ? 'msg-user' : 'msg-bot');
  d.textContent = text;
  cMsgs.appendChild(d);
  cMsgs.scrollTop = cMsgs.scrollHeight;
}
function showTyping() {
  const d = document.createElement('div');
  d.className = 'msg msg-bot msg-typing'; d.id = 'typing';
  d.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  cMsgs.appendChild(d); cMsgs.scrollTop = cMsgs.scrollHeight;
}
function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

const SYS = `You are DamZu's personal AI assistant embedded in his portfolio. Respond in the same language as the user (Malay or English). Be friendly, concise (max 150 words), and professional.

ABOUT DAMZU:
- Computer science student, Johor Matriculation College, CGPA 3.75
- SPM: 6A 2B 1C from SMK Tinggi Kluang (2020–2024)

SKILLS: Google Antigravity, Firebase, Python, Git, C++, ESP32, Linux

ACHIEVEMENTS:
- National Dronatrix 2026: 3rd place (Report & Overall)
- KMJ Dronatrix 2026: Gold (Video & Overall)

LEADERSHIP:
- President, Kluang High School Football Club → MSSD Kluang 2024 Champions
- Committee, Badan Dakwah & Rohani

STATUS: Open to internships, freelance & collaboration. Based in Malaysia.`;

let history = [];
// Sila tukar teks di bawah dengan API Key Gemini anda dari Google AI Studio (bermula dengan AIza...)
const GEMINI_API_KEY = "AIzaSyCu5d4Bx_kGbha__rsT3qJqHDxLtvdUMhI";

async function sendChat() {
  const txt = cIn.value.trim();
  if (!txt) return;
  cIn.value = ''; cSend.disabled = true;
  addMsg(txt, 'user');

  // Keep track of internal history for Gemini API
  history.push({ role: 'user', parts: [{ text: txt }] });
  showTyping();

  // Semak jika pengguna belum meletakkan API KEY
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
    setTimeout(() => {
      removeTyping();
      const reply = lang === 'ms'
        ? '💬 Chatbot berfungsi! Tetapi anda belum meletakkan API Key Gemini. Sila kemaskini pembolehubah `GEMINI_API_KEY` dalam kod sumber.'
        : '💬 Chatbot is working! However, the Gemini API Key is missing. Please update `GEMINI_API_KEY` in the source code.';
      addMsg(reply, 'bot');
      history.push({ role: 'model', parts: [{ text: reply }] });
      cSend.disabled = false; cIn.focus();
    }, 1000);
    return;
  }

  try {
    const reqBody = {
      systemInstruction: { parts: [{ text: SYS + `\n\nCRITICAL INSTRUCTION: You MUST respond strictly in ${lang === 'ms' ? 'Malay' : 'English'}.` }] },
      contents: history
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });

    const data = await res.json();
    removeTyping();

    let reply = lang === 'ms' ? 'Maaf, saya tidak dapat membalas sekarang.' : 'Sorry, I cannot reply right now.';
    if (data && data.candidates && data.candidates.length > 0) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data && data.error) {
      reply = `API Error: ${data.error.message}`;
      console.error("Gemini API Error:", data.error);
    }

    addMsg(reply, 'bot');
    history.push({ role: 'model', parts: [{ text: reply }] });

    // Simpan 20 mesej terakhir sahaja supaya tidak melebihi token
    if (history.length > 20) history = history.slice(-20);
  } catch (err) {
    console.error("Chat error:", err);
    removeTyping();
    addMsg(lang === 'ms' ? 'Ralat sambungan. Sila cuba lagi.' : 'Connection error. Please try again.', 'bot');
  }
  cSend.disabled = false; cIn.focus();
}
cSend.addEventListener('click', sendChat);
cIn.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });

/* ─── PROJECT MODAL ─── */
function openProjectModal(key, img) {
  document.getElementById('pmTitle').setAttribute('data-i18n', key + '_t');
  document.getElementById('pmDesc').setAttribute('data-i18n', key + '_d');
  document.getElementById('pmTags').setAttribute('data-i18n', key + '_tags');
  const pmImg = document.getElementById('pmImg');
  if (img) { pmImg.src = img; pmImg.style.display = 'block'; } else { pmImg.style.display = 'none'; }
  document.getElementById('pmOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setLang(lang);
}
function closeProjectModal() {
  document.getElementById('pmOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* ─── INIT ─── */
setLang('en');
