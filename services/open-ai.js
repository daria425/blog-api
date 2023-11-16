const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET, // This is also the default, can be omitted
});

async function callGPT(theme) {
  const completion = await openai.chat.completions.create({
    response_format: {
      type: "json_object",
    },
    temperature: 0.75,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content: `You are a machine that only returns and replies with valid, iterable RFC8259 compliant JSON in your responses
      `,
      },
      {
        role: "user",
        content: `Given the current trends in the current year, write a content plan for a blog with a theme of ${theme}. factor in the importance of SEO and ensure maximum engagement. provide an array  of 3 content ideas that would be most impactful in a JSON array format.
        Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.   
        [{ "content_idea": "one sentence summary of overall idea",
                "title": "engaging post title",
                "summary": "10-20 word summary of content topic",
                "tags": "3 SEO friendly tags"}]
               `,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  });

  return completion.choices[0];
}

async function gptKeywordStrategy(theme) {
  const completion = await openai.chat.completions.create({
    temperature: 0.75,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content: `Pretend like you are a market research specialist having accurate and detailed information about available keywords. You are capable of developing a full keyword research plan.`,
      },
      {
        role: "user",
        content: `Generate a diverse and targeted list of 20 highly effective SEO keywords for a blog about ${theme}. Utilize proven keyword research tools and techniques to identify relevant keywords with high search volumes and low competition. Craft a keyword list that covers primary keywords, long-tail keywords and keyword questions to optimize website content and drive organic traffic.The list must have a length of 20 items`,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  });

  return completion.choices[0];
}

module.exports = { callGPT, gptKeywordStrategy };
