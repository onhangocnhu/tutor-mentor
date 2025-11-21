const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Load JSON data
const sessions = JSON.parse(fs.readFileSync("./data/sessions.json"));
const users = JSON.parse(fs.readFileSync("./data/users.json"));

// API routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false });
  }

  res.json({
    success: true,
    role: user.role,
    name: user.name,
    id: user.id
  });
});

app.get("/tutors", (req, res) => {
  res.json(tutors);
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.post("/request-session", (req, res) => {
  const { studentId, tutorId, message } = req.body;
  sessions.push({
    id: sessions.length + 1,
    studentId,
    tutorId,
    message,
    status: "pending",
  });
  res.json({ success: true });
});

// Start server
app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
