const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;

app.use(express.json()); // allows you to access req.body from requests that have a body with JSON.stringify
app.post("/openai-api", async (req, res) => {
  console.log("Openai API called");
  console.log("Request Body:", req.body);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.openai_key}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an interview assistant service provider. Your goal is to give sample ${
            req.body.technical && req.body.behavioral
              ? "technical and behavioral"
              : ""
          } ${req.body.technical && !req.body.behavioral ? "technical" : ""} ${
            !req.body.technical && req.body.behavioral ? "behavioral" : ""
          }interview questions to the user. The user is a ${
            req.body.jobTitle
          } job seeker. The requirements for the job they are applying for are: ${
            req.body.jobReq
          }. The user's own qualifications are: ${req.body.jobQual} `,
        },
        {
          role: "user",
          content: `Given the information about the job and the user, please provide a list of ${
            req.body.technical && req.body.behavioral
              ? "technical and behavioral"
              : ""
          } ${req.body.technical && !req.body.behavioral ? "technical" : ""} ${
            !req.body.technical && req.body.behavioral ? "behavioral" : ""
          }questions that the user should be prepared for in an interview for a ${
            req.body.jobTitle
          } job.`,
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(data);
  console.log(data.choices);
  res.json(data);
});

app.listen(port, () => {
  console.log(`InterviewAI listening at http://localhost:${port}`);
});
