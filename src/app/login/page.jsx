"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return setError(error.message);

      const { user } = data;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "student") router.push("/dashboard/student");
      if (profile?.role === "teacher") router.push("/dashboard/teacher");
      if (profile?.role === "administrator") router.push("/dashboard/admin");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) return setError(error.message);

      const { user } = data;
      await supabase.from("profiles").insert({
        id: user.id,
        role,
      });

      alert("Signup successful! Please login.");
      setIsLogin(true);
    }
  };

  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>You are already logged in. Go to your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleAuth}
        className="p-6 border rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">
          {isLogin ? "Login" : "Signup"} Page
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <select
            className="border p-2 w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="administrator">Administrator</option>
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
        </p>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
