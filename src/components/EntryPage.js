import React, { useRef, useState } from 'react';
import axios from 'axios';
import CardCarousel from './CardCarousel';
import { useNavigate } from 'react-router-dom';

export default function EntryPage() {

  const [cards, setCards] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profile, setProfile] = useState('');
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showMsg,setShowMsg] = useState(false);
  const navigate = useNavigate();

  const aboutSectionRef = useRef(null);
  const topSectionRef = useRef(null);
  const teamSectionRef = useRef(null);

  const handleAbout = () => {
    aboutSectionRef.current?.scrollIntoView({behavior : "smooth"})
  }

  const handleClose = () => {
    topSectionRef.current?.scrollIntoView({behavior : "smooth"})
  }

  const handleTeam = () => {
    teamSectionRef.current?.scrollIntoView({behavior:'smooth'})
  }

  const handleCardSubmit = async(e) => {
    e.preventDefault();

    if(!file || !name || !description || !profile){
        alert('All fields are required');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('profile', profile);

    try {
        const response = await axios.post(
            'http://localhost:8000/api/cards',
            formData,
            {
                headers:{
                    'Content-Type' : 'multipart/form-data',
                },
            }
        )
        alert(response.data.message);
        setCards([...cards, response.data.post]);
    } catch (error) {
        console.error('Error uploading post:', error.response?.data || error.message);
        alert('Failed to add post')
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const navigateSignup = () => {
    navigate('/signup', { replace: true });
  }

  const handleHomeBtn = () => {
   setShowMsg(true);
  }

  return (
    <div>
       <div>
       {showMsg && (
  <div
    style={{
      position: 'fixed',
      transform: 'translate(-50%, -50%)', // Center the message
      zIndex: 100,
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for contrast
      padding: '30px',
      borderRadius: '12px',
      border: '2px solid #fff',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
      fontFamily: 'Arial, sans-serif',
      maxWidth: '90%',
      width: '350px', // Control the width
    }}
  >
    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
      You need to log in to continue shopping. We recommend logging in first to fully enjoy your shopping experience.
    </h3>
    <div>
      <button
        onClick={() => navigate('/login')}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          padding: '12px 20px',
          margin: '10px 5px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
      >
        Login
      </button>
      <button
        onClick={() => navigate('/home')}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '12px 20px',
          margin: '10px 5px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Home
      </button>
      <button
        onClick={() => setShowMsg(false)}
        style={{
          background:'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          position:'absolute',
          top:'10px',
          right:'30px',
          width:'1px',
          height:'1px'
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'grey')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#f44336')}
      >
        <i style={{ fontSize: '25px', color: 'white' }} class="fa-regular fa-circle-xmark"></i>
      </button>
    </div>
  </div>
)}

    </div>
      <div style={{ backgroundColor: 'black', height: '100vh' }}>
        {/* Navbar Overlay */}
        <nav
          style={{
            position: 'absolute', // Position navbar on top of the image
            top: '5%',           // Adjust the top position to your liking
            left: '5%',
            border: '2px solid grey',
            width: '30%',
            height:'4%',
            zIndex: 2,            // Make sure it is above the image
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Optional: slightly transparent background
            // padding: '5px',
            borderRadius:'50px',
            display: 'flex',             // Use flexbox for button layout
            justifyContent: 'space-between', // Distribute buttons evenly
            alignItems: 'center',
          }}
        >
          <button 
          onClick={handleHomeBtn}
          style={{ marginLeft:'100px' ,border:'none', background:'none', color:'grey', fontSize:'15px' }}>Home<i style={{marginLeft:'10px'}} class="fa-solid fa-house"></i></button>
          
          <button
          onClick={handleAbout} 
          style={{  border:'none', background:'none', color:'grey', fontSize:'15px' }}>About</button>
          <button 
          type='button'
          onClick={navigateSignup}
          style={{ marginRight:'100px' ,border:'none', background:'none', color:'grey', fontSize:'15px' }}>Register</button>
        </nav>

        <div style={{ position: 'absolute', // Position navbar on top of the image
            top: '10%',           // Adjust the top position to your liking
            left: '8%',}}>
            <h1 style={{color:'white', fontSize:'50px'}}>
               Discover your best <br/> <span style={{fontStyle:'italic'}}>Perfume</span> at <span style={{fontStyle:'italic', color:'grey'}}>Veda Essence</span>
            </h1>
            <p style={{color:'white', fontSize:'20px'}}>Embrace the Power of Fragrance and Transform <br/>Your Everyday Moments into Extraordinary Experiences.</p>
        </div>

        {/* Image that stays in the background */}
        <div>
          <img
            style={{
              width: '35%',
              height:'100%',
              position: 'absolute',
              right: '200px', // Keep the image in its original position
              backgroundColor: 'grey',
              zIndex: 1  // Make sure the image stays below the navbar
            }}
            src='EntryBlack.jpg'
            alt='Entry Pic'
          />
        </div>
      </div>

      <button 
       style={{
        position : 'absolute', 
        top:'5%', 
        left:'37%', 
        color:'grey',
        border: '2px solid grey',
        width: '10%',
        height:'4.5%',
        zIndex: 2,            // Make sure it is above the image
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Optional: slightly transparent background
        borderRadius:'50px',
        display: 'flex',             // Use flexbox for button layout
        justifyContent: 'center', // Distribute buttons evenly
        alignItems: 'center',
      }}
      onClick={() => setIsOpen(!isOpen)}>
       {isOpen ? 'Close Form' : 'Share Your Experience'}
      </button>

      <div style={{
        // border:'2px soild white', 
        position:'absolute', 
        top:'38%', 
        left:'10%', 
        // border:'2px solid white',
        width:'50%',
        height:'35%'
        }} >
     {isOpen && (
  <div style={{
    position: 'fixed', // Fixed to stay over everything
    width:'30%',
    height:'33%',
    top: '40%',
    left: '75%',
    transform: 'translate(-50%, -50%)', // Centering trick
    zIndex: 100, // Ensure it appears above everything
    background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.3)', // Soft shadow for better visibility
  }}>
    <form 
      style={{
        backgroundColor: 'grey', 
        borderRadius: '10px', 
        padding: '20px',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onSubmit={handleCardSubmit}
    >
      <span style={{font:'bold'}}> <b>Select image ~ </b>
      <input
        style={{
          marginBottom: '10px', 
          width: '200px', 
          height: '30px', 
          borderRadius: '10px', 
          padding: '10px', 
          border: 'none'
        }}
        type='file' onChange={handleFileChange}
        placeholder='Select Image' 
      /> 
        </span> 

      <input 
        style={{
          marginBottom: '10px', 
          width: '400px', 
          height: '30px', 
          borderRadius: '10px', 
          padding: '10px', 
          border: 'none'
        }}
        type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name'
      />

      <input 
        style={{
          marginBottom: '10px', 
          width: '400px', 
          height: '30px', 
          borderRadius: '10px', 
          padding: '10px', 
          border: 'none'
        }}
        type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter Description'
      />

      <input 
        style={{
          marginBottom: '10px', 
          width: '400px', 
          height: '30px', 
          borderRadius: '10px', 
          padding: '10px', 
          border: 'none'
        }}
        type='text' value={profile} onChange={(e) => setProfile(e.target.value)} placeholder='Enter Profile'
      />

      <button 
        style={{
          width: '150px', 
          height: '40px', 
          borderRadius: '10px', 
          border: 'none', 
          backgroundColor: 'green', 
          color: 'white', 
          fontSize: '16px', 
          cursor: 'pointer'
        }} 
        type='submit' 
      >
        Share
      </button>

      {/* Close Button */}
      <button 
        style={{
          width: '150px', 
          height: '40px', 
          borderRadius: '10px', 
          border: 'none',  
          color: 'white',  
          cursor: 'pointer',
          background:'none',
          position:'absolute',
          top:'23px',
          right:'-30px'
        }}
        onClick={() => setIsOpen(false)}
      >
        <i style={{ fontSize: '30px', color: 'red' }} class="fa-regular fa-circle-xmark"></i>
      </button>

    </form>
  </div>
)}

      </div>
      <div>
        <CardCarousel experience={cards}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: '80%', left: '5%' }}>
  {/* First Card */}
  <div style={{ display: 'flex', marginRight: '70px', border: '2px solid white', width: '230px', height:'120px', padding: '10px', borderRadius:'10px' }}>
    <img style={{ width: '110px', height: '110px', marginRight: '10px' }} src='images/cobalt-rush.jpg' alt="Cobalt Rush" />
    <div>
      <p style={{ color: 'white', fontSize:"20px", marginTop:'7px' }}>Cabalt Rush</p>
      <p style={{color:'grey', fontSize:'15px', marginTop:'-7px'}}>Mens Perfume</p>
      <button style={{
        background:'none', 
        color:'white', 
        borderRadius:'5px', 
        border:'1px solid white', 
        padding:'7px', 
        fontSize:'12px'
      }}
      onClick={handleHomeBtn}>Explore More</button>
    </div>
  </div>

  {/* Second Card */}
  <div style={{ display: 'flex', marginRight: '70px', border: '2px solid white', width: '230px', height:'120px', padding: '10px', borderRadius:'10px' }}>
    <img style={{ width: '102px', height: '110px', marginRight: '10px' }} src='images/mystic-rose.jpg' alt="Mystic Rose" />
    <div>
      <p style={{ color: 'white', fontSize:"20px", marginTop:'7px' }}>Mystic Rose</p>
      <p style={{color:'grey', fontSize:'15px', marginTop:'-7px'}}>Womens Perfume</p>
      <button style={{
        background:'none', 
        color:'white', 
        borderRadius:'5px', 
        border:'1px solid white', 
        padding:'7px', 
        fontSize:'12px'
      }} onClick={handleHomeBtn} >Explore More</button>
    </div>
  </div>

  {/* Third Card */}
  <div style={{ display: 'flex', border: '2px solid white', width: '230px', height:'120px', padding: '10px', borderRadius:'10px' }}>
    <img style={{ width: '110px', height: '110px', marginRight: '10px' }} src='images/Lattafa-Khamrah.jpeg' alt="Lattafa Khamrah" />
    <div>
      <p style={{ color: 'white', fontSize:"20px", marginTop:'7px' }}>Velvet Sky </p>
      <p style={{color:'grey', fontSize:'15px', marginTop:'-7px'}}>Unisex Perfume</p>
      <button 
      style={{
        background:'none', 
        color:'white', 
        borderRadius:'5px', 
        border:'1px solid white', 
        padding:'7px', 
        fontSize:'12px'
      }}
      onClick={handleHomeBtn}>Explore More</button>
    </div>
  </div>
</div>

<div ref={aboutSectionRef}>
  <img style={{width:'100%', height:'100%', position:'absolute', top:'100.5%', left:'-0%'}} src='images/history.png' alt='history pic'/>
</div>
<hr/>
<div>
  <img style={{width:'100%', height:'100%', position:'absolute', top:'200.9%', left:'-0'}} src='images/team.png' alt='history pic'/>
</div>
    </div>
  );
}
