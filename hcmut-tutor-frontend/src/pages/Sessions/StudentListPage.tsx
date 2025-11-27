import React, { useMemo, useState } from "react";

type Student = {
  id: number;
  studentId: string;
  className: string;
  name: string;
  email: string;
  registeredAt: string;
  status: "confirmed" | "pending";
};

const sampleData: Student[] = [
  {
    id: 1,
    studentId: "2313999",
    className: "MT23KHM1",
    name: "Nguyễn Ngọc Phú",
    email: "phunguyen@hcmut.edu.vn",
    registeredAt: "14:30 15/9/2025",
    status: "confirmed",
  },
  {
    id: 2,
    studentId: "2314000",
    className: "MT23KHM1",
    name: "Trần Văn A",
    email: "trana@hcmut.edu.vn",
    registeredAt: "10:00 16/9/2025",
    status: "pending",
  },
  {
    id: 3,
    studentId: "2314001",
    className: "MT23KHM1",
    name: "Lê Thị B",
    email: "lethi@hcmut.edu.vn",
    registeredAt: "09:20 17/9/2025",
    status: "confirmed",
  },
];

export default function StudentListPage() : React.JSX.Element {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sampleData;
    return sampleData.filter(
      (s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q)
    );
  }, [query]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  function prev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function next() {
    setPage((p) => Math.min(pages, p + 1));
  }

    return (
        <div className="w-full min-h-screen bg-white overflow-auto">
            <div className="w-full p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Sinh viên</h1>
            <p className="text-sm text-slate-500">Danh sách sinh viên</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-4 py-2 bg-white border rounded text-sm shadow-sm">Import Excel/CSV</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Thêm sinh viên</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600">Số dòng cho 1 trang</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border rounded pl-3 pr-10 py-2 text-sm"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  🔍
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="text-left text-slate-700 text-xs uppercase">
                <tr>
                  <th className="px-3 py-2">
                      <input type="checkbox" />
                  </th>
                  <th className="px-3 py-2">MSSV</th>
                  <th className="px-3 py-2">Lớp</th>
                  <th className="px-3 py-2">Họ và tên</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Thời điểm đăng ký</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {current.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="px-3 py-3 align-top">
                          <input type="checkbox" />
                      </td>
                      <td className="px-3 py-3 align-top text-blue-600">{s.studentId}</td>
                      <td className="px-3 py-3 align-top">{s.className}</td>
                      <td className="px-3 py-3 align-top text-slate-700">{s.name}</td>
                      <td className="px-3 py-3 align-top text-slate-600">{s.email}</td>
                      <td className="px-3 py-3 align-top">{s.registeredAt}</td>
                      <td className="px-3 py-3 align-top">
                      {s.status === "confirmed" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">● Đã xác nhận</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-pink-100 text-rose-700 text-xs font-semibold">● Chưa xác nhận</span>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <button className="text-indigo-600 text-sm">Xem</button>
                        <button className="text-rose-600 text-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {current.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-slate-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Tổng: {filtered.length} sinh viên</div>
            <div className="flex items-center gap-2">
              <button onClick={prev} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page <= 1}>
                Trang trước
              </button>
              <div className="px-3 py-1 border rounded bg-slate-100">{page}</div>
              <button onClick={next} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page >= pages}>
                Trang kế tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}