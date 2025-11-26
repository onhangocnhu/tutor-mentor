import hcmut_logo from "../../images/hcmut_logo.png";
import login_homepic from "../../images/login_homepic.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const ResetPassword = (): React.JSX.Element => {
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [confirmedNewPassword, setConfimedNewPassword] = useState("");
  const [showConfirmedNewPassword, setConfirmedShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if(newPassword !== confirmedNewPassword){
      alert("Xác nhận mật khẩu mới chưa đúng!")
      return;
    }
		try{
      const username = localStorage.getItem("reset-password-username")
			const res = await fetch("http://localhost:3001/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, newPassword }),
			});
	
			if(!res.ok){
				throw new Error("Mật khẩu mới không đúng định dạng!");
			}
      localStorage.removeItem("reset-password-username");
      localStorage.removeItem("reset-password-email");
      
			navigate("/successful-reset-password");
		}
		catch(error){
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

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-800">Mật khẩu mới *</label>

                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-12 bg-zinc-100 text-zinc-800 rounded-md border border-neutral-200 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Eye icon */}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>


              {/* newPassword */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-800">Xác nhận mật khẩu mới *</label>

                <div className="relative w-full">
                  <input
                    type={showConfirmedNewPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmedNewPassword}
                    onChange={(e) => setConfimedNewPassword(e.target.value)}
                    className="w-full h-12 bg-zinc-100 text-zinc-800 rounded-md border border-neutral-200 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Eye icon */}
                  <button
                    type="button"
                    onClick={() => setConfirmedShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showConfirmedNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Next Button */}
            <button
							onClick={handleResetPassword}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700"
            >
              Tiếp theo
            </button>

            {/*Back Button */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-600 text-white rounded-md font-bold hover:bg-gray-700"
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

export default ResetPassword;
