const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { register } = require("module");

const app = express();
// allow CORS with credentials: reflect origin instead of wildcard
const corsOptions = { origin: true, credentials: true };
app.use(cors(corsOptions));
app.options("/files{/*path}", cors(corsOptions));
// server start timestamp to help frontend detect a backend restart
const serverStart = new Date().toISOString();

// expose server start so frontend can detect restarts and clear client state
app.get("/server-start", (req, res) => {
  res.json({ serverStart });
});

app.use(express.json());

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
// load tutors data
let tutors = [];
try {
  const tutorsPath = path.join(__dirname, "data", "tutors.json");
  const rawT = fs.readFileSync(tutorsPath, "utf8");
  tutors = JSON.parse(rawT);
} catch (err) {
  console.error("Failed to load tutors.json:", err.message);
  tutors = [];
}
// load subjects data
let subjects = [];
try {
  const subjectsPath = path.join(__dirname, "data", "subjects.json");
  const rawS = fs.readFileSync(subjectsPath, "utf8");
  subjects = JSON.parse(rawS);
} catch (err) {
  console.error("Failed to load subjects.json:", err.message);
  subjects = [];
}

// registration persistence file helper
const registrationsPath = path.join(__dirname, "data", "registrations.json");
const loadRegistrations = () => {
  try {
    if (fs.existsSync(registrationsPath)) {
      return JSON.parse(fs.readFileSync(registrationsPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read registrations.json:", e.message);
  }
  return [];
};
const saveRegistrations = (arr) => {
  try {
    fs.writeFileSync(registrationsPath, JSON.stringify(arr, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write registrations.json:", e.message);
    return false;
  }
};

// progress persistence (tutor updates)
const progressPath = path.join(__dirname, "data", "progress.json");
const loadProgress = () => {
  try {
    if (fs.existsSync(progressPath)) {
      return JSON.parse(fs.readFileSync(progressPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read progress.json:", e.message);
  }
  return [];
};
const saveProgress = (arr) => {
  try {
    fs.writeFileSync(progressPath, JSON.stringify(arr, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write progress.json:", e.message);
    return false;
  }
};

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

// tutors endpoints
app.get("/tutors", (req, res) => {
  // return as array for simplicity
  return res.json(tutors);
});

// subjects endpoint
app.get("/subjects", (req, res) => {
  return res.json(subjects);
});

app.get("/tutor/:username", (req, res) => {
  const { username } = req.params;
  const tutor = tutors.find((t) => t.username === username);
  if (!tutor) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, ...tutor });
});

// keep /student/:username for backward compatibility
app.get("/student/:username", (req, res) => {
  const { username } = req.params;
  const student = students.find((s) => s.username === username);
  if (!student) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, ...student });
});

app.get("/tutor/:username", (req, res) => {
  const { username } = req.params;
  const tutor = tutors.find((s) => s.username === username);
  if (!tutor) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, ...tutor });
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

// register program: student registers a tutor for a subject
app.post("/register-program", (req, res) => {
  try {
    const { studentUsername: bodyStudent, tutorUsername, subject } = req.body || {};

    const cookieHeader = req.get("Cookie") || "";
    let cookieUser = null;
    cookieHeader.split(";").map(c => c.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") cookieUser = decodeURIComponent(v || "");
    });
    const studentUsername = bodyStudent || cookieUser;
    if (!studentUsername || !tutorUsername) {
      return res.status(400).json({ success: false, message: "studentUsername and tutorUsername required" });
    }

    const student = students.find((s) => s.username === studentUsername);
    const tutor = tutors.find((t) => t.username === tutorUsername);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    if (!tutor) return res.status(404).json({ success: false, message: "Tutor not found" });

    // resolve subject name from loaded subjects (if subject code provided)
    let subjectCode = subject || tutor.subjectCode || null;
    let subjectName = null;
    if (subjectCode) {
      const subj = subjects.find(s => s.code === subjectCode);
      if (subj) subjectName = subj.name;
    }

    const regs = loadRegistrations();
    const record = {
      id: regs.length + 1,
      registerTime: new Date().toISOString(),
      status: "registered",
      subjectCode: subjectCode || null,
      subjectName: subjectName || null,
      student: {
        username: student.username ?? '',
        fullName: student.fullName ?? student.name,
        studentId: student.studentId ?? student.id ?? null,
        email: student.email ?? '',
        classCode: student.classCode ?? '',
        faculty: student.faculty ?? ''
      },
      tutor: { username: tutor.username, fullName: tutor.fullName ?? tutor.name, tutorId: tutor.tutorId ?? null },
    };
    regs.push(record);
    const ok = saveRegistrations(regs);
    if (!ok) return res.status(500).json({ success: false, message: "Failed to persist registration" });
    return res.json({ success: true, record });
  } catch (err) {
    console.error("register-program error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// return registrations, optionally filtered by studentUsername OR tutorUsername (query or cookie)
app.get("/registrations", (req, res) => {
  try {
    const qStudent = req.query.studentUsername;
    const qTutor = req.query.tutorUsername;
    const cookieHeader = req.get("Cookie") || "";
    let cookieUser = null;
    let cookieRole = null;
    cookieHeader.split(";").map(c => c.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") cookieUser = decodeURIComponent(v || "");
      if (k === "role") cookieRole = decodeURIComponent(v || "");
    });

    const studentUsername = (qStudent || "").toString() || null;
    let tutorUsername = (qTutor || "").toString() || null;
    // if no tutor query, and cookie role indicates tutor, use cookie username as tutorUsername
    if (!tutorUsername && cookieRole === "tutor" && cookieUser) {
      tutorUsername = cookieUser.toString();
    }

    const regs = loadRegistrations(); // returns array
    // if both filters absent -> return all
    if (!studentUsername && !tutorUsername) {
      return res.json({ success: true, registrations: regs });
    }

    const filtered = regs.filter(r => {
      if (studentUsername && r.student && r.student.username === studentUsername) return true;
      if (tutorUsername && r.tutor && r.tutor.username === tutorUsername) return true;
      return false;
    });
    return res.json({ success: true, registrations: filtered });
  } catch (err) {
    console.error("GET /registrations error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// save student progress (from tutor)
app.post("/student-progress", (req, res) => {
  try {
    const payload = req.body || {};
    // expected payload: { registrationId?, student, tutor, subjectCode?, subjectName?, note }
    const { registrationId, student, tutor, subjectCode, subjectName, note } = payload;
    if (!student || !tutor) {
      return res.status(400).json({ success: false, message: "student and tutor required" });
    }

    const records = loadProgress();

    // If there are existing records for the same registrationId, mark the latest one with updatedAt
    if (registrationId) {
      // find last index of record with same registrationId
      const idx = records.map(r => r.registrationId).lastIndexOf(registrationId);
      if (idx !== -1) {
        // set updatedAt on the previous record
        records[idx].updatedAt = new Date().toISOString();
      }
    }


    // otherwise create new record
    const rec = {
      id: records.length + 1,
      createdAt: new Date().toISOString(),
      registrationId: registrationId ?? null,
      student,
      tutor,
      subjectCode: subjectCode ?? null,
      subjectName: subjectName ?? null,
      note: note ?? "",
    };
    records.push(rec);
    const ok = saveProgress(records);
    if (!ok) return res.status(500).json({ success: false, message: "Failed to persist progress" });
    return res.json({ success: true, record: rec });
  } catch (err) {
    console.error("POST /student-progress error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// optional: read progress (support filtering)
app.get("/progress", (req, res) => {
  try {
    const qReg = req.query.registrationId;
    const qStudent = req.query.studentUsername;
    const all = loadProgress();
    if (!qReg && !qStudent) return res.json({ success: true, progress: all });

    const filtered = all.filter((p) => {
      if (qReg && p.registrationId && p.registrationId.toString() === qReg.toString()) return true;
      if (qStudent && p.student && (p.student.username === qStudent || p.student.studentId === qStudent)) return true;
      return false;
    });
    return res.json({ success: true, progress: filtered });
  } catch (err) {
    console.error("GET /progress error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
