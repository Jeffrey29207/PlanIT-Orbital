// Login page for registered users to log back in

import "./LoginPageStyle.css";
import supabase from "../../helper/Config";
import { useState } from "react";
import { useNavigate } from "react-router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Function to handle form submission for login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent auto refresh of the page

    setMessage(""); // Clear previous message

    const { data, error } = await supabase.auth.signInWithPassword({
      // Supabase function to log in a user
      email: email,
      password: password,
    });

    if (error) {
      // If there is an error, set the message to the error message and clear the form
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }
    if (data) {
      // If login is successful, set the message to success and clear the form
      setMessage("login successful!");
      setEmail("");
      setPassword("");
      navigate("/home"); // Redirect to the home page
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
