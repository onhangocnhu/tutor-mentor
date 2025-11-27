import React from "react";
import "../../styles/FooterLibrarySection.css";
import location from "../../images/location.svg";
import phone from "../../images/phone.svg";
import mail from "../../images/mail.svg";
import copy from "../../images/copy.svg";
import logo_hcmut from "../../images/hcmut_logo.png";

export const FooterSection: React.FC = () => {
  const contactInfo = [
    {
      icon: location,
      text: "268 Lý Thường Kiệt, Phường Diên Hồng, TP.Hồ Chí Minh",
    },
    {
      icon: phone,
      text: "(84.8) 38647256 ext. 5419, 5420",
    },
    {
      icon: mail,
      text: "thuvien@hcmut.edu.vn",
    },
  ];

  const infoLinks = ["Giới thiệu", "Liên hệ"];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo_hcmut} alt="HCMUT Logo" />
          </div>
          <p className="footer-title">
            Thư viện Trường Đại học Bách Khoa TP.Hồ Chí Minh
          </p>
          {contactInfo.map((contact, index) => (
            <div className="footer-contact" key={index}>
              <img src={contact.icon} alt="icon" className="footer-icon" />
              <p className="footer-contact-text">{contact.text}</p>
            </div>
          ))}
        </div>

        <div className="footer-right">
          <div className="footer-info-title">Thông tin</div>
          {infoLinks.map((link, index) => (
            <div className="footer-info-link" key={index}>
              <div className="footer-bullet" />
              <p>{link}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>NoCopyRight</span>
        <img src={copy} alt="copy" className="footer-copy-icon" />
        <span>2025 Thư viện. All Right Reserved.</span>
      </div>
    </footer>

  );
};
