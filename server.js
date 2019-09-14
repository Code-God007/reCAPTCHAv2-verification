const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/subscribe", (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({ success: false, msg: "Please select captcha" });
  }

  // Secret Key
  const secretKey = "6LcOZbgUAAAAACbNcpMO4kqMuL4lJGtMtFXhO9py";

  // verfiy URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make request to VerifUrl
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    // If Not successful
    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed captcha verification" });
    }

    // If Successful
    return res.json({ success: true, msg: "Captcha passed" });
  });
});

app.listen(3000, () => console.log("Server Started on port 3000"));
