import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";

export default function HomePage({ productId }) {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [productType, setProductType] = useState('');
    const [price, setPrice] = useState('');
    const [group, setGroup] = useState('');
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activePost, setActivePost] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [category, setCategory] = useState('All');
    const [sortItem, setSortItem] = useState('');
    const [showBestSeller, setShowBestSeller] = useState(false);
    const [showCrazyDeals, setShowCrazyDeals] = useState(false);
    const [showNewArrivals, setShowNewArrivals] = useState(false);
    const [rating, setRating] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // const reviewPerProduct = 5;
    // const [currentReview, setCurrentReview] = useState(1);

    // const startIndex = (currentReview - 1) * reviewPerProduct;
    // const endIndex = startIndex + reviewPerProduct;

    // const totalReview = Math.ceil(data.length / reviewPerProduct);

    // const handleNext = () => {

    // }
    // const [displayedItems, setDisplayedItems] = useState([]); 
    // const navigate = useNavigate();


    const SortAscItem = () => {
        const sortAsc = (prevItems => [...prevItems].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        setItems(sortAsc(items));
    }

    const handleSortItem = (value) => {

        // if(sortItem === value) return;
        setSortItem(value);
        if (value === 'Ascending') {
            SortAscItem();
        } else {
            setItems([...items])
        }
    }


    const filterCat = category === 'All'
        ? items
        : items.filter(item => item.type === category)

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const sortedAndFilteredItems = filterCat.sort((a, b) =>
        sortItem === 'Ascending' ? a.price - b.price : sortItem === 'Descending' ? b.price - a.price : 0
    );

    const filteredItems = sortedAndFilteredItems.filter(item => {
        if (showBestSeller) return item.group === 'bestseller';
        if (showCrazyDeals) return item.group === 'crazydeals';
        return true;
    })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const displayedItems = Array.isArray(filteredItems) ?
        (showNewArrivals ? filteredItems.slice(0, 10) : filteredItems) : [];


    const handleImageClick = (post) => {
        setActivePost(post);
    }

    const handleClosePost = () => {
        setActivePost(null);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        // Ensure all fields are filled
        if (!file || !name || !description || !size || !productType || !price || !group) {
            alert('All fields are required');
            return;
        }

        try{
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Perfume_website');
        formData.append('folder', 'eCommerce');
        formData.append('name', name);
        formData.append('description', description);
        formData.append('size', size);
        formData.append('productType', productType);
        formData.append('price', price);
        formData.append('group', group);

        const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/dkqzeypto/image/upload`,
            formData
        )

        const imageUrl = cloudinaryResponse.data.secure_url;

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Authorization token is missing');
            return;
        }

            const response = await axios.post(
                'http://localhost:8000/api/uploads',
                {
                    name,
                    description,
                    size,
                    productType,
                    price,
                    group,
                    image : imageUrl
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
            setItems([...items, response.data.post]); // Add new post to items
            resetForm();
        } catch (error) {
            console.error('Error uploading post:', error.response?.data || error.message);
            alert('Sorry, Only Adimn can Create post');
        }
    };

    // Helper function to reset form fields
    const resetForm = () => {
        setName('');
        setDescription('');
        setSize('');
        setProductType('');
        setPrice('');
        setGroup('');
        setFile(null);
    };

    useEffect(() => {
        GetPost();
        checkAdminStatus();
    }, []);

    useEffect(() => {
        if (activePost?._id) {
            console.log("Active Post ID:", activePost._id);
            fetchComments(activePost._id);
        }
    }, [activePost]);

    const GetPost = async () => {
        try {
            const response = await axios.get('http://localhost:8000/post', {
                withCredentials: true,
            });
            setItems(response.data);
        } catch (error) {
            setError('Failed to fetch data');
        }
    };

    const fetchRating = async (productId) => {

        if (!productId) {
            console.log("Product ID is missing!");  // Debugging log
            return;
        }

        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You must be logged in to rate a product');
            return;
        }

        // const userId = jwtDecode(token).id;

        try {
            const response = await axios.get(`http://localhost:8000/rating/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAvgRating(response.data.averageRating);
            setTotalRating(response.data.totalRating);
            setRating(response.data.userRating || 0);
        } catch (error) {
            console.log("Error fetching rating", error);
        }
    };

    const submitRating = async (newRating, productId) => {

        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You must be logged in to rate a product');
            return;
        }

        const userId = jwtDecode(token).id;

        try {
            setRating(newRating);
            await axios.post(`http://localhost:8000/rate/${productId}`,
                { userId, rating: newRating },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchRating(productId);
        } catch (error) {
            console.log("Error submitting rating", error);
        }
    };

    const fetchComments = async (productId) => {
        console.log("Fetching comments for productId:", productId);
        if (!productId || typeof productId !== "string") {
            console.log("Invalid productId:", productId);
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:8000/comment/${productId}`);
            console.log("Full Response:", response.data); // ✅ Log full response
    
            if (!response.data || !Array.isArray(response.data.comments)) {
                console.log("Invalid response format:", response.data);
                return;
            }
    
            setComments(response.data.comments);
            console.log("Updated Comments State:", response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            alert(`Fetch Comments Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const deleteComments = async (reviewId) => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                alert("User not authenticated. Please log in again.");
                return;
            }
    
            if (!reviewId) {
                alert("Invalid Review ID");
                return;
            }
    
            console.log("🔹 Deleting review with ID:", reviewId);
            console.log("🔹 Token being sent:", token);
    
            const response = await axios.delete(`http://localhost:8000/comment/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Delete response:", response.data);
            alert(response.data.message);
    
            // Refresh comments after deletion
            fetchComments();  
        } catch (error) {
            console.error("❌ Error deleting review:", error);
            console.log("❌ Full error response:", error.response?.data);
            alert(`Delete Error: ${error.response?.data?.message || error.message}`);
        }
    };
    
    
    const submitComment = async (productId) => {
        console.log("Product ID received:", productId);

        if (!productId || typeof productId !== "string") {
            alert("Invalid product ID");
            return;
        }

        const token = localStorage.getItem("authToken");
        console.log("Token from localStorage:", token);

        if (!token) {
            alert("You must be logged in to comment.");
            return;
        }

        try {
            const user = jwtDecode(token);
            console.log("Decoded User:", user); // Debugging log

            const userId = user.id;
            const username = user.username; // ✅ Extract username properly

            if (!username) {
                alert("Username is missing in the token.");
                return;
            }

            await axios.post(`http://localhost:8000/comment/${productId}`,
                { userId, username, comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNewComment("");
            fetchComments(productId);
            alert('Comment Submitted');
        } catch (error) {
            console.error("Error submitting comment", error);
            alert(`Error submitting comment: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSubmit = () => {
        console.log("Submitting comment for:", activePost?._id);  // Debugging log

        if (!activePost?._id) {
            alert("Product ID is missing");
            return;
        }

        submitComment(activePost._id);
    };

    const checkAdminStatus = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            await axios.get('http://localhost:8000/permission/admin', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsAdmin(true); // If the response is successful, user is admin
        } catch (error) {
            console.log('Error checking admin status:', error.response?.data || error.message);
            setIsAdmin(false); // If the request fails, user is not admin
        }
    };

    const handleAddToCart = async (item) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You must be logged in to add items to the cart');
            return;
        }

        const userId = jwtDecode(token).id;
        try {
            const response = await axios.post(
                'http://localhost:8000/api/cart/add',
                {
                    userId,
                    itemId: item._id,
                    itemName: item.name,
                    itemPrice: item.price,
                    itemSize: item.size,
                    itemType: item.type,
                    itemGroup: item.group
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert(response.data.message);
        } catch (error) {
            console.log('Error adding item to cart:', error.response?.data || error.message);
            alert('Failed to add item to cart');
        }
    }

    const handleFetchCart = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You must be logged in to view your cart');
            return;
        }

        const userId = jwtDecode(token).id;
        console.log('User ID', userId);

        try {
            const response = await axios.get(`http://localhost:8000/api/cart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Cart items', response.data);
            setCartItems(response.data);  // Update the state with fetched cart items
        } catch (error) {
            console.log('Error fetching cart:', error.response?.data || error.message);
            alert('Failed to fetch cart');
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/post/delete/${id}`, {
                withCredentials: true,
            });
            alert('Post delete success')
        } catch (error) {
            console.error(error.response?.data || 'Failed to delete post');
            alert(error.response?.data?.message || 'Failed to delete post');
        }
    }


    const handleCartButtonClick = async () => {
        await handleFetchCart();
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    }

    const handleDeleteCart = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/cart/${id}`,
                { withCredentials: true }
            )
            setCartItems(prevItems => prevItems.filter(item => item._id !== id))
        } catch (error) {
            alert('Failed to delete item')
        }
    }


    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <img style={{ width: '50px', height: 'auto', verticalAlign: 'middle' }} src="images/perfume-brand.png" alt="Veda Essence Logo" />
                <h3 style={{ marginLeft: '20px', fontStyle: 'italic' }}>~Veda Essence~</h3>


            </div>

            <Navbar
                OnCartClick={handleCartButtonClick}
                OnCategoryClick={handleCategoryChange}
                OnArrivalClick={handleSortItem}
                selectedSort={sortItem}
                showBestSeller={showBestSeller} setShowBestSeller={setShowBestSeller}
                showCrazyDeals={showCrazyDeals} setShowCrazyDeals={setShowCrazyDeals}
                showNewArrivals={showNewArrivals} setShowNewArrivals={setShowNewArrivals}
            />

            <h1>Today's Best Deals !!</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}



            {isCartOpen && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0,0,0,2)',
                    zIndex: 1000,
                    width: '50%'
                }}>
                    <button
                        style={{ position: 'absolute', right: '2.5%', background: 'none', border: 'none' }}
                        onClick={handleCloseCart}>
                        <i style={{ fontSize: '30px', color: 'red' }} class="fa-regular fa-circle-xmark"></i>
                    </button>
                    <h2>Your Cart</h2>
                    <ol
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            padding: '10px'
                        }}>
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <h3 style={{ fontStyle: 'italic' }}>{item.itemName}</h3>
                                    <div style={{ display: 'flex', gap: '50px', justifyContent: 'center' }}>
                                        <p><strong>Price: </strong>{item.itemPrice}</p>
                                        <p><strong>Size: </strong>{item.itemSize}</p>
                                        <p><strong>Type: </strong>{item.itemType}</p>
                                    </div>
                                    <button onClick={() => {
                                        console.log(item._id);  // Check if the ID is correct
                                        handleDeleteCart(item._id);
                                    }}>Delete Item</button>

                                    <hr />
                                </li>

                            ))
                        ) : (
                            <p>Your Cart is Empty</p>
                        )}
                    </ol>
                    {cartItems.length > 0 && (
                        <div>
                            Final Price : {cartItems.reduce((total, item) => total + Number(item.itemPrice), 0)}
                        </div>
                    )}
                </div>
            )}

            {isAdmin && (
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? 'Close Form' : 'Open Form'}
                </button>
            )}
            <div>
                {isOpen && (
                    <form onSubmit={handleFileSubmit} style={{ marginTop: '10px' }}>
                        <input type="file" onChange={handleFileChange} />
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Name"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter Description"
                            />
                        </div>
                        <div>
                            <select placeholder="Enter size" value={size}
                                onChange={(e) => setSize(e.target.value)}
                                defaultValue=""
                            >
                                <option value='' disabled>Select Size</option>
                                <option value='small'>Small</option>
                                <option value='medium'>Medium</option>
                                <option value='large'>Large</option>
                            </select>
                        </div>
                        <div>
                            <select placeholder="Enter Type" value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                defaultValue=""
                            >
                                <option value='' disabled>Select Type</option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                                <option value='unisex'>Unisex</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                defaultValue=""
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="bestseller">Best Seller</option>
                                <option value="crazydeals">Crazy Deals</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter Price"
                            />
                        </div>
                        <button type="submit">Upload</button>
                    </form>
                )}
            </div>

            <div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // Ensures 4 images per row
                        gap: '30px', // Space between images
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        marginLeft: '80px',

                    }}>

                    {/* {displayedItems.map(item => (
    <div 
    key={item._id}>
            
    </div>
))} */}

                    {Array.isArray(displayedItems) && displayedItems.length > 0 ? (
                        displayedItems.map(item => (

                            <div key={item._id}>
                                {/* Your existing JSX here */}
                                {!activePost && item.image && (
                                    <div
                                        style={{
                                            borderRadius: '10px',
                                            border: '2px solid black',
                                            width: '350px',
                                            marginTop: '100px'
                                        }}
                                    >
                                        <img
                                            src={`http://localhost:8000/${item.image}`}
                                            alt={item.name}
                                            style={{
                                                width: '100%',  // Adjusts image width properly
                                                maxWidth: '250px', // Prevents oversized images
                                                height: '250px', // Maintains uniform height
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                                padding: '10px',
                                            }}
                                            onClick={() => handleImageClick(item)}
                                        />
                                        <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                                    </div>
                                )}

                                {/* Active post content */}
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '60%',
                                        backgroundColor: 'white',

                                    }}>
                                    {activePost && activePost._id === item._id && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                border: '2px solid',
                                                padding: '20px',
                                                borderRadius: '20px',
                                                justifyContent: 'center'
                                            }}>
                                            {item.image && (
                                                <img
                                                    src={`http://localhost:8000/${item.image}`}
                                                    alt={item.name}
                                                    style={{ width: '500px', height: '400px', margin: '10px' }}
                                                />
                                            )}
                                            <div style={{ width: '50%', marginLeft: '30px' }}>
                                                <button
                                                    style={{ position: 'absolute', right: '5px', top: '10px', border: 'none', background: 'none' }}
                                                    onClick={handleClosePost}>
                                                    <i style={{ fontSize: '30px', color: 'red' }} class="fa-regular fa-circle-xmark"></i>
                                                </button>
                                                <h1 style={{ fontStyle: 'italic' }}>{item.name}</h1>
                                                <p>{item.description}</p>
                                                <p><strong>Available Size:</strong> {item.size}</p>
                                                <p><strong>Type:</strong> {item.type}</p>
                                                <p><strong>Price Rs:</strong> {item.price}</p>

                                                {/* <h3>Average Rating : {avgRating} ({totalRating} reviews)</h3> */}
                                                <div>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar
                                                            key={star}
                                                            size={24}
                                                            onClick={() => submitRating(star)}
                                                            color={star <= rating ? "gold" : "gray"}
                                                            style={{ Cursor: "pointer" }}
                                                        />
                                                    ))}
                                                </div>

                                                <div>
                                                    <input
                                                        type="text"
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Write a comment.."
                                                    />
                                                    <button onClick={handleSubmit}>Submit</button>

                                                    <ul>
                                                        {comments && comments.length > 0 ? (
                                                            comments.map((c, index) => (
                                                                <li key={c._id || index}>
                                                                    <strong>{c.username || "Unknown"}</strong>: {c.comment}
                                                                    {/* <button onClick={() => deleteComments(c._id)}>Delete</button> */}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <p>No comments available</p>  // ✅ Add fallback if comments are empty
                                                        )}
                                                    </ul>

                                                </div>

                                                <button
                                                    style={{
                                                        borderRadius: '10px',
                                                        // border: 'none', 
                                                        width: '90px',
                                                        height: '25px',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => handleAddToCart(item)}>Add to cart</button>

                                                {isAdmin && (
                                                    <button
                                                        style={{
                                                            marginLeft: '20px',
                                                            borderRadius: '10px',
                                                            // border: 'none', 
                                                            width: '90px',
                                                            height: '25px',
                                                            justifyContent: 'center',
                                                            fontWeight: 'bold'
                                                        }}
                                                        onClick={() => handleDeletePost(item._id)}>
                                                        Delete <i
                                                            style={{ marginLeft: '10px' }} class="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items to display</p> // Handle the case when there are no items
                    )}

                </div>
            </div>
        </div>
    );
}
