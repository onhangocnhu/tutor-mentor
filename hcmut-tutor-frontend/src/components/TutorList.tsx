import { useEffect, useState } from "react";

interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
}

export default function TutorList() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3001/tutors")
      .then((res) => res.json())
      .then((data: Tutor[]) => {
        setTutors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tutors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách Mentor</h2>

      {tutors.length === 0 && <p>Không có mentor nào.</p>}

      {tutors.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <p>
            <b>{t.name}</b>
          </p>
          <p>Môn: {t.subject}</p>
          <p>Đánh giá: ⭐ {t.rating}</p>
        </div>
      ))}
    </div>
  );
}
