import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const backend_url=import.meta.env.VITE_BACKEND_URL;
  const [message, setMessage] = useState("");
  
  // This is the tool that lets us switch pages programmatically
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the relative path (Proxy will send this to localhost:3000/login)
      const response = await fetch(`${backend_url}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login Successful!");
        
        // OPTIONAL: If your backend sends a token (like JWT), save it here:
        // localStorage.setItem('token', data.token);

        // REDIRECT: Wait 1 second so user sees "Success", then go to Dashboard
        setTimeout(() => {
          navigate("/home"); // <--- This switches the page!
        }, 1000);

      } else {
        setMessage("Error: " + (data.msg || "Login failed"));
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Is the backend running?");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleChange}
        /><br /><br />

        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={handleChange}
        /><br /><br />

        <input type="submit" value="Login" />
      </form>
      
      {message && <p>{message}</p>}

      <hr />

      <p>Don't have an account?</p>
      <Link to="/signup">Signup here</Link>
    </div>
  );
}

export default Login;