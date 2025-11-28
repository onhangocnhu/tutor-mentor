import React, { useState, useRef } from "react";

export type MeetingInfo = {
  id: string;
  time: string;
  date: string;
  method: string;
  location: string;
  department: string;
  registered: number;
  maxParticipants: number;
  topic: string;
  tutorName: string;
  actualParticipants: number | null;
  duration: number | null;
  report: boolean
};

type Props = {
  meetingInfo: MeetingInfo;       
  onClose?: () =>void ;
  onSubmit?: (file: File | null) => void;
};


const Field: React.FC<{
  label: string;
  required?: boolean;
  children?: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);


export default function AddMeetingReport({ meetingInfo, onClose, onSubmit }: Props) {
  const [duration, setDuration] = useState<string>(meetingInfo.duration?.toString() ?? "");
  const [actualParticipants, setActualParticipants] = useState<string>(
    meetingInfo.actualParticipants?.toString() ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
const handleConfirm = async () => {
    const durationValue = duration.trim() ? Number(duration) : meetingInfo.duration;
    const actualParticipantsValue = actualParticipants.trim()
      ? Number(actualParticipants)
      : meetingInfo.actualParticipants;

    // Kiểm tra bắt buộc nhập nếu ban đầu null
    if (
      durationValue === null ||
      actualParticipantsValue === null ||
      actualParticipantsValue <= 0
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin trước khi nhấn Xác nhận!");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
  try {
    const formData = new FormData();
    formData.append("duration", durationValue.toString());
    formData.append("actualParticipants", actualParticipantsValue.toString());
    if (file) formData.append("report", file, `${meetingInfo.id}.pdf`);
    
  
    const response = await fetch(`http://localhost:3001/sessions/${meetingInfo.id}/add-report`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Không thể thêm biên bản, thử lại sau.");
    }

    alert("Đã thêm biên bản thành công!");
    onClose?.(); // đóng modal sau khi submit
  } catch (err: any) {
    setErrorMessage(err.message || "Đã có lỗi xảy ra");
    setTimeout(() => setErrorMessage(null), 3000);
  }
    setErrorMessage(null);
    onSubmit?.(file);
  };

 const MAX_FILE_SIZE = 20 * 1024 * 1024; 

const handleDownload = async () => {
  try {
    const response = await fetch(`http://localhost:3001/uploads/reports/${meetingInfo.id}.pdf`);
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meetingInfo.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
  const droppedFile = e.dataTransfer.files[0];
  if (!droppedFile) return;

  if (droppedFile.size > MAX_FILE_SIZE) {
    alert("File vượt quá 20MB.");
    return;
  }

  if (droppedFile.type !== "application/pdf") {
    alert("Chỉ cho phép file PDF.");
    return;
  }

  setFile(droppedFile);
};

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File vượt quá 20MB.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Chỉ cho phép file PDF.");
      return;
    }

    setFile(selectedFile);
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

 return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div
      className="bg-white w-full max-w-7xl mx-4 md:mx-auto rounded-lg shadow-xl overflow-auto max-h-[90vh] p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
          Thêm biên bản buổi gặp
        </h1>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Meeting info (read-only) */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Thông tin buổi gặp
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Thời gian diễn ra">
                <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.time} {meetingInfo.date}
                </div>
              </Field>
              <Field label="Thời lượng" required>
                <input
                  type="text"
                  className="rounded-xl border border-slate-200 px-4 py-3 w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Hình thức">
                <div className="rounded-xl border border-indigo-100 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.method}
                </div>
              </Field>
              <Field label="Địa điểm / Đường dẫn">
                <div className="rounded-xl border border-slate-200 px-4 py-3 underline bg-gray-100 text-gray-500">
                  {meetingInfo.location}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Bộ môn">
                <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.department}
                </div>
              </Field>
              <Field label="ID">
                <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.id}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Số lượng sinh viên đăng ký">
                <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.registered}
                </div>
              </Field>
              <Field label="Số lượng sinh viên tối đa">
                <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.maxParticipants}
                </div>
              </Field>
            </div>

            <Field label="Chủ đề buổi gặp">
              <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                {meetingInfo.topic}
              </div>
            </Field>
          </div>
        </section>

        {/*Cột phải: Thông tin người tham gia */}
    <section className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">
        Thông tin người tham gia
      </h2>

      {/* Nội dung form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Họ và tên Tutor">
            <div className="rounded-xl border border-slate-200 px-4 py-3 bg-gray-100 text-gray-500">
                  {meetingInfo.tutorName}
            </div>
          </Field>
          <Field label="Số lượng sinh viên tham gia thực tế" required>
            <input
              type="text"
              className="rounded-xl border border-slate-200 px-4 py-3 w-full"
              value={actualParticipants}
              onChange={(e) => setActualParticipants(e.target.value)}
            />
          </Field>
        </div>

          <Field label="Thêm biên bản" required>
            <div
              className={`w-full p-4 rounded-xl border-2 border-dashed text-center cursor-pointer ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-gray-700">{file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // tránh mở file picker
                      setFile(null); // reset file đã chọn
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              ) : meetingInfo.report ? (
                <button
                  type="button"
                  className="text-gray-700 underline hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  {meetingInfo.id}.pdf
                </button>
              ) : (
                <p className="text-gray-400">
                  Kéo & thả file vào đây, hoặc nhấn để chọn
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf"
              />
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              File không vượt quá 20MB và phải là file PDF (.pdf)
            </div>
          </Field>

      </div>

      {/* Buttons cách nội dung trên 20px */}
      <div className="mt-[20px] flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium cursor-pointer
                    hover:bg-black active:bg-black"
        >
          Thoát
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer
                hover:bg-blue-700 active:bg-blue-900">
          Xác nhận
        </button>
      </div>
       {errorMessage && (<p className="text-red-600 mt-2 text-sm">{errorMessage}</p> )}
    </section>

      </div>
    </div>
  </div>
  );
};
