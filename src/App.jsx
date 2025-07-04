import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UserPage";
import { Toaster } from "@/components/ui/sonner";
import Panduan from "./components/users/Panduan";
import Basket from "./components/users/Basket";
import Futsal from "./components/users/Futsal";
import Laporan from "./components/users/Laporan";
import UsersHome from "./components/users/HomeUser";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersPage />}>
          <Route index element={<UsersHome />} />
          <Route path="panduan" element={<Panduan />} />
          <Route path="sewa-lapangan-basket" element={<Basket />} />
          <Route path="sewa-lapangan-futsal" element={<Futsal />} />
          <Route path="laporan" element={<Laporan />} />
        </Route>

        {/* Halaman 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
