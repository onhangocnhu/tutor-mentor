import hcmut_logo from "../../images/hcmut_logo.png";
import login_homepic from "../../images/login_homepic.png";
import React from "react";
import { useNavigate } from "react-router-dom";

export const SuccessfulResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();

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

            <h2 className="text-xl font-semibold text-zinc-900">Đặt lại mật khẩu thành công</h2>

            <h2 className="text-sm font-semibold text-zinc-600">Bây giờ bạn có thể quay lại và đăng nhập</h2>

            {/*Back Button */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-gray-700"
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

export default SuccessfulResetPassword;
