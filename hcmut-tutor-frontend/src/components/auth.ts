import studentsData from "../../../hcmut-tutor-backend/data/students.json";

const students = studentsData as any[];

export const getCurrentUsername = (): string | null => {
  const saved = localStorage.getItem("username");
  if (saved) return saved;

  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("username="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const getCurrentStudentId = (): string | null => {
  const username = getCurrentUsername();
  if (!username) return null;

  const student = students.find(s => s.username === username);
  return student?.studentId || null;
};

export const getCurrentStudentName = (): string | null => {
  const username = getCurrentUsername();
  if (!username) return null;

  const student = students.find(s => s.username === username);
  return student?.fullName || null;
};