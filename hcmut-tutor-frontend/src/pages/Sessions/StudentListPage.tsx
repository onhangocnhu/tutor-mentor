"use client";

import React, { useEffect, useMemo, useState } from "react";

type Student = {
  username: string;    // username để match với backend
  studentId: string;
  classCode: string;
  fullName: string;
  email: string;
  faculty:string;
};

export default function StudentListPage(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch students từ backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:3001/students-reg", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setStudents(data.students);
        else console.error("Failed to load students");
      } catch (err) {
        console.error("Fetch students error:", err);
      }
    };

    fetchStudents();
  }, []);

  // Filter dữ liệu theo query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.classCode.toLowerCase().includes(q) ||
        s.faculty.toLowerCase().includes(q)
    );
  }, [query, students]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  function prev() { setPage((p) => Math.max(1, p - 1)); }
  function next() { setPage((p) => Math.min(pages, p + 1)); }

  return (
    <div className="mt-[50px]">
      <div className=" flex flex-col top-10 md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">Danh sách sinh viên</h1>
        </div>
      </div>

      {/* Table controls */}
      <div className="bg-white rounded-lg shadow p-4 w-full max-h-[60vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Số dòng cho 1 trang</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-slate-500">Dòng</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full max-w-md">
              <input
                placeholder="Tìm kiếm"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="w-full border rounded pl-3 pr-10 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="text-left text-slate-700 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">MSSV</th>
                <th className="px-3 py-2">Họ và tên</th>
                 <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Lớp</th>
                <th className="px-3 py-2">Khoa</th>
               
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : current.map((s) => (
                <tr key={s.username} className="border-b last:border-b-0 hover:bg-slate-50">
                  <td className="px-3 py-3 align-top text-blue-600">{s.studentId}</td>
                  <td className="px-3 py-3 align-top text-slate-700">{s.fullName}</td>
                  <td className="px-3 py-3 align-top text-slate-600">{s.email}</td>
                  <td className="px-3 py-3 align-top">{s.classCode}</td>
                  <td className="px-3 py-3 align-top text-slate-700">{s.faculty}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-l text-slate-600">Tổng: {filtered.length} sinh viên</div>
          <div className="flex items-center gap-2">
            <button onClick={prev} className="px-3 py-1 rounded disabled:opacity-50 cursor-pointer" disabled={page <= 1}>
              Trang trước
            </button>
            <div className="px-3 py-1 rounded bg-slate-100">{page}/{pages}</div>
            <button onClick={next} className="px-3 py-1 rounded disabled:opacity-50 cursor-pointer" disabled={page >= pages}>
              Trang kế tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
