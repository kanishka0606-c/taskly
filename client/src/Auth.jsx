import { useState } from "react";
import { api } from "./api";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await api("/auth/register", "POST", { name, email, password });
      }
      const data = await api("/auth/login", "POST", { email, password });
      if (!data.token) {
        throw new Error("Login worked but no token came back");
      }
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="box">
      <h2>{isRegister ? "Create account" : "Log in"}</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegister ? "Register" : "Log in"}</button>
      </form>

      <button
        className="link"
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
        }}
      >
        {isRegister ? "I already have an account" : "Create a new account"}
      </button>
    </div>
  );
}