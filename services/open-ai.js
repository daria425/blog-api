const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET, // This is also the default, can be omitted
});

async function callGPT(theme) {
  const completion = await openai.chat.completions.create({
    response_format: {
      type: "json_object",
    },
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content: `You are a digital content strategist who's an expert at brainstorming blog topics. You have a deep understanding of digital marketing.`,
      },
      {
        role: "user",
        content: `Given the current trends in the current year, write a content plan for a blog with a theme of ${theme}. factor in the importance of SEO and ensure maximum engagement. provide a list of 3 content ideas that would be most impactful.
        Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.
        [{ "content_idea": "one sentence summary of overall idea",
                "title": "engaging post title"
                "summary": "10-20 word summary of content topic"
                "tags": "3 SEO friendly tags"}]
                 Limit your response to the array only.
    `,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  });

  return completion.choices[0];
}

module.exports = { callGPT };
