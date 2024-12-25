import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // State to handle loading

    // Fetch order data
    const fetchMyOrder = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail')
                })
            });

            const data = await response.json();
            console.log("Fetched order data:", data); // Debug log
            setOrderData(data.orderData || []);  // Ensure it sets an empty array if no data
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);  // Stop loading after the request
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    // Function to format the date and time
    const formatDateTime = (dateString) => {
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString(undefined, optionsDate);
        const formattedTime = date.toLocaleTimeString([], optionsTime);

        return `${formattedDate} at ${formattedTime}`; // Display both date and time
    };

    return (
        <div>
            <NavBar />
            <div className='container mt-5'>
                <h2 className='text-center'>My Orders</h2>
                <div className='row'>
                    {loading ? (
                        <div className="col-12 text-center mt-5">
                            <h5>Loading...</h5>
                        </div>
                    ) : (
                        orderData && orderData.length > 0 ? (  // Check if orderData exists
                            orderData.map((order, index) => (
                                <div key={index} className="mb-5">
                                    {/* Display Order Date and Time */}
                                    {order[0]?.Order_date && (
                                        <div className='text-center mt-4'>
                                            <h3 className="order-date">
                                                Order Date: {formatDateTime(order[0].Order_date)} {/* Date and Time */}
                                            </h3>
                                            <hr className="order-hr" />
                                        </div>
                                    )}

                                    {/* Render order items */}
                                    <div className='row'>
                                        {Array.isArray(order) && order.length > 1 ? (
                                            order.slice(1).filter(item => item && item.name).map((item, idx) => (  // Filter and map over the order items
                                                <div key={idx} className='col-12 col-sm-6 col-md-4 col-lg-3 mb-3'>
                                                    <div className='card border-0 shadow-sm'>
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">{item.name}</h5>
                                                            <div className='container w-100 p-0'>
                                                                <span className='m-1'>Qty: {item.qty}</span>
                                                                <span className='m-1'>Size: {item.size}</span>
                                                                <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                                    ₹{item.price}/-
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center mt-5">
                                                <h5>No valid order data found</h5>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center mt-5">
                                <h5>No Orders Found</h5>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
            <style jsx>{`
                .order-date {
                    color: #007bff; 
                }
                .order-hr {
                    border-color: #007bff;
                    width: 80%;
                    margin: auto;
                }
                .card {
                    transition: transform 0.3s;
                }
                .card:hover {
                    transform: translateY(-5px); 
                }
            `}</style>
        </div>
    );
}








