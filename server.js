const express = require("express")
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const Document = require("./models/Document")
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/nanobin", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
app.get("/", (req, res) => {
  const code = `Welcome to nanobin!

Use the commands in the top right corner
to create a new file to share with others.

keybingdings:

alt + q -> new;

alt + w -> save;

alt + a -> duplicate;

alt + c -> copy url;`

  res.render("code-display", { code, language: "plaintext" })
})

app.get("/new", (req, res) => {
  res.render("new")
})

app.post("/save", async (req, res) => {
  const value = req.body.value
  try {
    const document = await Document.create({ value })
    res.redirect(`/${document.id}`)
  } catch (e) {
    res.render("new", { value })
  }
})

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)
    res.render("new", { value: document.value })
  } catch (e) {
    res.redirect(`/${id}`)
  }
})

app.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)

    res.render("code-display", { code: document.value, id })
  } catch (e) {
    res.redirect("/")
  }
})

app.listen(3000);
