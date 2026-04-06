import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* 🔝 Navbar */}
      <Navbar />

      {/* 📄 Page Content */}
      <main className="flex-grow px-6 py-6">
        <Outlet />
      </main>

      {/* 🔻 Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p className="text-sm">
          © 2026 BharatCart. Built with ❤️ in India
        </p>
      </footer>

    </div>
  );
};

export default MainLayout;