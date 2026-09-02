"use client";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className=""
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;