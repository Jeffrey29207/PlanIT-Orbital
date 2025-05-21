import "./LoginPageStyle.css";
import supabase from "../../helper/config";
import { useState } from "react";
import { useNavigate } from "react-router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }
    if (data) {
      setMessage("login successful!");
      setEmail("");
      setPassword("");
      navigate("/home");
    }
  };
  return (
    <div id="loginPage">
      <div id="loginBox">
        <h2 className="currentUserMessage">Welcome back!</h2>
        <span className="currentUserMessage">Let's plan together!</span>
        {message && <p className="loginMessage">{message}</p>}
        <form className="loginForm" onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
