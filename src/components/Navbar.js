import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({ OnCartClick, OnCategoryClick, OnArrivalClick, selectedSort, showBestSeller, setShowBestSeller, showCrazyDeals, setShowCrazyDeals, showNewArrivals, setShowNewArrivals}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <select 
        style={{backgroundColor:'black', 
          color:'white', 
          border:'1px solid white', 
          padding:'10px 15px', 
          borderRadius:'5px', 
        width:'120px',
      height:'35px',
    }}
        defaultValue="All" onChange={OnCategoryClick}>
          <option value="All">All</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="unisex">Unisex</option>
        </select>

        <button 
        style={{ 
          padding: "10px 15px", 
          backgroundColor: showNewArrivals ? "grey" : "black", 
          color: "white", 
          border: "1px solid white", 
          borderRadius: "5px", 
          cursor: "pointer",
          width:'120px',
      height:'35px',
        }}
            onClick={() => setShowNewArrivals(!showNewArrivals)}>
              {showNewArrivals ? 'All' : 'New Arrivals'}
            </button>

        <button 
        style={{ 
          padding: "10px 15px", 
          backgroundColor: showBestSeller ? "grey" : "black", 
          color: "white", 
          border: "1px solid white", 
          borderRadius: "5px", 
          cursor: "pointer",
          width:'120px',
      height:'35px',
        }}
            onClick={() => setShowBestSeller(!showBestSeller)}>
              {showBestSeller ? 'All' : 'BestSeller'}
            </button>

            <button 
            style={{ 
              padding: "10px 15px", 
              backgroundColor: showCrazyDeals ? "grey" : "black", 
              color: "white", 
              border: "1px solid white", 
              borderRadius: "5px", 
              cursor: "pointer",
              width:'130px',
              height:'35px',
            }}
            onClick={() => setShowCrazyDeals(!showCrazyDeals)}>
              {showCrazyDeals ? 'All' : 'Crazy Deals 🎉'}
            </button>
      </div>

      <div style={styles.rightSection}>
        <button 
        style={{
          backgroundColor:'black',
          color:'white',
          padding:'10px 15px',
          border: '1px solid white',
          borderRadius:'5px',
          width:'120px',
      height:'35px',
        }} 
        onClick={OnCartClick}>
          Cart
        <i style={{marginLeft:'15px'}} class="fa-solid fa-cart-shopping"></i>
        </button>

        <button 
        style={{
          backgroundColor:'black',
          color:'white',
          padding:'10px 15px',
          border: '1px solid white',
          borderRadius:'5px',
          width:'120px',
      height:'35px',
        }} 
        onClick={handleLogout}>
          Logout
          <i style={{marginLeft:'15px'}} class="fa-solid fa-right-from-bracket"></i>
          </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "98%",
    height: "70px",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  select: {
    padding: "5px",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
  },
};
