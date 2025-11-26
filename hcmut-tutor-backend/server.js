const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const nodemailer = require("nodemailer")
const otpPath = path.join(__dirname, "./data/otp.json")

const app = express()
app.use(cors())
app.use(express.json())
require("dotenv").config();

// Helper functions to read/write JSON files
const readJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
}

const sessionsPath = path.join(__dirname, "./data/sessions.json")
const usersPath = path.join(__dirname, "./data/users.json")
const templatePath = path.join(__dirname, "templates/forgotPasswordEmail.html");

// Load JSON data
let sessions = readJSON(sessionsPath)
const users = readJSON(usersPath)
let otpStore = readJSON(otpPath)

// API routes
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return res.json({ success: false })
  }

  res.json({
    success: true,
    role: user.role,
    name: user.name,
    id: user.id,
    email: user.email,
  })
})

const tutors = users.filter((u) => u.role === "tutor")
const students = users.filter((u) => u.role === "student")

app.get("/tutors", (req, res) => {
  res.json(tutors)
})

app.get("/students", (req, res) => {
  res.json(students)
})

app.post("/request-session", (req, res) => {
  const { studentId, tutorId, message } = req.body
  sessions.push({
    id: sessions.length + 1,
    studentId,
    tutorId,
    message,
    status: "pending",
  })
  res.json({ success: true })
})

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

// Start server
app.listen(3001, () => {
  console.log("Backend running on port 3001")
})
