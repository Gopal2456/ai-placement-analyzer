"use client";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    router.push("/");
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