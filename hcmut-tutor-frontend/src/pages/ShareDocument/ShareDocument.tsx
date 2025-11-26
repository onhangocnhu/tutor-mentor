import React from "react";
import "./ShareDocument.css";
import { useNavigate } from "react-router-dom";
import { HeaderSection } from "./HeaderSection";
import { DocumentSection } from "./UploadForm";
import { FooterSection } from "./FooterSection";
import back_icon from"../../images/left_arrow.svg";


export const ShareDocumentSection: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    if (role === "student") {
      navigate("/student");
    } else if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/"); 
    }
  };
  return (
    <div className="page-container">

      <HeaderSection />

    <button
      className="btn-back"
      onClick={handleBackClick}
    >
      {/* Inline SVG icon */}
      <svg
        className="back-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>

      {/* Text */}
      <span className="back-text">Quay về hệ thống quản lý</span>
    </button>

      <div className="content-container">
        <DocumentSection />
      </div>

      <FooterSection />
    </div>
  );
};
