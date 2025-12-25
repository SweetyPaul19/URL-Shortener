import { useState } from "react";
import { useNavigate,Link } from "react-router-dom"; 

function Signup() {
  // 1. State: Variables to hold the user's input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const backend_url=import.meta.env.VITE_BACKEND_URL;
  const [message, setMessage] = useState(""); // To show success/error messages
  const navigate=useNavigate();
  // 2. Handle Change: Updates state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit: Sends data to your Backend API
  const handleSubmit = async (e) => {
    e.preventDefault(); // STOP the page from reloading!

    try {
      const response = await fetch(`${backend_url}/api/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup Successful! Redirecting...");
        setTimeout(()=>{
          navigate('/login');
        },1000);
        
      } else {
        setMessage("Error: " + data.msg);
      }
    } catch (error) {
      setMessage("Server error. Is the backend running?");
    }
  };

  return (
    <div>
      <h2>Signup Form</h2>
      {/* Remove action/method. Use onSubmit instead */}
      <form onSubmit={handleSubmit}>
        
        {/* Fix: 'for' becomes 'htmlFor' */}
        <label htmlFor="name">Name:</label>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          required
          value={formData.name}
          onChange={handleChange} // Capture typing
        />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <br />

        <input type="submit" value="Signup" />
      </form>
      
      {/* Show success/error message */}
      {message && <p>{message}</p>}

      <hr />

      <p>Already have an account?</p>
      {/* Update link to point to the React route, not the file */}
      <a href="/login">Login here</a>
    </div>
  );
}

export default Signup;