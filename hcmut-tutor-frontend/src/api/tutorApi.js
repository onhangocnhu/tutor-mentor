export async function getTutors() {
  const res = await fetch("http://localhost:3001/tutors");
  return res.json();
}
