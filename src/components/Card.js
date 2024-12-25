import React, { useState, useRef, useEffect } from 'react';
import { useCart, useDispatchCart } from './Cart';
import { useNavigate } from 'react-router-dom';

export default function Card(props) {
  let dispatch = useDispatchCart();
  let data = useCart();
  const priceRef = useRef();
  let options = props.options;
  let priceOptions = Object.keys(options);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  let navigate = useNavigate();

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleAddToCart = async () => {
    let existingFood = data.find(item => item.id === props.foodItem._id && item.size === size);

    if (existingFood) {
      // If the item already exists in the cart and the size matches, update it
      await dispatch({
        type: "UPDATE",
        id: props.foodItem._id,
        price: finalPrice,
        qty: qty,
        size: size
      });
    } else {
      // Otherwise, add it as a new item in the cart
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
        name: props.foodItem.name,
        price: finalPrice,
        qty: qty,
        size: size
      });
    }
  };

  let finalPrice = qty * parseInt(options[size]);

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  return (
    <div>
      <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px", marginLeft:"30px", marginBottom:"10px"}}>
        <img 
          src={props.foodItem.img} 
          className="card-img-top" 
          alt={props.foodItem.name} 
          style={{ height: "120px", objectFit: "fill" }} 
        />
        <div className="card-body d-flex flex-column" >
          <h5 className="card-title text-center mb-3 mt-2">{props.foodItem.name}</h5>
          <div className='container w-100 p-0' style={{ height: "38px", display: 'flex', alignItems: 'center' }}>
            <select 
              className='m-2 h-100 bg-light text-dark rounded border border-success' 
              onClick={handleClick} 
              onChange={handleQty}
              style={{
                padding: '5px',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#28a745'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select 
              className='m-2 h-100 w-50 bg-light text-dark rounded border border-success text-center fw-bolder' 
              ref={priceRef} 
              onClick={handleClick} 
              onChange={handleOptions}
              style={{
                padding: '5px',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#28a745'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            >
              {priceOptions.map((data) => (
                <option key={data} value={data}>{data}</option>
              ))}
            </select>
            <div className='d-inline ms-2 h-100 w-25 fs-5 text-center'>
              ₹{finalPrice}/-
            </div>
          </div>
          <button 
            className='btn btn-success justify-content-center align-self-center mt-2' 
            onClick={handleAddToCart}
            style={{
              position:"relative",
              top:'5px',
              padding: '10px 15px',
              borderRadius: '5px',
              transition: 'background-color 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}


