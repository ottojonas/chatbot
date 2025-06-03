import React, { useState } from "react";
import loginStyles from "../styles/loginform.module.css";
import styles from "../styles/auth.module.css";
import { useRouter } from "next/router";
import { FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        alert(
          "Invalid credentials\n Please try again or register for an account"
        );
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      login(data.userId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.userId);
      router.push("/chat");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className={styles.authWrapper}>
      <div className={loginStyles.wrapper}>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className={loginStyles["input-box"]}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className={loginStyles.icon} />
          </div>
          <div className={loginStyles["input-box"]}>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={loginStyles.icon} />
          </div>
          <button type="submit">Login</button>
          <div className={loginStyles["register-link"]}>
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register">Register Here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
