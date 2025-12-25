import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  // 1. State: Variables to hold the input and the list of URLs
  const [inputUrl, setInputUrl] = useState("");
  const [allUrls, setAllUrls] = useState([]); // This stores the table data
  const [message, setMessage] = useState(""); // For errors or success msgs
  const navigate = useNavigate();
  const backend_url=import.meta.env.VITE_BACKEND_URL;

  // 2. Fetch Data on Load (The replacement for "Get Routes")
  // This runs AUTOMATICALLY when the user arrives at the Home screen.
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      
      const response = await fetch(`${backend_url}/api/urls`,{
        credentials: "include"
      });
      const data = await response.json();

      console.log("Raw Data from Server:", data); // DEBUG 2: Check this in Console!

      if (!response.ok) {
        console.error("Error Response:", data.error); // DEBUG 3
        setMessage(data.error);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        // CRITICAL FIX: Check if 'data' is the array, or if 'data.urls' is the array
        // Many backends return { status: "success", urls: [...] }
        const finalArray = Array.isArray(data) ? data : (data.urls || []);
        
        console.log("Saving this array to state:", finalArray); // DEBUG 4
        setAllUrls(finalArray);
      }
    } catch (err) {
      console.error("Failed to fetch URLs", err);
    }
  };

  // 3. Handle Form Submit (Create new Short URL)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload

    try {
      const response = await fetch(`${backend_url}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: inputUrl }), // Send the "real" URL
      });

      const data = await response.json();

      if (response.ok) {
        const shortId= await data.id;
        setMessage("URL Shortened! Redirecting...");
        setInputUrl(""); // Clear the input box
        fetchUrls(); // REFRESH the table immediately!
        setTimeout(()=>{
          navigate(`/shorturl?id=${shortId}`);
        },1000);
      } else {
        setMessage("Error: " + data.error + "\nRedirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // 4. Handle Logout
  const handleLogout = async () => {
    // You can call your logout API, then move to login page
    // await fetch("/logout", { method: "POST" });

    // For now, just redirect
    const response = await fetch(`${backend_url}/api/logout`, {
      method: "POST",
      credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage("Cant't Logout");
    } else {
      setMessage(data.msg);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>URL Shortener</h1>

      {/* THE FORM */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="real-url">REAL URL: </label>
        <input
          type="text"
          id="real-url"
          placeholder="Enter full URL"
          required
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <hr />

      <h2>Stored URLs</h2>

      {/* THE TABLE */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Short URL</th>
            <th>Real URL</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {allUrls.length > 0 ? (
            allUrls.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>
                <td>
                  <a href={`${backend_url}/r/${item.shortUrl}`}
                  target="_blank" 
                  rel="noreferrer"
                  onClick={()=>{
                    setTimeout(()=>{
                        fetchUrls();
                    },1000);
                  }}
                  >
                    {item.shortUrl}
                  </a>
                </td>
                <td><a href={`${item.redirectUrl}`} target="_blank" rel="noreferrer">
                    {item.redirectUrl}
                  </a></td>
                <td>{item.clicks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No URLs found yet...</td>
            </tr>
          )}
        </tbody>
      </table>

      <br />

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        style={{ background: "red", color: "white" }}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
