const GEMINI_API_KEY = "AIzaSyCu5d4Bx_kGbha__rsT3qJqHDxLtvdUMhI";
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

let history = [
  { role: 'user', parts: [{ text: "hi" }] }
];

async function test() {
  const reqBody = {
    systemInstruction: { parts: [{ text: SYS }] },
    contents: history
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody)
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
