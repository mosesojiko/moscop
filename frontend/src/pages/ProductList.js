import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DetailsIcon from '@mui/icons-material/Details';
import PreviewIcon from '@mui/icons-material/Preview';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { blockProduct, unblockProduct } from '../actions/productActions';
import { useDispatch } from "react-redux";


function ProductList() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [searchError, setSearchError] = useState(false)
  const [notFound, setNotFound] = useState(false);
  const [emptySearch, setEmptySearch] = useState(false)


     //get access to userLogin from redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
    
    if (!userInfo.isAdmin) {
        window.location="/"
  }
  const dispatch = useDispatch();
  
  
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
            const { data } = await axios.get('/api/v1/product/admin', {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            })
            setLoading(false)
            setProducts(data)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchProducts()
    },[userInfo.isAdmin])

    //console.log(products)
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
//console.log(searchResult)
  
  //get block product from redux store
  const blockaproduct = useSelector((state) => state.blockaproduct);
  const {
    loadblock, successblock, errorblock
  } = blockaproduct


  //get unblock product from redux store
  const unblockaproduct = useSelector((state) => state.unblockaproduct);
  const {
    loadunblock, successunblock, errorunblock
  } = unblockaproduct

//refresh the page
  if (successblock || errorblock || successunblock || errorunblock) {
    setTimeout(() => {
      window.location ="/productlist"
    }, 2000);
  }

    return (
        <div style={{backgroundColor:"#f5f5f5"}}>
            <h3 style={{ textAlign: "center" }}>List of products</h3>
            
            <form className='mosganda-header-search' onSubmit={handleSearch}>
              <input type="text" id="search" className='mosganda-search-input' placeholder=' Item name'
               value={search}
              onChange={(e) => setSearch(e.target.value)}
              
            />
            
              <button className='mosganda-header-searchIconContainer' type = "submit"><SearchIcon /></button>
              
        </form>
        
        <div className='row center'>
          {searchLoading && <LoadingBox></LoadingBox>}
          {searchError && <MessageBox variant="danger">Failed to load search</MessageBox>}
          {loadblock && <LoadingBox></LoadingBox>}
          {errorblock && <MessageBox variant="danger">Failed to block product.</MessageBox>}
          {successblock && <MessageBox variant="success">Successfully blocked product.</MessageBox>}

          {loadunblock && <LoadingBox></LoadingBox>}
          {errorunblock && <MessageBox variant="danger">Failed to unblock product.</MessageBox>}
          {successunblock && <MessageBox variant="success">Successfully unblocked product.</MessageBox>}
           
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
        </div>

        <div className='row center'>
          {
            searchResult?.map((product) => (
              <div key={product._id} className="card product">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h4 style={{ textAlign: "center" }}>{product.name}</h4>
         
        </Link>
        <div className="card-body-items">
            <h4>#{product.price}</h4>
          
            <p>{product.storeCity}</p>
          
        </div>
        <div className="card-body-span">
          
          <span>
            <Link to={`/product/${product._id}`}>
              <Button variant="contained" color="success" size="small">
                <span className="card-body-span-items">
                   <DetailsIcon />
                  <span>Detail</span>
                </span>
              </Button>
            </Link>
          </span>
          
              <span>
              <Link to={`/store/${product.productStoreId}`}>
                  <Button variant="contained" color="success" size="small">
                    <span className="card-body-span-items">
                   <PreviewIcon />
                  <span>Store</span>
                </span>
                </Button>
              </Link>
                    </span>
                    <span>
                      
              {product.isBlocked ? (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() =>
                          dispatch(unblockProduct({ id: product._id }))
                        }
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          dispatch(blockProduct({ id: product._id }))
                        }
                        >
                        Block
                      </Button>
                    )}
              </span>
        
                  </div>
           </div>
    </div>
            ))
          }

         
        </div>


        <div className="row center">
          {loading && <LoadingBox></LoadingBox>}
          {error && <MessageBox variant="danger">Failed to load products</MessageBox>}
            {/* {products?.map((product) => (
              <Product key={product._id} product={product} showStoreButton={true}></Product>
            ))} */}
          {
            products?.map((product) => (
              <div key={product._id} className="card product">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h4 style={{ textAlign: "center" }}>{product.name}</h4>
         
        </Link>
        <div className="card-body-items">
            <h4>#{product.price}</h4>
          
            <p>{product.storeCity}</p>
          
        </div>
        <div className="card-body-span">
          
          <span>
            <Link to={`/product/${product._id}`}>
              <Button variant="contained" color="success" size="small">
                <span className="card-body-span-items">
                   <DetailsIcon />
                  <span>Detail</span>
                </span>
              </Button>
            </Link>
          </span>
          
              <span>
              <Link to={`/store/${product.productStoreId}`}>
                  <Button variant="contained" color="success" size="small">
                    <span className="card-body-span-items">
                   <PreviewIcon />
                  <span>Store</span>
                </span>
                </Button>
              </Link>
                    </span>
                    <span>
                      
              {product.isBlocked ? (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() =>
                          dispatch(unblockProduct({ id: product._id }))
                        }
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          dispatch(blockProduct({ id: product._id }))
                        }
                        >
                        Block
                      </Button>
                    )}
              </span>
        
                  </div>
           </div>
    </div>
            ))
          }
          </div>
        </div>
    )
}

export default ProductList
