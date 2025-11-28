import hcmut_logo from "../../images/hcmut_logo.png";
import login_homepic from "../../images/login_homepic.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = (): React.JSX.Element => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const res = await fetch("http://localhost:3001/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (!res.ok) {
        throw new Error("Sai tài khoản hoặc email!");
      }
      localStorage.setItem("reset-password-username", username);
      localStorage.setItem("reset-password-email", email);

      navigate("/forgot-password-otp");
    }
    catch (error) {
      console.error("Lỗi quên mật khẩu: ", error);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">

      {/* LEFT SIDE IMAGE (50%) */}
      <div className="flex-1 h-full">
        <img
          src={login_homepic}
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE LOGIN (50%) */}
      <div className="flex-1 h-full p-12 bg-white flex flex-col justify-between">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img className="h-12 w-18" src={hcmut_logo} alt="HCMUT Logo" />
            <span className="font-semibold text-lg text-black">HCMUT Portal</span>
          </div>

        </div>

        {/* LOGIN FORM BLOCK */}
        <div className="flex flex-col items-center w-full">

          <div className="w-full max-w-md rounded-lg shadow-lg p-6 flex flex-col gap-8">

            <h2 className="text-xl font-semibold text-zinc-900">Đặt lại mật khẩu</h2>

            {/* FORM FIELDS */}
            <div className="flex flex-col gap-5">

              {/* Username */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-800">Tên đăng nhập *</label>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 bg-zinc-100 text-zinc-800 rounded-md border border-neutral-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-800">Địa chỉ email *</label>
                <input
                  type="email"
                  placeholder="Địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-zinc-100 text-zinc-800 rounded-md border border-neutral-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Next Button */}
            <button
              onClick={handleForgotPassword}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 cursor-pointer"
            >
              Tiếp theo
            </button>

            {/*Back Button */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-600 text-white rounded-md font-bold hover:bg-gray-700 cursor-pointer"
            >
              Quay lại trang đăng nhập
            </button>

            <div className="w-full h-px bg-neutral-200" />

          </div>

        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

export default ForgotPassword;
