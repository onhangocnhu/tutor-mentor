// AddStudentModal.tsx
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import React from 'react';

const AddStudentModal: React.FC = () => {
  const [mssv, setMssv] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleCancel = () => {
    setMssv('');
    setFullName('');
    setClassName('');
    setEmail('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Xử lý submit, ví dụ gửi dữ liệu lên API
    console.log({ mssv, fullName, className, email });
    alert('Đã thêm sinh viên thành công!');
    handleCancel();
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black">Thêm sinh viên</h2>
          <div className="border-b border-gray-300 mt-2" />
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* MSSV */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">MSSV</label>
            <input
              type="text"
              placeholder="Nhập MSSV"
              value={mssv}
              onChange={handleChange(setMssv)}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Họ và tên */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={handleChange(setFullName)}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lớp */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Lớp</label>
            <select
              value={className}
              onChange={handleChange(setClassName)}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn lớp</option>
              <option value="90 phút">90 phút</option>
              <option value="180 phút">180 phút</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={handleChange(setEmail)}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 text-white rounded-2xl font-semibold hover:bg-gray-400 transition"
            >
              Hủy thêm
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
              Xác nhận thêm sinh viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
