import hcmut_logo from "../images/hcmut_logo.png";
import login_homepic from "../images/login_homepic.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): React.JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:3001/server-start", {
          credentials: "include",
        });
        if (!res.ok) return;
        const json = await res.json();
        const serverStart = json?.serverStart;
        const stored = localStorage.getItem("serverStart");
        if (serverStart && serverStart !== stored) {
          try {
            localStorage.clear();
          } catch { }

          const cookiesToClear = ["username", "role", "programRegistered"];
          cookiesToClear.forEach((c) => {
            document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          });

          try {
            localStorage.setItem("serverStart", serverStart);
          } catch { }
        }
      } catch (e) {
      }
    };
    checkServer();
  }, []);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Sai tài khoản hoặc mật khẩu!");
      return;
    }

    document.cookie = `username=${encodeURIComponent(username)}; path=/; max-age=${60 * 60 * 24}`;
    document.cookie = `role=${encodeURIComponent(data.role)}; path=/; max-age=${60 * 60 * 24}`;

    const cookieRole = document.cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("role="))
      ? document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("role="))!
        .split("=")[1]
      : null;

    if (!cookieRole || decodeURIComponent(cookieRole) !== data.role) {
      alert("Lỗi: không thể xác thực vai trò. Vui lòng thử lại.");
      return;
    }

    const originalFetch: any = window.fetch;
    window.fetch = (input: any, init: any = {}) => {
      init = init || {};
      const headers = new Headers(init.headers || {});
      if (!headers.has("X-User-Role")) {
        headers.set("X-User-Role", data.role);
      }
      init.headers = headers;
      return originalFetch(input, init);
    };

    if (data.role === "student") {
      if (decodeURIComponent(cookieRole) === "student") {
        navigate("/student-dashboard");
      } else {
        alert("Bạn không được phép truy cập trang sinh viên.");
      }
      return;
    }

    if (data.role === "tutor") {
      if (decodeURIComponent(cookieRole) === "tutor") {
        navigate("/tutor-dashboard");
      } else {
        alert("Bạn không được phép truy cập trang Tutor.");
      }
      return;
    }

    if (data.role === "ctsv") {
      if (decodeURIComponent(cookieRole) === "ctsv") {
        navigate("/ctsv-dashboard");
      } else {
        alert("Bạn không được phép truy cập trang Phòng Công tác sinh viên.");
      }
      return;
    }

    if (data.role === "pdt") {
      if (decodeURIComponent(cookieRole) === "pdt") {
        navigate("/pdt-dashboard");
      } else {
        alert("Bạn không được phép truy cập trang Phòng đào tạo.");
      }
      return;
    }

    if (data.role === "faculty") {
      if (decodeURIComponent(cookieRole) === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        alert("Bạn không được phép truy cập trang Khoa/Bộ môn.");
      }
      return;
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

            <h2 className="text-xl font-semibold text-zinc-900">Đăng nhập</h2>

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

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-800">Mật khẩu *</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-zinc-100 text-zinc-800 rounded-md border border-neutral-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex justify-between items-center">

                {/* Toggle switch */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRemember(!remember)}
                    className={`relative w-10 h-5 flex items-center rounded-full border transition-all
                              ${remember ? "bg-blue-600 border-blue-600" : "bg-zinc-100 border-neutral-300"}`}
                  >
                    {/* Nút tròn */}
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-all
                                ${remember ? "left-5" : "left-0.5"}`}
                    />
                  </button>

                  <span className="text-xs text-zinc-900 cursor-pointer">Ghi nhớ lần này</span>
                </div>


                {/* Forgot password */}
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 text-xs cursor-pointer">Quên mật khẩu?
                </button>
              </div>


            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 cursor-pointer"
            >
              Đăng nhập
            </button>

            <div className="w-full h-px bg-neutral-200" />

          </div>

        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

export default LoginPage;
