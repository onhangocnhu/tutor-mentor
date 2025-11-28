const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

const app = express();

const corsOptions = { origin: true, credentials: true };
app.use(cors(corsOptions));
app.options("/files{/*path}", cors(corsOptions));

const nodemailer = require("nodemailer")
const otpPath = path.join(__dirname, "./data/otp.json")

const readJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
}

const sessionsPath = path.join(__dirname, "./data/sessions.json")
const usersPath = path.join(__dirname, "./data/users.json")
const templatePath = path.join(__dirname, "templates/forgotPasswordEmail.html");

const serverStart = new Date().toISOString();



// expose server start so frontend can detect restarts and clear client state
app.get("/server-start", (req, res) => {
  res.json({ serverStart });
});

app.use(express.json());

let sessions = readJSON(sessionsPath)
const users = readJSON(usersPath)
let otpStore = readJSON(otpPath)

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

// --- Prepare for upload reports ---
const uploadFolder = "./uploads/reports";

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// multer config 
const createUploader = (uploadFolder, allowedExts = [".pdf"], maxSizeMB = 20) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, file.originalname),
  });

  const fileFilter = (req, file, cb) => {
    const isValid = allowedExts.some(ext => file.originalname.toLowerCase().endsWith(ext));
    if (!isValid) {
      return cb(new Error(`Only ${allowedExts.join(", ")} allowed!`));
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });
};

// Report Upload
const reportFolder = path.join(__dirname, "uploads/reports");
const reportUpload = createUploader(reportFolder, [".pdf"], 20);


//Read file for frontend
app.use("/uploads/reports", express.static(reportFolder));

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



/////////// Sessions login
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


// Get all sessions
app.get("/sessions", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" })
  }
})

// Get single session by ID
app.get("/sessions/:id", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    const session = sessions.find((s) => s.id === req.params.id)
    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch session" })
  }
})

// Create new session
app.post("/sessions", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    // Username from cookie
    const username = req.cookies.username;
    let tutorFullName = null;
    if (username) { //Read tutor.json
      const tutors = readJSON(tutorsPath);
      const tutor = tutors.find(t => t.username === username);
      if (tutor) tutorFullName = tutor.fullName;
    }

    const newSession = {
      id: req.body.id || `C${Date.now()}`,
      date: req.body.date,
      time: req.body.time,
      format: req.body.format,
      location: req.body.location,
      studentCount: req.body.studentCount,
      department: req.body.department,
      status: req.body.status || "Chưa diễn ra",
      notes: req.body.notes || "",
      tutor: tutorFullName,
      report:false,
      duration: null,
      actualParticipants: null,
      students: req.body.students || [],
    }
    sessions.push(newSession)
    writeJSON(sessionsPath, sessions)
    res.json({ success: true, session: newSession })
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" })
  }
})

// Update session
app.put("/sessions/:id", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    const index = sessions.findIndex((s) => s.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: "Session not found" })
    }
    sessions[index] = { ...sessions[index], ...req.body }
    writeJSON(sessionsPath, sessions)
    res.json({ success: true, session: sessions[index] })
  } catch (error) {
    res.status(500).json({ error: "Failed to update session" })
  }
})

// Delete session
app.delete("/sessions/:id", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    const index = sessions.findIndex((s) => s.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: "Session not found" })
    }
    sessions.splice(index, 1)
    writeJSON(sessionsPath, sessions)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" })
  }
})

//Add report
app.post("/sessions/:id/add-report", reportUpload.single("report"), (req, res) => {
  try {
    const sessions = readJSON(sessionsPath);
    const session = sessions.find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const { duration, actualParticipants } = req.body;
    if (duration !== undefined) session.duration = Number(duration);
    if (actualParticipants !== undefined) session.actualParticipants = Number(actualParticipants);
    session.report = true;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileName = `${req.params.id}.pdf`;
    const filePath = path.join(uploadFolder, fileName);
    writeJSON(sessionsPath, sessions);
    res.json({
      success: true,
      reportUrl: session.report,
      message: "Report uploaded and JSON updated successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to upload report" });
  }
});

app.use("/uploads/reports", express.static(reportFolder, {
  setHeaders: (res) => {
    res.setHeader("Content-Type", "application/pdf");
  }
}));


// Add student to session
app.post("/sessions/:id/add-student", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    const index = sessions.findIndex((s) => s.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: "Session not found" })
    }
    const { studentId } = req.body
    if (!sessions[index].students) {
      sessions[index].students = []
    }
    if (!sessions[index].students.includes(studentId)) {
      sessions[index].students.push(studentId)
    }
    writeJSON(sessionsPath, sessions)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" })
  }
})

// Remove student from session
app.post("/sessions/:id/remove-student", (req, res) => {
  try {
    sessions = readJSON(sessionsPath)
    const index = sessions.findIndex((s) => s.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: "Session not found" })
    }
    const { studentId } = req.body
    sessions[index].students = sessions[index].students.filter((id) => id !== studentId)
    writeJSON(sessionsPath, sessions)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to remove student" })
  }
})

app.post("/forgot-password", async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = users.find(
      (u) => u.username === username && u.email === email
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Sai tài khoản hoặc email!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[username] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    writeJSON(otpPath, otpStore);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
    });

    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    emailTemplate = emailTemplate
      .replace("{{OTP_CODE}}", otp)
      .replace("{{YEAR}}", new Date().getFullYear());

    const mailOptions = {
      from: `HCMUT Portal <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Mã OTP xác thực đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

app.post("/verify-otp", (req, res) => {
  const { username, otp } = req.body;

  // Load lại file
  otpStore = readJSON(otpPath);

  if (!otpStore[username]) {
    return res.status(400).json({ success: false, message: "Không tìm thấy OTP!" });
  }

  const stored = otpStore[username];

  // Check expired
  if (Date.now() > stored.expires) {
    return res.status(400).json({ success: false, message: "OTP đã hết hạn!" });
  }

  // Check match
  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: "OTP không đúng!" });
  }

  res.json({ success: true, message: "OTP hợp lệ!" });
});

app.post("/reset-password", (req, res) => {
  const { username, newPassword } = req.body;

  // Load OTP + users
  otpStore = readJSON(otpPath);
  const usersData = readJSON(usersPath);

  // Kiểm tra OTP must exist
  if (!otpStore[username]) {
    return res.status(400).json({ success: false, message: "Bạn chưa xác thực OTP!" });
  }

  // Tìm user
  const userIndex = usersData.findIndex(u => u.username === username);
  if (userIndex === -1) {
    return res.status(400).json({ success: false, message: "Không tìm thấy user!" });
  }

  // Cập nhật mật khẩu
  usersData[userIndex].password = newPassword;

  // Lưu lại users.json
  writeJSON(usersPath, usersData);

  // Xóa OTP
  delete otpStore[username];
  writeJSON(otpPath, otpStore);

  res.json({ success: true, message: "Đặt lại mật khẩu thành công!" });
});
/////////

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