import hcmut_logo from "../images/hcmut_logo.png";
import login_homepic from "../images/login_homepic.png";
import "./LoginPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): React.JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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

    if (data.role === "student") navigate("/student-dashboard");
    if (data.role === "tutor") navigate("/tutor-dashboard");
    if (data.role === "ctsv") navigate("/ctsv-dashboard");
    if (data.role === "pdt") navigate("/pdt-dashboard");
    if (data.role === "faculty") navigate("/faculty-dashboard");
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