"use client";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <button onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default LogoutButton;
