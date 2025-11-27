import React, { useState } from "react";

type Props = {
  onClose?: () => void;
  onSubmit?: (payload: { content: string; results: string; next: string }) => void;
};

const Field: React.FC<{
  label: string;
  required?: boolean;
  children?: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      {label} {required ? <span className="text-red-600">*</span> : null}
    </label>
    {children}
  </div>
);

export default function AddMeetingReport({ onClose, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [results, setResults] = useState("");
  const [nextContent, setNextContent] = useState("");

  const handleConfirm = () => {
    onSubmit?.({ content, results, next: nextContent });
  };

  return (
    <div className="fixed inset-0 bg-white overflow-auto p-6 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Thêm biên bản buổi gặp</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Meeting info */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Thông tin buổi gặp</h2>

            <div className="space-y-4">
              <Field label="Thời gian diễn ra">
                <div className="rounded-xl border border-slate-200 px-4 py-3 text-neutral-900">14:00 15/9/2025</div>
              </Field>

              <Field label="Thời lượng">
                <div className="rounded-xl border border-slate-200 px-4 py-3">90 phút</div>
              </Field>

              <Field label="Hình thức" required>
                <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3">Trực tuyến</div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Địa điểm / Đường dẫn" required>
                  <div className="rounded-xl border border-slate-200 px-4 py-3 text-indigo-600 underline">Meet - xoh-dxut-rwp</div>
                </Field>

                <Field label="Bộ môn">
                  <div className="rounded-xl border border-slate-200 px-4 py-3">Hệ thống số</div>
                </Field>
              </div>

              <Field label="ID">
                <div className="rounded-xl border border-slate-200 px-4 py-3">523233</div>
              </Field>

              <Field label="Số lượng sinh viên đăng ký">
                <div className="rounded-xl border border-slate-200 px-4 py-3">50</div>
              </Field>

              <Field label="Số lượng sinh viên tối đa">
                <div className="rounded-xl border border-slate-200 px-4 py-3">30</div>
              </Field>

              <Field label="Chủ đề buổi gặp">
                <div className="rounded-xl border border-slate-200 px-4 py-3">Phát triển hệ thống Tutor một cách hiệu quả</div>
              </Field>
            </div>
          </section>

          {/* Right column: Participants & Results */}
          <section className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Thông tin người tham gia</h2>

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Họ và tên Tutor" required>
                  <div className="rounded-xl border border-slate-200 px-4 py-3">Lê Văn Nam</div>
                </Field>

                <Field label="Số lượng sinh viên tham gia thực tế" required>
                  <div className="rounded-xl border border-slate-200 px-4 py-3">50</div>
                </Field>
              </div>

              <Field label="Kết quả đạt được">
                <textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Nhập kết quả vào đây ...."
                  className="w-full h-40 md:h-56 p-4 rounded-xl border border-slate-200 bg-slate-50 resize-vertical"
                />
              </Field>

              <Field label="Nội dung buổi gặp">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung vào đây ...."
                  className="w-full h-40 md:h-56 p-4 rounded-xl border border-slate-200 bg-slate-50 resize-vertical"
                />
              </Field>

              <Field label="Nội dung cho buổi gặp tiếp theo">
                <textarea
                  value={nextContent}
                  onChange={(e) => setNextContent(e.target.value)}
                  placeholder="Nhập nội dung cho buổi tiếp theo ...."
                  className="w-full h-40 md:h-56 p-4 rounded-xl border border-slate-200 bg-slate-50 resize-vertical"
                />
              </Field>

              <div className="text-sm text-neutral-500">File đính kèm không vượt quá 200MB</div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium"
              >
                Thoát
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Xác nhận thêm biên bản
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}