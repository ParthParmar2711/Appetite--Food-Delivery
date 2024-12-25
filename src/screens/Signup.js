import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const latlong = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = latlong.coords;
      const response = await fetch("http://localhost:5000/api/auth/getlocation", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latlong: { lat: latitude, long: longitude } })
      });

      const data = await response.json();
      if (response.ok) {
        setAddress(data.location);
        setCredentials(prev => ({ ...prev, geolocation: data.location }));
      } else {
        console.error("Failed to fetch location:", data.message);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setAddress("Unable to retrieve location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation })
    });
    
    const json = await response.json();
    if (json.success) {
      // Store email and token in localStorage
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('token', json.authToken);
      
      toast.success('Successfully Signed Up');
      navigate("/login", { state: { fromSignup: true } });
    } else {
      toast.error("Enter Valid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
      <NavBar hideHomeButton={true} />
      <div className='container d-flex align-items-center' style={{ position:"relative", top:"65px"}}>
        <form className='w-50 m-auto border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="name" className="form-label text-light">Name</label>
            <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} required />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label text-light">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} required />
          </div>
          <div className="m-3">
            <label htmlFor="address" className="form-label text-light">Address</label>
            <input type="text" className="form-control bg-light text-dark" name='address' placeholder='"Click below for fetching address"' value={address} readOnly />
          </div>
          <div className="m-3">
            <button type="button" onClick={handleClick} className="btn btn-success">Click for current Location</button>
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' required />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="m-3 btn btn-success" style={{fontWeight:'bold'}}>SIGNUP</button>
            <Link to="/login" className="m-3 mx-1 btn btn-danger" style={{fontWeight:'bold'}}>Already a User</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

