import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        email,
        password,
        name,
      });

      toast.success("Berhasil register, silakan login");
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Gagal register. Silakan coba lagi.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            required
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Register
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </Card>
    </div>
  );
}
