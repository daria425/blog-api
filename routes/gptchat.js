const chat = require("../services/open-ai");

const content_ideas_post = async (req, res, next) => {
  try {
    console.log(req.body);
    const stringInput = req.body.theme;
    const gptResponse = await chat.callGPT(stringInput);
    res.status(200).send(gptResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  content_ideas_post,
};
