const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
// allow CORS with credentials: reflect origin instead of wildcard
const corsOptions = { origin: true, credentials: true };
app.use(cors(corsOptions));
// respond to preflight requests with the same CORS settings
app.options("/files{/*path}", cors(corsOptions));

app.use(express.json());

// Load JSON data
const sessions = JSON.parse(fs.readFileSync("./data/sessions.json"));
const users = JSON.parse(fs.readFileSync("./data/users.json"));
// load students data used to populate frontend read-only form (from data/students.json)
let students = [];
try {
  const studentsPath = path.join(__dirname, "data", "students.json");
  const raw = fs.readFileSync(studentsPath, "utf8");
  students = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load students.json:", err.message);
  students = [];
}

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

app.get("/students", (req, res) => {
  return res.json({ success: true, students });
});

// keep /student/:username for backward compatibility
app.get("/student/:username", (req, res) => {
  const { username } = req.params;
  const student = students.find((s) => s.username === username);
  if (!student) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, ...student });
});

app.get("/current-student", (req, res) => {
  const cookieHeader = req.get("Cookie") || "";
  let cookieUser = null;
  cookieHeader.split(";").map(c => c.trim()).forEach(pair => {
    const [k, v] = pair.split("=");
    if (k === "username") cookieUser = v;
  });

  const username = (cookieUser || "").toString();
  if (!username) return res.status(400).json({ success: false, message: "username required" });

  const student = students.find((s) => s.username === username);
  if (!student) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, ...student });
});

// Start server
app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
