import React from "react";
import ProfileSideMenu from "./side-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const MyProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="pt-24 pb-12 flex container gap-12">
      <ProfileSideMenu className="sticky top-24 h-fit" />
      <div className="flex-1 w-full min-h-[60vh]">{children}</div>
    </div>
  );
};

export default MyProfileLayout;
