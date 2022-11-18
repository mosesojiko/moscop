import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { PaystackButton } from 'react-paystack'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { detailsOrder, orderNotification, payOrder } from '../actions/orderActions';
import { paidProduct } from '../actions/productActions';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';



function OrderPage() {
    //const orderId = props.match.params.id;
    const {id} = useParams() //use id to replace orderId
    //const publicKey = "pk_test_863b631d2a66390b101d9b0be373f958bad8ac59"
    //const amount = 1000000 // Remember, set in kobo!
    const [publicKey, setPublicKey]=useState("")
    const [email, setEmail ] = useState("")
    const [name, setName ] = useState("")
    const [phone, setPhone ] = useState("")
    const [ amount, setAmount ] = useState(0)
    

    //get login user details from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
   //console.log(userInfo);

     //get order details from redux store
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    //console.log(order)

    //get the orderPay from redux store
    const orderPay = useSelector(state => state.orderPay);
    //in other to use error, and success in orderPay, we rename it
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay

    //get productPaid from redux store
    const productPaid = useSelector((state) => state.productPaid);
    const { loading: loadingPaid, error: errorPaid } = productPaid
    
    //get orderNotify from state
    const orderNotify = useSelector((state) => state.orderNotify);
    const {error: errorNotify, success: successNotify} = orderNotify

    const dispatch = useDispatch();

    useEffect(() =>{
        const getPaystackKey = async () => {
            const { data } = await Axios.get('/api/v1/config/paystack');
            setPublicKey(data)
            
        }
        
        getPaystackKey()
        
    },[])
   

    useEffect(()=>{
        if(!order || successPay || (order && order._id !== id)) {
            dispatch({
                type: ORDER_PAY_RESET
            })
            dispatch(detailsOrder(id)); //load the order
        }
        
    },[dispatch, order, id, successPay])

    useEffect(() =>{
        if(order) {
            setAmount((order.totalPrice * 100).toFixed(2))
            setEmail(email)
            setPhone(phone)
            setName(name)
            order.paymentResult = { id: id, name: name, email: email, phone: phone, amount: amount / 100 }
        }
       
    },[email, name, order, phone])
    
    

    const componentProps = {
        email,
        amount,
        metadata: {
          name,
          phone,
        },
        publicKey,
        text: "Pay Now (Paystack)",
        onSuccess: () =>
        alert("Thanks for doing business with us. Payment receipt has been sent to your email."),
        onClose: () => alert("Wait! You've not completed your payment."),
      }
      
      //get sellerEmail id
    //  const sellerEmail = order && order.orderItems.map((x) => {
    //       return x.sellerEmail
    //   })[0]
     

    const paymentResult = { id: id, name: name, email: email, phone: phone, amount: amount / 100 }
    
      const successHandler = () => {
          dispatch(payOrder(order, paymentResult));

          //update paid products
        order.orderItems.map((x) => {
            return dispatch(paidProduct({id: x.product, buyerEmail:email, orderId:id, deliveryCost: x.deliveryCost, service: x.service }))
        });
          
           //notify buyer
        dispatch(orderNotification(id))
      }

    return loading? (<LoadingBox></LoadingBox>):
    error? (<MessageBox variant="danger">{error}</MessageBox>):
    (
        <div style={{backgroundColor:"white"}}>
            <p style={{padding:"10px", maxWidth:"90%", marginBottom:"0px"}}>Order Id: <span style={{backgroundColor:"#006400",color:"yellow",padding:"5px"}}>{order._id}</span> </p>
            <div className = "row top">
                <div className = "col-2">
                    <ul>
                        <li>
                            <div className ="card card-body">
                                <h4>Shipping/Buyer Information</h4>
                                <p> <strong>Name:</strong> { order.shippingAddress.fullName }, <strong>Phone:</strong> { order.shippingAddress.phone } <br />
                                <strong>Address:</strong> { order.shippingAddress.address },
                                { order.shippingAddress.city }, 
                                 { order.shippingAddress.state }, { order.shippingAddress.country }
                                </p>

                                {
                                    order.isPaid && 
                                    <>
                                    <p>Paid By: <strong>{order.paymentResult.name}</strong>, Phone: <strong>{order.paymentResult.phone}</strong></p>
                                    </>

                                }

                                { order.isDelivered?
                                 (<MessageBox variant ="success">Delivered at {order.deliveredAt}</MessageBox>):
                                 (<MessageBox variant="danger">Not Delivered</MessageBox>)
                                 }
                            </div>
                        </li>
                        <li>
                            <div className ="card card-body">
                                <h4>Payment</h4>
                                <p> Method: { order.paymentMethod } 
                                </p>

                                { order.isPaid?
                                 (<MessageBox variant ="success">Paid at {order.paidAt}</MessageBox>):
                                 (<MessageBox variant="danger">Not Paid</MessageBox>)
                                 }
                            </div>
                                </li>
                                <li>
                                    <div className='card card-body'>
                                        <h4>Delivery</h4>
                                        <p>Fee: #{ order.deliveryFee}</p>
                                    </div>
                                </li>
                        <li>
                            <div className ="card card-body">
                                <h4>Order Items</h4>
                                <ul>
                            {
                                order.orderItems.map((item) =>(
                                    <li key = { item.product }>
                                        <div className ="row bottom">
                                            <div>
                                                <img src = { item.image } alt = { item.name } className="small"></img>
                                            </div>
                                            <div className ="min-30">
                                                <Link to = {`/product/${item.product}`}>{item.name}</Link>
                                                <h4>Store Information</h4>
                                                <p>Name: <strong>{item.storeName}</strong></p>
                                                <p>Address: <strong>{item.storeAddress}, {item.storeCity}, {item.storeCountry}.</strong></p>
                                                <h4>Store Owner</h4>
                                                <p>Name: <strong>{item.sellerName}</strong> Phone: <strong>{item.sellerPhone}</strong></p>
                                            </div>
                                            
                                            <div>

                                                {item.qty} x {item.price} = #{item.qty * item.price}
                                            </div>
                                            
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                            </div>
                        </li>
                    </ul>

                </div>
                <div className = "col-1">
                    <div className ="card card-body">
                        <ul>
                            <li>
                                <h4>Order Summary</h4>
                            </li>
                            <li>
                                <div className = "row">
                                    <div>Items</div>
                                    <div>#{order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className = "row">
                                    <div>Delivery fee</div>
                                    <div>#{order.deliveryFee.toFixed(2)}</div>
                                </div>
                                    </li>
                                    {/* <li>
                                <div className = "row">
                                    <div>Service</div>
                                    <div>#{order.buyerService.toFixed(2)}</div>
                                </div>
                            </li> */}
                            
                            <li>
                                <div className = "row">
                                    <div> <strong>Order Total</strong> </div>
                                    <div> <strong>#{order.totalPrice.toFixed(2)}</strong> </div>
                                </div>
                            </li>
                            {
                                !order.isPaid &&
                            (<li>
                                <div className="form"> 
                                    
                                <div className='register-items'>
                                <h4>Receipt Form</h4>
                                  <label htmlFor="name">Name</label>
                                  <input
                              type="text"
                              id="name" required
                              onChange={(e) => setName(e.target.value)}
                            />
                                </div>
                                
                                <div className='register-items'>
                                  <label htmlFor="email">Email</label>
                                  <input
                              type="text"
                              id="email" required
                              onChange={(e) => setEmail(e.target.value)}
                            />
                                </div>
                                <div className='register-items' style={{marginBottom:"5px"}}>
                                  <label htmlFor="phone">Phone</label>
                                  <input
                              type="text"
                              id="phone" required
                              onChange={(e) => setPhone(e.target.value)}
                            />
                                </div>
                                <>
                                {
                                    errorPay && (<MessageBox variant="danger">{errorPay}</MessageBox>)
                                }
                                {
                                    loadingPay && <LoadingBox></LoadingBox>
                                }
                                {
                                    successPay && (<MessageBox variant="success">Order Paid Successfully.</MessageBox>)
                                }
                                <PaystackButton className="primary" {...componentProps} onSuccess={successHandler} />
                                </>
                           </div>
                               {
                                    errorPaid && (<MessageBox variant="danger">{errorPaid}</MessageBox>)
                                }
                                {
                                    loadingPaid && <LoadingBox></LoadingBox>
                                            }
                                         {
                                    errorNotify && (<MessageBox variant="danger">{errorNotify}</MessageBox>)
                                            }
                                            {
                                    successNotify && (<MessageBox variant="danger">{successNotify}</MessageBox>)
                                            } 
                           </li>)
                             }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderPage
