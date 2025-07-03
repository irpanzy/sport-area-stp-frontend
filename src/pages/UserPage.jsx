import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UserPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token tidak ditemukan");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
        toast.error("Token kadaluarsa");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (payload.role === "admin") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        navigate("/admin");
        return;
      }

      if (payload.role !== "user") {
        toast.error("Akses tidak diizinkan");
        navigate("/login");
        return;
      }
    } catch {
      toast.error("Token tidak valid");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            toast.success("Anda telah logout");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </header>
    </div>
  );
}
