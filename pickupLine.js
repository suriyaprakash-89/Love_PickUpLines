import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { pickupLines } from "./api.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
      let q = req.query.q; //Get the question from query
      let a = req.query.a || ""; //Get the answer from query

      //if no question,generate new question
      if (!q) {
          let r = Math.floor(Math.random() * pickupLines.length);
          q = pickupLines[r].question;
      }

      console.log("Question:", q);
      console.log("Answer:", a);

      res.render("pickupLine.ejs", { q, a });
  } catch (error) {
      console.error("Failed to load:", error.message);
      res.render("pickupLine.ejs", { error: "Something went wrong!" });
  }
});

app.post("/why", async (req, res) => {
  try {
      let q = req.body.q; //getting question from body
      let a = pickupLines.find(line => line.question === q)?.answer || "No answer found"; //finding answer

      //console.log("Question:", q);
      //console.log("Answer:", a);

      //redirect to the same question with the answer included
      res.redirect("/?q=" + encodeURIComponent(q) + "&a=" + encodeURIComponent(a));
  } catch (error) {
      console.error("Failed to process request:", error.message);
      res.render("pickupLine.ejs", { error: "Something went wrong!" });
  }
});
 

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });