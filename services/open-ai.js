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
        content: `The user will provide you with a theme or list of comma-separated themes.Assume the persona of a digital content strategist who's an expert at brainstorming blog topics. Think with the depth and creativity of a professional content curator who has a deep understanding of digital marketing. Given the current trends in the current year, write a content plan for a blog with the user's theme. factor in the importance of SEO and ensure maximum engagement. provide a summarized version of 3 content ideas that would be most impactful. 
        Your response is an array of 3 valid JSON objects with the following key-value pairs:
        {"Content idea": One sentence summary of overall idea
        "Title": Engaging post title
        "Summary": 10-20 word summary of content topic
        "Tags": 3 SEO friendly tags} 
         Limit your response to the array only.`,
      },
      {
        role: "user",
        content: `Theme(s): ${theme}`,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  });

  return completion.choices[0];
}

module.exports = { callGPT };
