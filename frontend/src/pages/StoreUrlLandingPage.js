import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
//import { Link } from "react-router-dom"
import Button from "@mui/material/Button";
import PhoneIcon from '@mui/icons-material/Phone';
//import EmailIcon from '@mui/icons-material/Email';
import {useParams} from "react-router-dom"
import { useSelector } from 'react-redux';
import { ChatState } from '../context/ChatProvider';

function StoreUrlLandingPage() {
    //const storename = props.match.params.storename
  const {storename} = useParams()
   
    const [loadProduct, setLoadProduct] = useState(false);
    const [errorProduct, setErrorProduct ] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mystore, setMyStore] = useState()
    const [storeId, setStoreId ] = useState()
    
const [createChatLoading, setCreateChatLoading] = useState(false)
  const [errorCreateChat, setErrorCreateChat] = useState(false)
  const [successCreateChat, setSuccessCreateChat] = useState(false)
  
  
  //get login user details from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

    //import state from context
  const {setSelectedChat, chats, setChats } =
    ChatState();
    
    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`/${storename}`)
                setLoading(false)
                setMyStore(data)
                
            } catch (error) {
                setError(error.message);
                setLoading(false)
         }
        } 
        fetchStore()
  }, [storename])
    
    //console.log(mystore)


    useEffect(() => {
        if (mystore) {
             setStoreId(mystore._id)
        }
       
    }, [mystore])

  //const storeId = props.match.params.id;
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadProduct(true);
                const { data } = await axios.get(`/api/v1/product/nonuser/${storeId}`)
                setLoadProduct(false);
                setProducts(data)
            } catch (error) {
                setErrorProduct(error.message);
                setLoadProduct(false);
                
            }
        }
        fetchProduct()
    }, [storeId])
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
     const { data } = await axios.post('/api/v1/chat', { userId }, config);
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
            <div>
                {
                    mystore && <div>
                        {
                   loading? (<LoadingBox></LoadingBox>):
                   error? (<MessageBox variant="danger">{error}</MessageBox>):
                        <>
                            {
                                mystore?.isClosed?
                                (<div className='close-store' style={{maxWidth:"100%"}}>
          <h1>Business Activities Closed.</h1>
          <p>To be opened: </p>
                                    <h3>{mystore.toBeOpened}</h3>
                                    </div>) :
                                    (
                                        <div>
                                            <div className="row top bottom">
                    <div className="col-1">
          <div className="profile-card">
            <div>
              
                <h3 className="profile-header">
                  <span className="name-description">Seller Name:</span>{" "}
                  {mystore.creatorName}
                        </h3>  
                                    
             
              <div>
                        <div className="row around">
                          <div>
                             <img
                  className="profile-img"
                  src= {mystore.creatorImage}
                  alt="profile"
                /> 
                          </div>
                  <div className="contact">
                    <p>
                      <span>
                        <PhoneIcon />
                      </span>{" "}
                      {mystore.creatorPhone}
                    </p>
                    
                        <p>
                          <Button variant="contained" color="primary" size="small" onClick={() => {
                                         
                           handleChat(mystore.user)
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
                           <h3 className="store-name"><span className="name-description">Store Name:</span>{" "} <strong>{mystore.name}</strong> </h3>
                           <img className="img large" src ={mystore.image} alt="store" />
                           </div>
                           <div className="description">
                                   <h3>Store Details</h3>
                                   <p>Business Address: <strong>{mystore.address}</strong></p>
                                   <p>City/Town: <strong>{mystore.city} </strong></p>
                                   <p>State: <strong>{mystore.state}</strong></p>
                                   <p>Country: <strong>{mystore.country}</strong></p>
                                            <p>Description: <strong>{mystore.description}</strong></p>
                                            <p>
                 Delivery: <strong style={{color:"red"}}>{mystore.deliveryCapacity === "Within-the-same-city" ?
                   `Only within ${mystore.city}` : mystore.deliveryCapacity === "Within-the-same-state" ?
                  `Only within ${mystore.state}`: `Across ${mystore.country}`}
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
                }
            </div>
            
            
        </div>
                    
    )
}

export default StoreUrlLandingPage
