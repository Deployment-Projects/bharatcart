import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import InputField from "../components/InputField";
import api from "../api/axios";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/signup", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      alert("Signup failed");
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Create Account ✨"
      subtitle="Start your shopping journey"
    >
      <form onSubmit={handleSubmit}>

        <InputField
          label="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          placeholder="Enter your full name"
        />

        <InputField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="Enter your email"
        />

        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          placeholder="Create a password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition mt-4"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}