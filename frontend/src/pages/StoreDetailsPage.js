import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getSingleStore } from '../actions/storeActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Button from "@mui/material/Button";
import PhoneIcon from '@mui/icons-material/Phone';
import {useParams} from 'react-router-dom'
import { ChatState } from '../context/ChatProvider';


function StoreDetailsPage() {
    const dispatch = useDispatch();
    //const storeId = props.match.params.id;
  const {id} = useParams()
   
    const [loadProduct, setLoadProduct] = useState(false);
    const [errorProduct, setErrorProduct ] = useState('')
  const [products, setProducts] = useState([])
  
    
  const [createChatLoading, setCreateChatLoading] = useState(false)
  const [errorCreateChat, setErrorCreateChat] = useState(false)
  const [successCreateChat, setSuccessCreateChat] = useState(false)
  
  
  //get login user details from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

    //import state from context
  const {setSelectedChat, chats, setChats } =
    ChatState();
    //get store details from redux store
    const storeDetails = useSelector((state) =>state.storeDetails);
    const { loading, error, store } = storeDetails;
    
  
  
    
    useEffect(() => {
        dispatch(getSingleStore(id));

    }, [dispatch, id])
  
 

    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadProduct(true);
                const { data } = await axios.get(`https://mosganda-online-market-backend.herokuapp.com/api/v1/product/nonuser/${id}`)
                setLoadProduct(false);
                setProducts(data)
            } catch (error) {
                setErrorProduct(error.message);
                setLoadProduct(false);
                
            }
        }
        fetchProduct()
    }, [id])
    //console.log(products)
 
  //handle chat
  const handleChat = async (userId) => {
    if (!userInfo) {
      window.location = "/login"
      return
    } else {
      try {
     setCreateChatLoading(true)
     const config = {
         headers: {
           "Content-type":"application/json",
           Authorization: `Bearer ${userInfo.token}`
         },
       };
     const { data } = await axios.post('https://mosganda-online-market-backend.herokuapp.com/api/v1/chat', { userId }, config);
     if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
     setCreateChatLoading(false)
     setSuccessCreateChat(true)
        setSelectedChat(data)
        
   } catch (error) {
    setErrorCreateChat(error.message)
   }
    }
   
  }

  if (successCreateChat) {
    window.location = "/chats"
    setTimeout(() => {
      setSuccessCreateChat(false)
    },3000)
  }
  
    
    return (
        <div>
            {
                   loading? (<LoadingBox></LoadingBox>):
                   error? (<MessageBox variant="danger">{error}</MessageBox>):
                        <>
                            {
                                store.singleStore.isClosed?
                                (<div className='close-store' style={{maxWidth:"100%"}}>
          <h1>Business Activities Closed.</h1>
          <p>To be opened: </p>
                                    <h3>{store.singleStore.toBeOpened}</h3>
                                    </div>) :
                                    (
                                        <div>
                                            <div className="row top bottom">
                    <div className="col-1">
          <div className="profile-card">
            <div>
              
                <h3 className="profile-header">
                  <span className="name-description">Seller Name:</span>{" "}
                  {store.singleStore.creatorName}
                        </h3>  
                                    
             
              <div>
                        <div className="row around">
                          <div>
                             <img
                  className="profile-img"
                  src= {store.singleStore.creatorImage}
                  alt="profile"
                /> 
                          </div>
                  <div className="contact">
                    <p>
                      <span>
                        <PhoneIcon />
                      </span>{" "}
                      {store.singleStore.creatorPhone}
                    </p>
                   
                      
                       <p>
                          <Button variant="contained" color="primary" size="small" onClick={() => {
                                         
                        handleChat(store.singleStore.user)
                      }}>
                      Message
                    </Button>
                                      </p>
                                      {
                                        createChatLoading && <LoadingBox></LoadingBox>
                                      }
                                      {
                                        errorCreateChat &&
                                        <MessageBox variant="danger">Error</MessageBox>
                                      }
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
                   
                       <div className="col-2">
                       <div className="row around nonuser-col2">
                           <div className="store-image">
                           <h3 className="store-name"><span className="name-description">Store Name:</span>{" "} <strong>{store.singleStore.name}</strong> </h3>
                           <img className="img large" src ={store.singleStore.image} alt="store" />
                           </div>
                           <div className="description">
                                   <h3>Store Details</h3>
                                   <p>Business Address: <strong>{store.singleStore.address}</strong></p>
                                   <p>City/Town: <strong>{store.singleStore.city} </strong></p>
                                   <p>State: <strong>{store.singleStore.state}</strong></p>
                                   <p>Country: <strong>{store.singleStore.country}</strong></p>
                                            <p>Description: <strong>{store.singleStore.description}</strong></p>
                                            <p>
                 Delivery: <strong style={{color:"red"}}>{store.singleStore.deliveryCapacity === "Within-the-same-city" ?
                   `Only within ${store.singleStore.city}` : store.singleStore.deliveryCapacity === "Within-the-same-state" ?
                  `Only within ${store.singleStore.state}`: `Across ${store.singleStore.country}`}
                  </strong>
              </p>
                                            
                                   
                           </div>
                       </div>
                       </div>
                       
                   </div>
                            {/* <div style={{backgroundColor:"white", padding:"10px"}}>
                                
                   <h3 style={{textAlign:"center"}}>Checkout list of our items below, for your shopping pleasure.</h3>
               </div> */}
                            <div className="row center" style={{borderTop: "5px solid blue", marginTop:"10px"}}>
                                {loadProduct && <LoadingBox></LoadingBox>}
                                {errorProduct && <MessageBox variant="danger">{ errorProduct}</MessageBox>}
                   {
                       products.map((product) =>(
                        <Product key = {product._id} product = {product} showStoreButton={false}></Product>
                       ))
                   }

                            </div>
                                        </div>
                                    )
                            }
                   
                            
           </>
            }
            
            
                        </div>
                    
    )
}

export default StoreDetailsPage
