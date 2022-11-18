import React, {  useEffect, useState } from 'react'

import Product from '../components/Product';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../actions/productActions';
import { Link } from 'react-router-dom';
//import Button from "@mui/material/Button";
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';


//import StorefrontIcon from '@mui/icons-material/Storefront';
//import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
//import QuizIcon from '@mui/icons-material/Quiz';
//import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';



function HomePage() {
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [searchError, setSearchError] = useState(false)
  const [notFound, setNotFound] = useState(false);
  const [emptySearch, setEmptySearch] = useState(false)

  const [category, setCategory] = useState('')
  const [categoryResult, setCategoryResult] = useState([])
  const [emptyCategory, setEmptyCategory] = useState('')
  const [loadingCategory, setLoadingCategory] = useState('')
  const [errorCategory, setErrorCategory] = useState('')
  const [notFoundCategory, setNotFoundCategory] = useState('')
 const [men, setMen] = useState(false)


  const dispatch = useDispatch();
  const getProducts = useSelector(state => state.getProducts)
  const { loading, error, products } = getProducts;
  console.log(products)
  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])
 
  //handleSearch function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      setEmptySearch(true);
      return
    }
    try {
      setSearchLoading(true)
      const { data } = await axios.get(`/api/v1/product/search?search=${search}`)
      setSearchLoading(false)
      setSearchResult(data)
      if (data.length === 0) {
        setNotFound(true)
      }
      setSearch("")
    } catch (error) {
      setSearchError(true)
      setSearchLoading(false)
    }
    
  }

  //search products by category
  const handleCategory = async (e) => {
    e.preventDefault()

    if (!category || category === '') {
      setEmptyCategory(true)
      return
    }

    try {
      setLoadingCategory(true)
      const { data } = await axios.get(`/api/v1/product/search?search=${category}`)
      setLoadingCategory(false)
      setCategoryResult(data)
      if (data.length === 0) {
        setNotFoundCategory(true)
      }
      setCategory('')
    } catch (error) {
      setErrorCategory(true)
      setLoadingCategory(false)
    }
  }

      return (
      <div>
        <div className='homepage-header'>
          
            <form className='mosganda-header-search' onSubmit={handleSearch}>
              <input type="text" id="search" className='mosganda-search-input' placeholder=' Item name'
               value={search}
              onChange={(e) => setSearch(e.target.value)}
              
            />
            
              <button className='mosganda-header-searchIconContainer' type = "submit"><SearchIcon /></button>
              
            </form>
          


          
            <form className='homepage-header-category' onSubmit={handleCategory}>
              <label htmlFor="category"></label>
              <select id="category" className='category' value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value=""> Category</option>
              <option value="men">Men's fashion</option>
              <option value="women">Women's fashion</option>
               <option value="phone">Phone and Accessories</option>
                <option value="computing">Computing</option>
                <option value="health">Health and Beauty</option>
                <option value="baby">Baby Products</option>
                <option value="furniture">Furniture</option>
                <option value="automobile">Automobile</option>
                <option value="gaming">Gaming</option>
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
                <option value="household">Household equipment</option>
                <option value="groceries">Groceries</option>
                <option value="pharmacy">Pharmacy (drugs)</option>
                <option value="others">Others</option>
               </select>
               <button type="submit" className='category-button'><SearchIcon sx={{fontSize:"18px"}} /></button>
               </form>
          
        </div>



          


       
          
          <div style={{margin:"5px"}}>
            
            {
              notFoundCategory && <Stack sx={{ width: '90%' }} spacing={2}>
              <Alert severity="success" onClose={() => setNotFoundCategory(false)}>Items Not Found.</Alert>
      
            </Stack>
              }
              {
              emptyCategory && <Stack sx={{ width: '90%' }} spacing={2}>
              <Alert severity="warning" onClose={() => setEmptyCategory(false)}>Please, select a category.</Alert>
      
            </Stack>
                }
          </div>
          <p style={{backgroundColor:"white", padding:"10px", margin:"0px"}}>Confused?  <Link to ="/guide" style={{color:"blue"}}>Take our step by step guide.</Link></p>
            
       

        <div style={{ marginBottom: "10px", borderBottom:`${searchResult.length>0?"2px solid #023c3f":""}`}} className="row center">
          {searchLoading && <LoadingBox></LoadingBox>}
          {searchError && <MessageBox variant="danger">Failed to load search</MessageBox>}
          {
              notFound && <Stack sx={{ width: '90%' }} spacing={2}>
              <Alert severity="success" onClose={() => setNotFound(false)}>Item Not Found</Alert>
      
            </Stack>
              }
              {
              emptySearch && <Stack sx={{ width: '90%' }} spacing={2}>
              <Alert severity="warning" onClose={() => setEmptySearch(false)}>Search cannot be empty.</Alert>
      
            </Stack>
                }
            {searchResult?.map((product) => (
             !product.isBanned && <Product key={product._id} product={product} showStoreButton={true}></Product>
            ))}
          
        </div>
        

        <div style={{ marginBottom: "10px", borderBottom:`${categoryResult.length>0?"2px solid #023c3f":""}`}} className="row center">
          {loadingCategory && <LoadingBox></LoadingBox>}
          {errorCategory && <MessageBox variant="danger">Failed to load category</MessageBox>}
            {categoryResult?.map((product) => (
             !product.isBanned && <Product key={product._id} product={product} showStoreButton={true}></Product>
            ))}
        </div>

        
          {
            categoryResult.length < 1 &&
            <div className="row center" style={{backgroundColor:"#f5f5f5"}}>
          {loading && <LoadingBox></LoadingBox>}
          {error && <MessageBox variant="danger">Failed to load products</MessageBox>}
            {products?.map((product) => (
              !product.isBanned && <Product key={product._id} product={product} showStoreButton={true}></Product>
            ))}
          </div>
          }
          
          <div style={{marginTop:"30px"}} className='mosganda-description-in-homepage'>
            <h5>Mosganda Online Marketplace</h5>
            <p>Mosganda is an online platform for buying and selling goods and services. For sellers, create your online store and make 24/7 sales. It is very easy to sell on Mosganda - register and log in, create your online store by filling your store information, add items to your store and post them for sale. For buyers, click on the item you want to buy, and the system will lead you to pay for it. <Link to="/guide" style={{color:"blue"}}>Learn more about Mosganda and how to use this website here.</Link> </p>
          </div>
        
      </div>
    );
}

export default HomePage
