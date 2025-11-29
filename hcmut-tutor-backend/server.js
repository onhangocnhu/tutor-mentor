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

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get("/students-reg", (req, res) => {
  try {
    const cookieHeader = req.get("Cookie") || "";
    let cookieUser = null;
    let cookieRole = null;

    cookieHeader.split(";").map(c => c.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") cookieUser = decodeURIComponent(v || "");
      if (k === "role") cookieRole = decodeURIComponent(v || "");
    });

    // must be tutor
    if (cookieRole !== "tutor") {
      return res.status(403).json({ success: false, message: "Not tutor" });
    }

    const tutorUsername = cookieUser;
    const regs = loadRegistrations();

    // lấy các student ứng với tutor
    const students = regs
      .filter(r => r.tutor.username === tutorUsername)
      .map(r => r.student);

    // loại duplicate student
    const uniqueStudents = Array.from(
      new Map(students.map(s => [s.username, s])).values()
    );

    return res.json({
      success: true,
      students: uniqueStudents,
    });

  } catch (err) {
    console.error("GET /students error:", err);
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

// =====================================================
// LIBRARY API ENDPOINTS
// =====================================================

// Library data paths
const documentsPath = path.join(__dirname, "data", "documents.json");
const borrowHistoryPath = path.join(__dirname, "data", "borrowHistory.json");
const savedDocumentsPath = path.join(__dirname, "data", "savedDocuments.json");
const sharedDocumentsPath = path.join(__dirname, "data", "sharedDocuments.json");

// Library data loaders
const loadDocuments = () => {
  try {
    if (fs.existsSync(documentsPath)) {
      return JSON.parse(fs.readFileSync(documentsPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read documents.json:", e.message);
  }
  return [];
};

const loadBorrowHistory = () => {
  try {
    if (fs.existsSync(borrowHistoryPath)) {
      return JSON.parse(fs.readFileSync(borrowHistoryPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read borrowHistory.json:", e.message);
  }
  return [];
};

const saveBorrowHistory = (data) => {
  try {
    fs.writeFileSync(borrowHistoryPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write borrowHistory.json:", e.message);
    return false;
  }
};

const loadSavedDocuments = () => {
  try {
    if (fs.existsSync(savedDocumentsPath)) {
      return JSON.parse(fs.readFileSync(savedDocumentsPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read savedDocuments.json:", e.message);
  }
  return [];
};

const saveSavedDocuments = (data) => {
  try {
    fs.writeFileSync(savedDocumentsPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write savedDocuments.json:", e.message);
    return false;
  }
};

const loadSharedDocuments = () => {
  try {
    if (fs.existsSync(sharedDocumentsPath)) {
      return JSON.parse(fs.readFileSync(sharedDocumentsPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read sharedDocuments.json:", e.message);
  }
  return [];
};

const saveSharedDocuments = (data) => {
  try {
    fs.writeFileSync(sharedDocumentsPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write sharedDocuments.json:", e.message);
    return false;
  }
};

const saveDocuments = (data) => {
  try {
    fs.writeFileSync(documentsPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write documents.json:", e.message);
    return false;
  }
};

// =====================================================
// FILE UPLOAD CONFIGURATION
// =====================================================

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const pdfsDir = path.join(uploadsDir, 'pdfs');
const coversDir = path.join(uploadsDir, 'covers');

[uploadsDir, pdfsDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Function to extract first page of PDF as image using pdfjs-dist and canvas
const extractPdfCover = async (pdfPath, outputPath) => {
  try {
    const { createCanvas } = require('canvas');
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    
    // Read PDF file
    const pdfData = new Uint8Array(fs.readFileSync(pdfPath));
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;
    
    // Get first page
    const page = await pdfDocument.getPage(1);
    
    // Set scale for good quality
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    // Create canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    
    // Save canvas as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(outputPath, buffer);
    
    console.log('Cover extracted successfully using pdfjs-dist:', outputPath);
    return true;
  } catch (err) {
    console.error('Error extracting PDF cover:', err.message);
    // Return false - upload will still work, just without cover image
    return false;
  }
};

// =====================================================
// DOCUMENT UPLOAD API
// =====================================================

// POST upload a new document with PDF
app.post("/library/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { title, author, year, category, department, language, description, type, userId } = req.body;

    if (!title || !author) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Title and author are required" });
    }

    // Generate cover image from PDF
    const coverFilename = path.basename(req.file.filename, '.pdf') + '.jpg';
    const coverPath = path.join(coversDir, coverFilename);
    
    let coverImage = null;
    const coverExtracted = await extractPdfCover(req.file.path, coverPath);
    if (coverExtracted) {
      coverImage = `/uploads/covers/${coverFilename}`;
    }

    // Create new document entry
    const documents = loadDocuments();
    const newId = 'doc' + (Date.now());
    
    const newDocument = {
      id: newId,
      title: title,
      author: author,
      year: year ? parseInt(year) : new Date().getFullYear(),
      category: category || "Tài liệu cá nhân",
      department: department || "",
      language: language || "Tiếng Việt",
      status: "available",
      type: type || "digital",
      coverImage: coverImage,
      description: description || "",
      totalCopies: 1,
      availableCopies: 1,
      views: 0,
      downloads: 0,
      filePath: `/uploads/pdfs/${req.file.filename}`,
      fileSize: (req.file.size / (1024 * 1024)).toFixed(2) + " MB",
      fileType: "PDF",
      uploadedBy: userId || "anonymous",
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    documents.push(newDocument);
    saveDocuments(documents);

    return res.json({ 
      success: true, 
      document: newDocument,
      message: "Document uploaded successfully"
    });
  } catch (err) {
    console.error("POST /library/upload error:", err);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, message: "Internal error: " + err.message });
  }
});

// GET all documents with optional search and filters
app.get("/library/documents", (req, res) => {
  try {
    const { search, category, department, language, status, sortBy, yearFrom, yearTo } = req.query;
    let documents = loadDocuments();

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      documents = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchLower) ||
        doc.author.toLowerCase().includes(searchLower) ||
        (doc.description && doc.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category) {
      const categories = category.split(",");
      documents = documents.filter(doc => categories.includes(doc.category));
    }

    // Department filter
    if (department) {
      const departments = department.split(",");
      documents = documents.filter(doc => departments.includes(doc.department));
    }

    // Language filter
    if (language) {
      const languages = language.split(",");
      documents = documents.filter(doc => languages.includes(doc.language));
    }

    // Year range filter
    if (yearFrom) {
      const fromYear = parseInt(yearFrom);
      if (!isNaN(fromYear)) {
        documents = documents.filter(doc => doc.year >= fromYear);
      }
    }
    if (yearTo) {
      const toYear = parseInt(yearTo);
      if (!isNaN(toYear)) {
        documents = documents.filter(doc => doc.year <= toYear);
      }
    }

    // Status filter
    if (status) {
      const statuses = status.split(",");
      documents = documents.filter(doc => statuses.includes(doc.status));
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case "newest":
          documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "oldest":
          documents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "popular":
          documents.sort((a, b) => b.views - a.views);
          break;
        case "mostDownloaded":
          documents.sort((a, b) => b.downloads - a.downloads);
          break;
        default:
          break;
      }
    }

    return res.json({ success: true, documents, total: documents.length });
  } catch (err) {
    console.error("GET /library/documents error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET single document by ID
app.get("/library/documents/:id", (req, res) => {
  try {
    const documents = loadDocuments();
    const document = documents.find(doc => doc.id === req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.json({ success: true, document });
  } catch (err) {
    console.error("GET /library/documents/:id error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET filter counts - count documents by category, department, language, status
app.get("/library/filter-counts", (req, res) => {
  try {
    const documents = loadDocuments();
    
    // Count by category
    const categoryCounts = {};
    documents.forEach(doc => {
      const cat = doc.category || "Khác";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Count by department
    const departmentCounts = {};
    documents.forEach(doc => {
      const dept = doc.department || "Khác";
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Count by language
    const languageCounts = {};
    documents.forEach(doc => {
      const lang = doc.language || "Tiếng Việt";
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });

    // Count by status
    const statusCounts = {};
    documents.forEach(doc => {
      const status = doc.status || "available";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return res.json({ 
      success: true, 
      counts: {
        category: categoryCounts,
        department: departmentCounts,
        language: languageCounts,
        status: statusCounts
      }
    });
  } catch (err) {
    console.error("GET /library/filter-counts error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST increment download count for a document
app.post("/library/documents/:id/download", (req, res) => {
  try {
    const documents = loadDocuments();
    const docIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    documents[docIndex].downloads = (documents[docIndex].downloads || 0) + 1;
    saveDocuments(documents);

    return res.json({ success: true, downloads: documents[docIndex].downloads });
  } catch (err) {
    console.error("POST /library/documents/:id/download error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST increment view count for a document
app.post("/library/documents/:id/view", (req, res) => {
  try {
    const documents = loadDocuments();
    const docIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    documents[docIndex].views = (documents[docIndex].views || 0) + 1;
    saveDocuments(documents);

    return res.json({ success: true, views: documents[docIndex].views });
  } catch (err) {
    console.error("POST /library/documents/:id/view error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST rate a document
app.post("/library/documents/:id/rate", (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const documents = loadDocuments();
    const docIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const doc = documents[docIndex];
    const currentRating = doc.rating || 0;
    const currentCount = doc.ratingCount || 0;
    
    // Calculate new average rating
    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + rating) / newCount;
    
    documents[docIndex].rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    documents[docIndex].ratingCount = newCount;
    saveDocuments(documents);

    return res.json({ 
      success: true, 
      newRating: documents[docIndex].rating,
      newRatingCount: documents[docIndex].ratingCount
    });
  } catch (err) {
    console.error("POST /library/documents/:id/rate error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET popular/recommended documents (sort by views + downloads + borrows)
app.get("/library/recommended", (req, res) => {
  try {
    const documents = loadDocuments();
    const recommended = documents
      .map(doc => ({
        ...doc,
        score: (doc.views || 0) + (doc.downloads || 0) * 2 + (doc.borrows || 0) * 3
      }))
      .sort((a, b) => b.score - a.score);

    return res.json({ success: true, documents: recommended });
  } catch (err) {
    console.error("GET /library/recommended error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET most viewed documents (sort by views count)
app.get("/library/most-viewed", (req, res) => {
  try {
    const documents = loadDocuments();
    const mostViewed = documents
      .sort((a, b) => (b.views || 0) - (a.views || 0));

    return res.json({ success: true, documents: mostViewed });
  } catch (err) {
    console.error("GET /library/most-viewed error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET newest documents (sort by uploadedAt or createdAt)
app.get("/library/newest", (req, res) => {
  try {
    const documents = loadDocuments();
    const newest = documents
      .sort((a, b) => {
        const dateA = new Date(a.uploadedAt || a.createdAt || 0);
        const dateB = new Date(b.uploadedAt || b.createdAt || 0);
        return dateB - dateA;
      });

    return res.json({ success: true, documents: newest });
  } catch (err) {
    console.error("GET /library/newest error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET my documents statistics
app.get("/library/my-stats", (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const documents = loadDocuments();
    const savedDocs = loadSavedDocuments().filter(s => s.userId === userId);
    const borrowHistory = loadBorrowHistory().filter(b => b.userId === userId);

    // Count saved documents (that still exist)
    const savedCount = savedDocs.filter(s => 
      documents.some(d => d.id === s.documentId)
    ).length;

    // Count currently borrowed documents (status = borrowed)
    const borrowedCount = borrowHistory.filter(b => 
      b.status === "borrowed" && documents.some(d => d.id === b.documentId)
    ).length;

    // Count downloaded documents (returned with downloadDate or digital type with downloads > 0)
    const downloadedDocs = new Set();
    borrowHistory.forEach(b => {
      if (b.downloadDate || b.status === "returned") {
        const doc = documents.find(d => d.id === b.documentId);
        if (doc && doc.type === "digital") {
          downloadedDocs.add(b.documentId);
        }
      }
    });
    // Also count documents user uploaded that have downloads
    documents.forEach(d => {
      if (d.uploadedBy === userId && (d.downloads || 0) > 0) {
        downloadedDocs.add(d.id);
      }
    });
    const downloadedCount = downloadedDocs.size;

    // Count shared documents - total number of uploaded documents in system
    // Since we don't have per-user tracking yet, count all documents uploaded
    const sharedCount = documents.length;

    return res.json({ 
      success: true, 
      stats: {
        saved: savedCount,
        borrowed: borrowedCount,
        downloaded: downloadedCount,
        shared: sharedCount
      }
    });
  } catch (err) {
    console.error("GET /library/my-stats error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET borrow history for a user
app.get("/library/borrow-history", (req, res) => {
  try {
    const { userId, status } = req.query;
    let history = loadBorrowHistory();
    const documents = loadDocuments();

    if (userId) {
      history = history.filter(h => h.userId === userId);
    }

    if (status) {
      const statuses = status.split(",");
      history = history.filter(h => statuses.includes(h.status));
    }

    // Attach document details to each history record
    const historyWithDocs = history.map(h => {
      const doc = documents.find(d => d.id === h.documentId);
      return { ...h, document: doc || null };
    });

    return res.json({ success: true, history: historyWithDocs });
  } catch (err) {
    console.error("GET /library/borrow-history error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET currently borrowed documents for a user
app.get("/library/borrowed", (req, res) => {
  try {
    const { userId } = req.query;
    let history = loadBorrowHistory();
    const documents = loadDocuments();

    // Filter by user if provided
    if (userId) {
      history = history.filter(h => h.userId === userId);
    }

    // Only return currently borrowed (not returned)
    history = history.filter(h => h.status === "borrowed");

    // Attach document details to each history record
    const borrowedWithDocs = history.map(h => {
      const doc = documents.find(d => d.id === h.documentId);
      return { ...h, document: doc || null };
    });

    return res.json({ success: true, borrowed: borrowedWithDocs });
  } catch (err) {
    console.error("GET /library/borrowed error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST borrow a document
app.post("/library/borrow", (req, res) => {
  try {
    const { documentId, userId } = req.body;

    if (!documentId || !userId) {
      return res.status(400).json({ success: false, message: "documentId and userId are required" });
    }

    const documents = loadDocuments();
    const doc = documents.find(d => d.id === documentId);

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (doc.type === "physical" && doc.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: "No copies available" });
    }

    const history = loadBorrowHistory();
    
    // Check if user already has an active borrow for this document
    const existingActiveBorrow = history.find(
      h => h.documentId === documentId && h.userId === userId && h.status === "borrowed"
    );
    
    if (existingActiveBorrow) {
      return res.status(400).json({ success: false, message: "You already have this document borrowed" });
    }
    
    // Check if there's a returned record for this user and document - reuse it
    const existingReturnedIndex = history.findIndex(
      h => h.documentId === documentId && h.userId === userId && h.status === "returned"
    );
    
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    if (existingReturnedIndex !== -1) {
      // Reuse the existing record - update it instead of creating new
      history[existingReturnedIndex].borrowDate = borrowDate.toISOString();
      history[existingReturnedIndex].dueDate = dueDate.toISOString();
      history[existingReturnedIndex].returnDate = null;
      history[existingReturnedIndex].status = "borrowed";
      history[existingReturnedIndex].renewCount = 0;
      
      saveBorrowHistory(history);
      return res.json({ success: true, borrow: history[existingReturnedIndex] });
    }

    // Create new borrow record only if no existing record found
    const newBorrow = {
      id: `borrow${Date.now()}`,
      documentId,
      userId,
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      status: "borrowed",
      renewCount: 0
    };

    history.push(newBorrow);
    saveBorrowHistory(history);

    return res.json({ success: true, borrow: newBorrow });
  } catch (err) {
    console.error("POST /library/borrow error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST return a document
app.post("/library/return", (req, res) => {
  try {
    const { borrowId } = req.body;

    if (!borrowId) {
      return res.status(400).json({ success: false, message: "borrowId is required" });
    }

    const history = loadBorrowHistory();
    const borrowIndex = history.findIndex(h => h.id === borrowId);

    if (borrowIndex === -1) {
      return res.status(404).json({ success: false, message: "Borrow record not found" });
    }

    history[borrowIndex].returnDate = new Date().toISOString();
    history[borrowIndex].status = "returned";
    saveBorrowHistory(history);

    return res.json({ success: true, borrow: history[borrowIndex] });
  } catch (err) {
    console.error("POST /library/return error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST renew a borrow
app.post("/library/renew", (req, res) => {
  try {
    const { borrowId } = req.body;

    if (!borrowId) {
      return res.status(400).json({ success: false, message: "borrowId is required" });
    }

    const history = loadBorrowHistory();
    const borrowIndex = history.findIndex(h => h.id === borrowId);

    if (borrowIndex === -1) {
      return res.status(404).json({ success: false, message: "Borrow record not found" });
    }

    if (history[borrowIndex].renewCount >= 2) {
      return res.status(400).json({ success: false, message: "Maximum renewal limit reached" });
    }

    const newDueDate = new Date(history[borrowIndex].dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7); // Extend by 7 days
    
    history[borrowIndex].dueDate = newDueDate.toISOString();
    history[borrowIndex].renewCount += 1;
    saveBorrowHistory(history);

    return res.json({ success: true, borrow: history[borrowIndex] });
  } catch (err) {
    console.error("POST /library/renew error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET saved documents for a user
app.get("/library/saved", (req, res) => {
  try {
    const { userId } = req.query;
    let saved = loadSavedDocuments();
    const documents = loadDocuments();

    if (userId) {
      saved = saved.filter(s => s.userId === userId);
    }

    // Attach document details
    const savedWithDocs = saved.map(s => {
      const doc = documents.find(d => d.id === s.documentId);
      return { ...s, document: doc || null };
    });

    return res.json({ success: true, saved: savedWithDocs });
  } catch (err) {
    console.error("GET /library/saved error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST save a document
app.post("/library/save", (req, res) => {
  try {
    const { documentId, userId } = req.body;

    if (!documentId || !userId) {
      return res.status(400).json({ success: false, message: "documentId and userId are required" });
    }

    const saved = loadSavedDocuments();
    
    // Check if already saved
    const existing = saved.find(s => s.documentId === documentId && s.userId === userId);
    if (existing) {
      return res.status(400).json({ success: false, message: "Document already saved" });
    }

    const newSave = {
      id: `save${String(saved.length + 1).padStart(3, "0")}`,
      documentId,
      userId,
      savedAt: new Date().toISOString()
    };

    saved.push(newSave);
    saveSavedDocuments(saved);

    return res.json({ success: true, saved: newSave });
  } catch (err) {
    console.error("POST /library/save error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// DELETE unsave a document
app.delete("/library/save", (req, res) => {
  try {
    const { documentId, userId } = req.body;

    if (!documentId || !userId) {
      return res.status(400).json({ success: false, message: "documentId and userId are required" });
    }

    let saved = loadSavedDocuments();
    const initialLength = saved.length;
    saved = saved.filter(s => !(s.documentId === documentId && s.userId === userId));

    if (saved.length === initialLength) {
      return res.status(404).json({ success: false, message: "Saved document not found" });
    }

    saveSavedDocuments(saved);
    return res.json({ success: true, message: "Document unsaved successfully" });
  } catch (err) {
    console.error("DELETE /library/save error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET shared documents for a user
app.get("/library/shared", (req, res) => {
  try {
    const { userId, status } = req.query;
    let shared = loadSharedDocuments();

    if (userId) {
      shared = shared.filter(s => s.userId === userId);
    }

    if (status) {
      shared = shared.filter(s => s.status === status);
    }

    return res.json({ success: true, shared });
  } catch (err) {
    console.error("GET /library/shared error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// POST share a document
app.post("/library/share", (req, res) => {
  try {
    const { userId, title, author, year, documentType, category, department, fileName, fileSize, fileType } = req.body;

    if (!userId || !title || !author || !documentType) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const shared = loadSharedDocuments();
    
    const newShare = {
      id: `share${String(shared.length + 1).padStart(3, "0")}`,
      userId,
      title,
      author,
      year: year || new Date().getFullYear(),
      documentType,
      category: category || "Tài liệu nội sinh",
      department: department || "",
      fileName: fileName || "",
      fileSize: fileSize || "",
      fileType: fileType || "PDF",
      status: "pending",
      sharedAt: new Date().toISOString(),
      approvedAt: null
    };

    shared.push(newShare);
    saveSharedDocuments(shared);

    return res.json({ success: true, shared: newShare });
  } catch (err) {
    console.error("POST /library/share error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// GET user library statistics
app.get("/library/stats", (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const saved = loadSavedDocuments().filter(s => s.userId === userId);
    const history = loadBorrowHistory().filter(h => h.userId === userId);
    const shared = loadSharedDocuments().filter(s => s.userId === userId);

    const borrowed = history.filter(h => h.status === "borrowed");
    const downloaded = history.filter(h => h.status === "returned" && h.downloadDate);

    return res.json({
      success: true,
      stats: {
        savedCount: saved.length,
        borrowedCount: borrowed.length,
        downloadedCount: downloaded.length,
        sharedCount: shared.length
      }
    });
  } catch (err) {
    console.error("GET /library/stats error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Backend running on port 3001");
});