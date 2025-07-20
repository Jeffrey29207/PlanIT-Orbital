// Registration page for new users to register

import "./RegistrationPageStyle.css";
import supabase from "../../helper/config.ts";
import { useState } from "react";
import { useNavigate } from "react-router";
import { addUserAccount } from "../../helper/BackendAPI.ts";
import LandingPageMenuContainer from "../LandingPage/LandingPageMenuContainer.tsx";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Function to handle form submission for registration
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent auto refresh of the page

    setMessage(""); // Clear previous message

    if (password !== confirmPassword) {
      // Front end check for password match
      setMessage("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      // Supabase function to register a new user
      email: email,
      password: password,
    });

    if (error) {
      // If there is an error, set the message to the error message and clear the form
      setMessage(error.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (data) {
      // If registration is successful, set the message to success and clear the form
      setMessage("Registration successful!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      const { user } = data;

      if (user) {
        const account = await addUserAccount(user.id);
        console.log("Account created:", account);
        navigate("/login"); // Redirect to login page
      } else {
        setMessage("User account creation failed. Please try again.");
      }
    }
  };

  return (
    <div id="registrationPage">
      <LandingPageMenuContainer />
      <div id="registrationBox">
        <h2 className="newUserMessage">Create an account</h2>
        <span className="newUserMessage">
          Kickstart your financial health journey!
        </span>
        {message && <p className="registrationMessage">{message}</p>}
        <form className="registrationForm" onSubmit={handleSubmit}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
