import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSoldProducts } from '../actions/productActions';
import { createWithdraw } from '../actions/withdrawActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { CREATE_WITHDRAW_RESET } from '../constants/withdrawConstants';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './SoldProducts.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function SoldProducts(props) {

    const [ accountName, setAccountName ] = useState('')
    const [accountNumber, setAccountNumber ] = useState(0)
    const [ bank, setBank ] = useState('')
    const [ amount, setAmount ] = useState(0)
    const [ email, setEmail ] = useState('')
  const [phone, setPhone] = useState('')
  const [productId, setProductId] = useState('')
  const [amountToPay, setAmountToPay] = useState(0)
  const [serviceCharge, setServiceCharge] = useState(0)
  const [deliveryCost, setDeliveryCost ] = useState(0)
//console.log(productId)

   
  //get login user details from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
 

  //get sold products from redux store
  const productSold = useSelector((state) => state.productSold);
  const { loading, error, soldProducts } = productSold
  //console.log(soldProducts);

  //get widthdrawal from redux store
  const withdrawal = useSelector((state) => state.withdrawal);
  const { loading: loadDraw, error: errorDraw, success } = withdrawal

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

const dispatch = useDispatch();


useEffect(() =>{
    dispatch(getSoldProducts())
},[dispatch])

  const handleWithdraw = () => {
      dispatch(createWithdraw(accountName, accountNumber, bank, amount, deliveryCost, email, phone, productId));
      dispatch({type: CREATE_WITHDRAW_RESET})
  }

  if (success) {
    setTimeout(() => {
      window.location='/soldproducts'
    },3000)
  }
  
    return (
      <div style={{width:"100%",maxWidth:"100%", backgroundColor:"white"}}>
        
          <h3 className='sold-item-header'>Sold Items and Withdrawal</h3>
          <div className='withdrawal-information'>
            
              <h4>Withdrawal steps</h4>
            <ul>
              <li>Get the buyer information from the item displayed in this page.</li>
                <li>Get the item/product delivered to the buyer.</li>
                <li>Click on the "Withdraw" button, fill in your account details in the popup and click submit.</li>
              <li>Get paid within 12 hours.</li>
             </ul>
            <p className='withdrawal-notice'>Note that within this 12 hours, we are going to confirm if the buyer has received the item. So make sure you have successfully sent the item before clicking on "Withdraw" button.</p>
            <p className='withdrawal-notice'>Also note that we will deduct our 3% charge from the selling price. For example, if you sell an item that cost #1000, our 3% charge is #30. So you will receive #970. If the amount you charge for the delivery of the item is #300 for example. Then, what you will receive is #970 + #300, which is #1,270</p>
            </div>
          
              
            <h3 style={{ textAlign: "center" }}>Sold Items</h3>
         
          
        <div>
          
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
                <h3 style={{textAlign:"center"}}>Withdrawal Form</h3>
              </Typography>
              <Box sx={{fontSize:'15px'}}>
                You will recieve #{amountToPay - serviceCharge}
              </Box>
              <form>
                <Box sx={{mt: 3}}>
                  <label htmlFor='accountName'>Account Name</label>
                  <input style={{marginLeft:"3px"}} type="text" id="accountName" placeholder='Account Name' required
                    onChange ={(e) =>setAccountName(e.target.value)}
                  />
                </Box>
                <Box sx={{mt:2}}>
                  <label htmlFor='accountNumber'>Account Number</label>
                  <input style={{marginLeft:"3px"}} type="text" id="accountNumber" placeholder='Account Number' required
                    onChange ={(e) =>setAccountNumber(e.target.value)}
                  />
                </Box>
                <Box sx={{mt:2}}>
                  <label htmlFor='bank'>Bank</label>
                  <input style={{marginLeft:"3px"}} type="text" id="bank" placeholder='Bank Name' required
                    onChange ={(e) =>setBank(e.target.value)}
                  />
                </Box>
                {
                  loadDraw && <LoadingBox></LoadingBox>
                }
                {
                  errorDraw && <MessageBox variant="danger">Failed</MessageBox>
                }
                {
                  success && <MessageBox variant="success">successful</MessageBox>
                }
                <Button sx={{textAlign:"center",m:2}} onClick ={handleWithdraw} variant="contained" color="success">Submit</Button>
              </form>
          <Button sx={{textAlign:"center",m:2}} onClick ={handleClose} variant="contained" color="error">Close</Button>
        </Box>
      </Modal>
        </div>

        <div className='row center'>
          {
            soldProducts && soldProducts.length === 0 ? (<p style={{ backgroundColor: "#f5f5f5", textAlign: "center", height: "50px", padding: "20px" }}>There are no sold items at the moment.</p>)
              : ""
          }

          {
          loading && <LoadingBox></LoadingBox>
          }
          {
          error && <MessageBox variant="danger">Error</MessageBox>
          }
          
          {
            soldProducts?.map((product) => (
              <div className='card' key={product._id}>
                <div style={{padding:"5px"}}>
                  <div>
                    <h4 style={{textAlign:"center"}}>Product Information</h4>
                    <p className='soldproduct-item'>Id: {product._id}</p>
                    <p className='soldproduct-item' style={{display:"flex"}}><img
                        className="small"
                        src={product.image}
                        alt={product.name}
                /><Button sx={{m:1}} variant="contained" size="small"
                          onClick={() => { props.history.push(`/product/${product._id}`) }}>
                          View product
                      </Button></p>
                    <p className='soldproduct-item'>
                      <span style={{marginRight:"5px"}}>Name: {product.name}</span>
                    </p>
                    <p className='soldproduct-item' style={{display:"flex"}}>
                      <span>Price: #{product.price},</span> { " " }
                      <span style={{marginLeft:"5px"}}>Delivery: #{ product.deliveryCost}</span>
                    </p>
                  </div>
                  <div>
                    <h4 style={{textAlign:"center"}}>Buyer Information</h4>
                    <p className='soldproduct-item'>Name: <b>{product.buyerName}</b>, Phone: <b>{product.buyerPhone}</b> </p>
                    <p className='soldproduct-item'>Address: { product.buyerAddress }</p>
                  </div>
                  <div>
                    <h4 style={{textAlign:"center"}}>Product Status</h4>
                    <p className='soldproduct-item'>Payment: {product.isPaid ? "Paid at" : "No"}  { product.isPaid
                              ? product.isPaidAt.substring(0, 10)
                      : ""}</p>
                    <p className='soldproduct-item'>Delivery: {product.isDelivererd ? "Delivered at" : "No"}  { product.isDelivererd
                              ? product.isDeliveredAt.substring(0, 10)
                      : ""} </p>
                    <p className='soldproduct-item'>Paid by Mosganda: {product.isSettled ? "Paid at" : "Pending"}  { product.isSettled
                              ? product.isSettledAt.substring(0, 10)
                        : ""} </p>
                  </div>
                  <div>
                    {
                !product.isSettled &&
                 <Button sx={{ m: 2 }} variant="contained" size="large" onClick={() => {
                  setAmount(product.price)
                  setServiceCharge(product.price * 0.03)
                  setDeliveryCost(product.deliveryCost)
                  setAmountToPay(product.price + product.deliveryCost) 
                  setProductId(product._id)
                  setEmail(userInfo.email)
                  setPhone(userInfo.phone)
                  handleOpen()
                }}>Withdraw</Button>
               }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        
      </div>
    );
}

export default SoldProducts
