import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function CardCarousel({ experience }) {

  const [currentCard, setCurrentCard] = useState(0);
  const [cards, setCard] = useState([]);

  const handleNext = () => {
    setCurrentCard((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  }

  const handlePrev = () => {
    setCurrentCard((prev) => Math.max( 0, prev - 1 ));
  }

  useEffect(() => {
    fetchCards();
  }, [])

  const fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/card`,
        { withCredentials: true }
      )
      setCard(response.data)
    } catch (error) {
      alert('Failed to fetch cards')
    }
  }

  return (
    <div 
    style={{
      position: 'absolute',
      top: '44%',
      left: '5%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      
      <div style={{
        width: '535px',
        height: '270px',
        backgroundColor: '#f0fff0',
        borderRadius: '30px 5px 30px 5px',
        padding: '20px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
       <p style={{color:'black', position:'absolute', top:'-15px', left:'13.5%', fontSize:'20px', fontWeight:'bold', fontStyle:'italic',}}>~The Essence of Our Customer's Experience~</p> 
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          style={{
            fontSize: '30px',
            marginRight: '20px',
            background: 'none',
            border: 'none',
            color: 'grey',
          }}
        >
          &#60;
        </button>

        {/* Display Only One Card */}
        {cards.length > 0 && (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'left', 
    backgroundColor: 'black',  // Card background
    padding: '15px',
    borderRadius: '10px',
    width: '400px',  // Adjust as needed
    color: 'white',
    marginTop:'20px'
  }}>
    
    {/* Image on top */}
    {cards[currentCard].image && (
      <img
        src={`http://localhost:8000/${cards[currentCard].image}`}
        alt={cards[currentCard].name}
        style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }}
      />
    )}

    {/* Name & Profile */}
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {cards[currentCard].name}
      </span>
      <br />
      <span style={{ fontSize: '14px', color: 'grey' }}>
        {cards[currentCard].profile}
      </span>
    </div>

    {/* Description inside the card, below everything */}
    <p style={{
      fontSize: '14px',
      textAlign: 'center',
      color: 'white',
      marginTop: '10px'
    }}>
      {cards[currentCard].description}
    </p>
  </div>
)}


        {/* Next Button */}
        <button
          onClick={handleNext}
          style={{
            fontSize: '30px',
            marginLeft: '20px',
            background: 'none',
            border: 'none',
            color: 'grey',
          }}
        >
          &#62;
        </button>
      </div>
    </div>
  );
}
