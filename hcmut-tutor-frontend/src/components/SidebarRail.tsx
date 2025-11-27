import React from "react";
import hcmut_logo from "../images/hcmut_logo.png";

type SidebarRailProps = {
  wrapperClass?: string; // css class for wrapper (e.g. "sidebar" or "register-sidebar-rail")
  imgClass?: string; // css class for the img (e.g. "sidebar-avatar" or "register-logo")
  onClick?: () => void;
  alt?: string;
};

const SidebarRail: React.FC<SidebarRailProps> = ({ wrapperClass = "sidebar", imgClass = "sidebar-avatar", onClick, alt = "hcmut logo" }) => {
  return (
    <aside className={wrapperClass} onClick={onClick} role="complementary" aria-hidden={false}>
      <img className={imgClass} src={hcmut_logo} alt={alt} />
    </aside>
  );
};

export default SidebarRail;
