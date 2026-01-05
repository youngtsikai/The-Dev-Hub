import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

function MainLayout() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app-layout">
      {}
      <Sidebar
        isSidebarOpen={isMobileSidebarOpen}
        isCollapsed={isCollapsed}
        toggleDesktopSidebar={toggleDesktopSidebar}
      />

      {/* Mobile Overlay */}
      <div
        className={`overlay ${isMobileSidebarOpen ? "show" : ""}`}
        onClick={toggleMobileSidebar}
      ></div>

      {}
      {}
      <div className={`main-content-area ${isCollapsed ? "collapsed" : ""}`}>
        <Header
          toggleMobileSidebar={toggleMobileSidebar}
          isCollapsed={isCollapsed}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
