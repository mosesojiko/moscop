import React, {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToBasket, removeFromBasket } from '../actions/basketActions';
import MessageBox from '../components/MessageBox';
import Button from "@mui/material/Button";
 import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
 import {useParams, useSearchParams } from "react-router-dom"

function BasketPage() {
    //const productId = props.match.params.id;
    //finding the qty
  const { id } = useParams() 
  let [searchParams, setSearchParams] = useSearchParams()
  const qty = searchParams.get("qty")
    //const qty = props.location.search? Number(props.location.search.split('=')[1]) : 1

  const [proceed, setProceed] = useState(true)
  
    //get basket from redux store
    const basket = useSelector((state) => state.basket);
    const { basketItems } = basket;
    //console.log(basketItems)
    

    const dispatch = useDispatch();
  useEffect(() => {
      //change productId to id
        dispatch(addToBasket(id, qty))
    },[dispatch, id, qty])

    const removeFromBasketHandler = (id) => {
        dispatch(removeFromBasket(id))
    }
    //check if every element in the basket is has the same storeId
    const findStoreId = basket.basketItems.map((id) =>{
        return id.storeId
    })
    const storeId = findStoreId[0];
    const check = (val) => val === storeId

    const handleCheckout = () => {
        if(findStoreId.every(check)){
            setProceed(true)
            window.location = "/shipping"
        }else{
            setProceed(false)
            
        }
       
    }
    return (
      <div style={{backgroundColor:"#f8f8f8", padding:"2px"}} className="row top">
        <div className="col-2">
          <h3 style={{textAlign:"center"}}>Shopping Basket</h3>
          <Link to="/">
              <Button variant="contained" color="success" size="small">
                Back to homepage
              </Button>
            </Link>
          
          {basketItems.length === 0 ? (
            <MessageBox>
              Basket is empty. <Link to="/">Go Shopping</Link>{" "}
            </MessageBox>
          ) : (
            <ul>
              {basketItems.map((item) => (
                <li key={item.product}>
                  <div className="row">
                    <div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="small"
                      ></img>
                      
                    </div>
                    <div className="min-30">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <p>Store name: {item.storeName}</p>
                      <p>
                        Location: {item.storeCity}, {item.storeCountry}
                      </p>
                      <p>
                        Seller-name: <strong>{item.sellerName}</strong>
                      </p>
                      <p>Delivery: {item.deliveryCapacity }</p>
                      <p><Link to={`/store/${item.storeId}`}>
                        
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                          >
                            View-store
                          </Button>
                        
                      </Link></p>
                    </div>
                    <div>
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToBasket(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>#{item.price}</div>
                    <div>
                      <button
                        className='delete-button'
                        type="button"
                        onClick={() => removeFromBasketHandler(item.product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h3>
                  Subtotal ({basketItems.reduce((a, c) => a + c.qty, 0)} items)
                  : #{basketItems.reduce((a, c) => a + c.price * c.qty, 0)}
                </h3>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="primary block"
                  disabled={basketItems.length === 0}
                >
                  Proceed to checkout
                </button>
              </li>
              <li>
                {!proceed && (         
            <Stack sx={{ width: '90%' }} spacing={2}>
              <Alert sx={{fontSize:"15px"}} severity="error" onClose={() => setProceed(true)}>Sorry, we discourage buying from more than one store/seller at a
              time. You can buy all your items from one store or order them
              seperately. Thanks.</Alert>
            </Stack>
                
          )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}


export default BasketPage
