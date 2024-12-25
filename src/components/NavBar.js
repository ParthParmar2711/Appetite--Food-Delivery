import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Badge from '@mui/material/Badge';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle'; 
import { useCart } from './Cart';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import Tooltip from '@mui/material/Tooltip'; 
import toast from 'react-hot-toast';

export default function NavBar(props) {
    const [cartView, setCartView] = useState(false);
    const [viewOption, setViewOption] = useState('both');
    const navigate = useNavigate();
    const location = useLocation();
    const items = useCart();

    const fromSignup = location.state?.fromSignup || false;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email'); 
        toast.success("Successfully Logged-Off")
        navigate("/login");
    };

    const loadCart = () => {
        setCartView(true);
    };

    const toggleViewOption = (option) => {
        setViewOption(option);
        props.onToggleView(option);
    };

    const getBackgroundColor = () => {
        if (viewOption === 'veg') {
            return 'bg-success';
        } else if (viewOption === 'non-veg') {
            return 'bg-danger';
        } else {
            return 'navbar-gradient';
        }
    };

    const userEmail = localStorage.getItem('email');

    return (
        <div>
            <nav className={`navbar navbar-expand-lg navbar-dark ${getBackgroundColor()} sticky-top`}
                 style={{ boxShadow: "0px 10px 20px black", zIndex: "1000", width: "100%", position:"sticky", top:0}}>
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic ms-2 text-bolder" style={{fontWeight:"bold"}}  to="/">Appetite</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {!props.hideHomeButton && !fromSignup && (
                                <li className="nav-item">
                                    <Link className="nav-link fs-4 mx-2 active ps-5" style={{fontWeight:"bold"}} aria-current="page" to="/">Home</Link>
                                </li>
                            )}
                            {localStorage.getItem("token") && !fromSignup && (
                                <li className="nav-item">
                                    <Link className="nav-link fs-4 mx-3 active" style={{fontWeight:"bold"}} aria-current="page" to="/myorder">My Orders</Link>
                                </li>
                            )}
                        </ul>
                        {(!localStorage.getItem("token")) ? (
                            <form className="d-flex">
                                <Link className="btn bg-white text-success mx-1" to="/login" style={{fontWeight:'bold'}}>Login</Link>
                                <Link className="btn bg-white text-success mx-1" to="/signup" style={{fontWeight:'bold'}}>Signup</Link>
                            </form>
                        ) : (
                            <div className="d-flex align-items-center">
                                {!fromSignup && (
                                    <>
                                        <button 
                                            className={`btn ${viewOption === 'veg' ? 'btn-light' : 'btn-outline-light'}`} 
                                            onClick={() => toggleViewOption(viewOption === 'veg' ? 'non-veg' : 'veg')}
                                            style={{
                                                borderRadius: '20px', 
                                                boxShadow: viewOption === 'veg' ? '0 4px 15px rgba(0, 123, 255, 0.5)' : 'none',
                                                transition: 'all 0.3s ease',
                                                padding: '5px 15px', 
                                                marginRight: '5px', 
                                                color: viewOption === 'veg' ? '#28a745' : '#fff',
                                                backgroundColor: viewOption === 'veg' ? '#d4edda' : (viewOption === 'non-veg' ? '#f5c6cb' : 'transparent'), 
                                                border: viewOption === 'veg' ? '1px solid #28a745' : '1px solid #2520a6',
                                                fontWeight:"bold"
                                            }}>
                                            {viewOption === 'veg' ? 'Non-Veg' : 'Veg'}
                                        </button>
                                        <button 
                                            className={`btn ${viewOption === 'both' ? 'btn-light' : 'btn-outline-light'}`} 
                                            onClick={() => toggleViewOption('both')}
                                            style={{
                                                borderRadius: '20px', 
                                                boxShadow: viewOption === 'both' ? '0 4px 15px rgba(108, 117, 125, 0.5)' : 'none',
                                                transition: 'all 0.3s ease',
                                                padding: '5px 15px', 
                                                marginRight: '5px', 
                                                color: viewOption === 'both' ? '#6c757d' : '#fff',
                                                backgroundColor: viewOption === 'both' ? '#e2e3e5' : 'transparent',
                                                border: '1px solid #6c757d',
                                                fontWeight:"bold"
                                            }}>
                                            Both
                                        </button>
                                    </>
                                )}
                                {!fromSignup && (
                                    <div className="btn bg-white text-black mx-2" onClick={loadCart}>
                                        <Badge color="secondary" badgeContent={items.length}>
                                            <ShoppingCart style={{ color: 'black' }} />
                                        </Badge>
                                        <span style={{ color: 'black' , fontWeight:"bold", marginLeft:"3px"}}>Cart</span>
                                    </div>
                                )}

                                {cartView && <Modal onClose={() => setCartView(false)}><Cart /></Modal>}

                                <button onClick={handleLogout} className="btn bg-white text-black" style={{height:"40px", fontWeight:"bold"}}>Logout</button>

                                {userEmail && (
                                    <Tooltip title={userEmail} arrow>
                                        <AccountCircle 
                                            style={{
                                                color: 'black',
                                                marginLeft: '10px',
                                                cursor: 'pointer',
                                                width: '54px',
                                                height: '54px',
                                            }} 
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <style jsx>{`
                .navbar-gradient {
                    background: linear-gradient(to right, #6a11cb, #2575fc);
                }
                .btn-light {
                    background-color: #f5c6cb;
                    border: 1px solid #dc3545;
                }
            `}</style>
        </div>
    );
}












