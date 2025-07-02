import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Cek token jika user sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = Date.now() > payload.exp * 1000;

        if (!isExpired) {
          // Sudah login → arahkan ke dashboard berdasarkan role
          if (payload.role === "admin") {
            navigate("/admin");
          } else if (payload.role === "user") {
            navigate("/users");
          }
        } else {
          // token expired, hapus
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {
        toast.error("Token sudah expired");
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Login berhasil");

      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "user") {
        navigate("/users");
      } else {
        toast.error("Role tidak dikenali");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      toast.error(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </Card>
    </div>
  );
}
