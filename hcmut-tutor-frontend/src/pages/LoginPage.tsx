import hcmut_logo from "../images/hcmut_logo.png";
import login_homepic from "../images/login_homepic.png";
import "../styles/LoginPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): React.JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // detect backend restart and clear client storage/cookies when server changed
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
          // clear localStorage fully (or clear specific keys if preferred)
          try {
            localStorage.clear();
          } catch { }

          // clear known cookies set by app
          const cookiesToClear = ["username", "role", "programRegistered"];
          cookiesToClear.forEach((c) => {
            document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          });

          // store new serverStart so next loads won't clear again
          try {
            localStorage.setItem("serverStart", serverStart);
          } catch { }
        }
      } catch (e) {
        // ignore network errors
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
    <div className="ng-nhp">
      <div className="sign-in-form-desktop">
        <img className="rectangle" alt="Rectangle" src={login_homepic} />

        <div className="frame">
          <div className="div">
            <div className="frame-2">
              <div className="UI-unicorn-logo">
                <img
                  className="avatar-UI-unicorn"
                  alt="Avatar UI unicorn"
                  src={hcmut_logo}
                />

                <div className="text-wrapper">HCMUT Portal</div>
              </div>

              <div className="BG-tab-switcher">
                <div className="tab-switcher-button">
                  <div className="dis-wrapper">
                    <div className="dis">Sign in</div>
                  </div>
                </div>

                <button className="frame-wrapper">
                  <div className="dis-wrapper">
                    <div className="dis-2">Sign up</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="sign-in-forms">
              <div className="sign-in-form-web">
                <div className="frame-3">
                  <div className="element">Đăng nhập</div>

                  <div className="frame-4">
                    <div className="frame-5">
                      <div className="input-configurator">
                        <div className="input-configurator-2">
                          <div className="satellite-input">
                            <div className="text-wrapper-2">
                              Tên đăng nhập *
                            </div>
                          </div>

                          <div className="regular-input-double">
                            <input
                              type="text"
                              className="login-input"
                              placeholder="Tên đăng nhập"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="input-configurator">
                        <div className="input-configurator-2">
                          <div className="satellite-input">
                            <div className="text-wrapper-2">Mật khẩu *</div>
                          </div>

                          <div className="regular-input-double">
                            <input
                              type="password"
                              className="login-input"
                              placeholder="Mật khẩu"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="frame-7">
                      <div className="switcher-item-left">
                        <div className="switcher">
                          <div className="knob-icon">
                            <div className="knob" />
                          </div>
                        </div>

                        <div className="description">Ghi nhớ lần này</div>
                      </div>

                      <div className="description-2">Quên mật khẩu?</div>
                    </div>
                  </div>
                </div>

                <button
                  className="login-button"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </button>
                <div className="nav" />
              </div>

              <div className="sign-up-offer" />
            </div>
          </div>

          <div className="bottom-panel" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;