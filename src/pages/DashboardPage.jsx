import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
    } catch {
      toast.error("Gagal memuat data user");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      toast.error("Token tidak ditemukan");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
        localStorage.removeItem("token");
        toast.error("Token kadaluarsa");
        navigate("/login");
        return;
      }

      if (payload.role === "user") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        navigate("/users");
        return;
      }

      if (payload.role !== "admin") {
        localStorage.removeItem("token");
        toast.error("Role tidak dikenali");
        navigate("/login");
        return;
      }

      fetchUsers();
    } catch {
      localStorage.removeItem("token");
      toast.error("Token tidak valid");
      navigate("/login");
    }
  }, [navigate, fetchUsers, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  };

  const handleUpdate = async (id) => {
    const updatedData = {
      name: editData.name,
      email: editData.email,
      role: editData.role,
    };

    if (editData.password && editData.password.trim() !== "") {
      updatedData.password = editData.password;
    }

    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User berhasil diupdate");
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal update user";
      toast.error(msg);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
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

      <main className="p-8">
        <h2 className="text-lg font-semibold mb-4">Daftar Users</h2>
        {users.length === 0 ? (
          <p>Tidak ada data user</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card
                key={user.id}
                className="p-4 flex justify-between items-center"
              >
                {editingUserId === user.id ? (
                  <div className="flex gap-2 flex-col sm:flex-row sm:items-center w-full">
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <Input
                      value={editData.password}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <Select
                      value={editData.role}
                      onValueChange={(value) =>
                        setEditData((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(user.id)}>
                        Simpan
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingUserId(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold"> Nama: {user.name}</p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        Email: {user.email}
                      </p>
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(user)}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak bisa dibatalkan. Yakin ingin
                              menghapus user <strong>{user.email}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
