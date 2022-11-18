import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import { getProductDetails } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
//import Rating from "../components/Rating"
import Button from "@mui/material/Button";
import {useParams} from 'react-router-dom'


function ProductPage(props) {
    const dispatch = useDispatch();
    //const productId = props.match.params.id;
  const {id} = useParams() //replace productId with id
    const [ qty, setQty ] = useState(1);

    //read product details from redux store
    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product} = productDetails;
    //console.log(product)

    useEffect(() => {
        dispatch(getProductDetails(id));
    },[dispatch, id]);

    //function to handle add to basket button
    const addToBasketHandler = () => {
        window.location = `/basket/${id}?qty=${qty}`
  }
  

  
    return (
      <div className='responsive' style={{backgroundColor:"#f5f5f5", padding:"10px"}}>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
              <div style={{backgroundColor:"#f5f5f5", padding:"10px"}}>
                <h3 style={{textAlign:"center"}}>Product Detail</h3>
            <Link to="/">
              <Button variant="contained" color="success" size="small">
                Back to homepage
              </Button>
            </Link>
            <div className="row top">
              <div className="col-2">
                <img className="large" src={product.image} alt={product.name} />
                <Link to={`/store/${product.productStoreId}`}>
                  <p>
                    <Button variant="contained" color="success" size="small">
                      View-store
                    </Button>
                      </p>
                    </Link>
                    
              </div>
              <div className="col-1">
                <ul>
                  <li>
                    <h3>{product.name}</h3>
                  </li>
                  {/* <li>
                           <Rating
                           rating = {product.rating}
                           numReviews = {product.numReviews}
                           ></Rating>
                       </li> */}
                  <li>
                    Price: <strong>#{product.price}</strong>
                  </li>
                  <li>
                    Description:<strong>{product.description}</strong>
                  </li>
                  <li>
                    Store-Name: <strong>{product.storeName}</strong>
                  </li>
                  <li>
                    Address:{" "}
                    <strong>
                      {product.storeAddress}, {product.storeCity}
                    </strong>
                      </li>
                      <li>
                    Seller-Name: <strong>{product.sellerName}</strong>
                      </li>
                      <li>
                        Delivery: <strong style={{color:"red"}}>{product.deliveryCapacity === "Within-the-same-city" ?
                          `Only within ${product.storeCity}` : product.deliveryCapacity === "Within-the-same-state" ?
                        `Only within ${product.storeState}`: `Across ${product.storeCountry}`}
                        </strong>
                  </li>
                </ul>
              </div>
              <div className="col-1">
                    {
                      product.isPaid ? (<div>
                        <h4>Buyer Information</h4>
                <p>Buyer Name: <b>{product.buyerName}</b>, Buyer Phone: <b>{product.buyerPhone}</b></p>
                        <p>Buyer Address: {product.buyerAddress}</p>
                        
                        <h4>Status</h4>
                        <p>Paid For?: <strong>{product.isPaid ? `Paid by ${product.buyerName}` : "Not yet paid"}</strong></p>
                        <p>Delivered?: <strong>{product.isDelivered ? `Delivered at ${product.isDeliveredAt.substring(0, 10)}` : "Not delivered."}</strong></p>
                        <p>Settled?: <strong>{product.isSettled ? `Settled at ${product.isSettledAt.substring(0, 10)}` : "Not yet settled."}</strong></p>
                        <p><Button variant="contained" size="small"
                                        onClick={() => { props.history.push(`/order/${product.orderId}`) }}>
                                        View Order
                                    </Button></p>
                      </div>) :
                        (<div className="card card-body">
                  <ul>
                    <li>
                      <div className="row">
                        <div>Price</div>
                        <div className="price"><b>#{product.price}</b></div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Status</div>
                        <div>
                          {product.countInStock > 0 ? (
                            <span className="success">In Stock</span>
                          ) : (
                            <span className="danger">Unavailable</span>
                          )}
                        </div>
                      </div>
                    </li>
                    {product.countInStock > 0 && (
                      <>
                        <li>
                          <div className="row">
                            <div>Qty</div>
                          </div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {
                                /* map through the value of countInStock and increament it by 1*/
                                [...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )
                              }
                            </select>
                          </div>
                        </li>
                        <li>
                          <button
                            onClick={addToBasketHandler}
                            className="primary block"
                          >
                            {" "}
                            Add to shopping basket
                          </button>
                                </li>
                                
                      </>
                    )}
                          </ul>
                          
                </div>)
                }
                  </div>
                  
            </div>
          </div>
        )}

        
      </div>
    );
  }
  
  export default ProductPage
  