const GEMINI_API_KEY = "AIzaSyCu5d4Bx_kGbha__rsT3qJqHDxLtvdUMhI";
const SYS = "You are an AI.";

let history = [
  { role: 'user', parts: [{ text: "hi" }] },
  { role: 'model', parts: [{ text: "Sorry, I cannot reply right now." }] },
  { role: 'user', parts: [{ text: "Hello again" }] }
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
