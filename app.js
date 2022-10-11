const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { application } = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", (req, res) => {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const mail = req.body.email;

    const data = {
      members: [
        {
          email_address: mail,
          status: "subscribed",
          merge_fields: {
            FNAME: fName,
            LNAME: lName
          }
        }
      ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://usX.api.mailchimp.com/3.0/lists/*unique ID*";

    const options = {
      method: "POST",
      auth: "Ferdinard:0f95e49dcb3db0da9ae20a5e62f3fc69-us14"
    }

    const request = https.request(url, options, (response) => {
    let success = response.statusCode;

    if (success === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

       response.on("data", (data) => {
        console.log(JSON.parse(data));

       })
    })

    request.write(jsonData);
    request.end();
  })

  app.post("/failure", (req, res) => {
    res.redirect("/");
  })



app.listen(process.env.PORT || 3000, () => {
    console.log("server is up and running on port 3000");
})


