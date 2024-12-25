import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";

const API_KEY = 'rJVWfJCtS3txsx0r5axNWxsFPJmvLFy5i5MeEh17yrgSql2vm47XCEKP';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewOption, setViewOption] = useState('both'); // State for view option

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=pizza&per_page=5`, {
          headers: {
            Authorization: API_KEY,
          },
        });
        const data = await response.json();
        if (data.photos.length >= 3) {
          setImages(data.photos.map(photo => photo.src.original));
        }
      } catch (error) {
        console.error('Error fetching images from Pexels:', error);
      }
    };

    fetchImages();
  }, []);

  const loadData = async () => {
    let response = await fetch("http://localhost:5000/api/auth/foodData", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    response = await response.json();
    setFoodItem(response[0]);
    setFoodCat(response[1]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewAll = () => {
    setSelectedCategory(""); 
  };

  // Filter food items based on the view option
  const filteredFoodItems = foodItem.filter((item) => {
    const itemName = item.name.toLowerCase(); // Normalize to lowercase for comparison

    // Check if the item is vegetarian
    const isVegetarian = !['chicken', 'fish', 'egg', 'meat', 'prawns', 'omelate'].some(nonVegItem => itemName.includes(nonVegItem));
    // Check if the item is non-vegetarian
    const isNonVegetarian = ['chicken', 'fish', 'egg', 'meat', 'prawns', 'omelate'].some(nonVegItem => itemName.includes(nonVegItem));

    // Log the item being checked and its classification
    console.log(`Item: ${item.name} | Vegetarian: ${isVegetarian} | Non-Vegetarian: ${isNonVegetarian} | View Option: ${viewOption}`);

    // Determine what to return based on the current view option
    if (viewOption === 'veg') {
        return isVegetarian; // Only show vegetarian items
    } else if (viewOption === 'non-veg') {
        return isNonVegetarian; // Only show non-vegetarian items
    }
    
    return true; // Show both types of items
});


  return (
    <div>
      <NavBar onToggleView={setViewOption} style={{ position:"sticky", top:0}} /> {/* Pass setViewOption to NavBar */}
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: '9' }}>
              <div className="d-flex justify-content-center">
                <input 
                  className="form-control me-2 w-75 bg-white text-dark" 
                  type="search" 
                  placeholder="Search in here..." 
                  aria-label="Search" 
                  value={search} 
                  style={{height:"50px"}}
                  onChange={(e) => setSearch(e.target.value)} 
                />
                <button className='btn text-white bg-danger' style={{fontWeight:"bold"}} onClick={() => { setSearch('') }}>X</button>
              </div>
            </div>

            {images.length > 0 && images.map((image, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <img src={image} className="d-block w-100" style={{ filter: 'brightness(30%)' }} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container my-4">
        <div className="d-flex justify-content-center flex-wrap mb-3">
          <button 
            className='btn btn-outline-success me-2 mb-2' 
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onClick={handleViewAll} 
          >
            View All
          </button>

          {foodCat.length > 0 ? foodCat.map((data) => (
            <button 
              key={data._id} 
              className='btn btn-outline-primary me-2 mb-2' 
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onClick={() => setSelectedCategory(data.CategoryName)} 
            >
              {data.CategoryName}
            </button>
          )) : <div>No Categories Found</div>}
        </div>

        <div className='row mb-3'>
          {filteredFoodItems.length > 0 ? filteredFoodItems
            .filter((item) => 
              (item.CategoryName === selectedCategory || selectedCategory === "") && 
              (item.name.toLowerCase().includes(search.toLowerCase()))
            )
            .map((filterItems) => (
              <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                <Card foodItem={filterItems} options={filterItems.options[0]} />
              </div>
            )) : <div>No Items Found</div>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}


