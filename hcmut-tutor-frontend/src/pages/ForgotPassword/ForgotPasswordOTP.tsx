import React, { useState, useRef, useEffect } from "react";
import hcmut_logo from "../../images/hcmut_logo.png";
import login_homepic from "../../images/login_homepic.png";
import { useNavigate } from "react-router-dom";

const ForgotPasswordOTP = (): React.JSX.Element => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [fade, setFade] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("reset-password-username");

  // Fade-in animation
  useEffect(() => {
    setTimeout(() => setFade(true), 50);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP change
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

    const handleForgotPassword = async () => {
      try{
        const username = localStorage.getItem("reset-password-username")
        const email = localStorage.getItem("reset-password-email")
        
        const res = await fetch("http://localhost:3001/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email }),
        });
    
        if(!res.ok){
          throw new Error("Sai tài khoản hoặc email!");
        }        
      }
      catch(error){
        console.error("Lỗi quên mật khẩu: ", error);
      }
    };
  const resendEmail = () => {
    setTimer(30);
    alert("Email chưa mã OTP mới đã được gửi lại!");
    handleForgotPassword();
  };

  const verifyOTP = async () => {
    if (!username) return alert("Username không tồn tại!");

    const otpString = otp.join("");
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Lỗi server!");
      } else {
        alert("OTP hợp lệ! Vui lòng đặt mật khẩu mới.");
        navigate("/reset-password");
      }
    } catch (error: any) {
      alert(error.message || "Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden rounded-3xl">
      {/* IMAGE LEFT */}
      <div className="flex-1 h-full">
        <img
          src={login_homepic}
          className="w-full h-full object-cover"
          alt="Placeholder"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 h-full p-12 bg-white flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img className="w-18 h-12" src={hcmut_logo} />
            <div className="text-black text-base font-semibold">HCMUT Portal</div>
          </div>
        </div>

        {/* OTP Card */}
        <div className="flex flex-col items-center w-full">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-8 flex flex-col gap-8 transition-all duration-700 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <h2 className="text-xl font-semibold text-zinc-900">
              Email đặt lại mật khẩu đã được gửi!
            </h2>

            <p className="text-xs text-zinc-800 leading-5">
              Vui lòng kiểm tra email và nhập mã OTP để thay đổi mật khẩu.
            </p>

            {/* OTP INPUTS */}
            <div className="flex justify-between gap-2 w-full">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  className="w-12 h-14 border border-neutral-300 rounded-md text-center text-xl bg-white focus:border-blue-600 focus:outline-none"
                />
              ))}
            </div>

            {/* Button Next */}
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700"
            >
              {loading ? "Đang xác thực..." : "Tiếp theo"}
            </button>

            {/* Resend */}
            <button
              disabled={timer > 0}
              onClick={resendEmail}
              className={`w-full py-3 rounded-md font-bold text-white ${
                timer > 0 ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {timer > 0
                ? `Gửi lại email sau (${timer}s)`
                : "Gửi lại email"}
            </button>

            {/* Back */}
            <button
              onClick={() => {
                navigate("/");
              }}
              className="w-full py-3 bg-gray-500 text-white rounded-md font-bold hover:bg-gray-600 cursor-pointer"
            >
              Quay lại trang đăng nhập
            </button>

            <div className="w-full h-px bg-neutral-200"></div>
          </div>
        </div>

        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;
