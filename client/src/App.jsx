import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home'; // You need to create this file!
import ShortUrl from './components/ShortUrl';

function App() {
  const backend_url=import.meta.env.VITE_BACKEND_URL;
  return (
    <>
      
      <Routes>
        
        <Route path="/" element={<Login />} />        
        
        <Route path="/signup" element={<Signup />} />        
        
        <Route path="/login" element={<Login />} />        
        
        <Route path="/home" element={<Home />} />

        <Route path="/shorturl" element={<ShortUrl />} />
        
      
      </Routes>
    </>
  )
}

export default App; 