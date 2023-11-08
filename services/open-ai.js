const { Configuration, OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET, // This is also the default, can be omitted
});

async function callGPT() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "hello?" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

module.exports = { callGPT };
