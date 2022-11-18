//product actions
import Axios from "axios";
import {
  CREATE_PRODUCT_FAIL,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  LIST_OF_PRODUCTS_FAIL,
  LIST_OF_PRODUCTS_REQUEST,
  LIST_OF_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  USER_PRODUCTS_REQUEST,
  USER_PRODUCTS_SUCCESS,
  USER_PRODUCTS_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  GET_PRODUCT_FOR_UPDATE_REQUEST,
  GET_PRODUCT_FOR_UPDATE_FAIL,
  GET_PRODUCT_FOR_UPDATE_SUCCESS,
  POST_PRODUCT_REQUEST,
  POST_PRODUCT_SUCCESS,
  POST_PRODUCT_FAIL,
  UNPOST_PRODUCT_REQUEST,
  UNPOST_PRODUCT_SUCCESS,
  UNPOST_PRODUCT_FAIL,
  UPDATE_ORDERED_PRODUCT_REQUEST,
  UPDATE_ORDERED_PRODUCT_SUCCESS,
  UPDATE_ORDERED_PRODUCT_FAIL,
  ORDERED_PRODUCTS_REQUEST,
  ORDERED_PRODUCTS_SUCCESS,
  ORDERED_PRODUCTS_FAIL,
  UPDATE_PAID_PRODUCTS_REQUEST,
  UPDATE_PAID_PRODUCTS_SUCCESS,
  UPDATE_PAID_PRODUCTS_FAIL,
  SOLD_PRODUCTS_REQUEST,
  SOLD_PRODUCTS_SUCCESS,
  SOLD_PRODUCTS_FAIL,
  BLOCK_PRODUCT_REQUEST,
  BLOCK_PRODUCT_SUCCESS,
  BLOCK_PRODUCT_FAIL,
  UNBLOCK_PRODUCT_REQUEST,
  UNBLOCK_PRODUCT_SUCCESS,
  UNBLOCK_PRODUCT_FAIL,
} from "../constants/productConstants";

//create a product
export const createProduct =
  (
    name,
    price,
    category,
    image,
    countInStock,
    brand,
    description,
    free,
    sameCity,
    sameState,
    nationWide,
    sellerName,
    sellerEmail,
    sellerId,
    sellerPhone,
    productStoreId,
    storeName,
    storeAddress,
    storeCity,
    storeState,
    storeCountry,
    deliveryCapacity,
    user
  ) =>
  async (dispatch, getState) => {
    dispatch({
      type: CREATE_PRODUCT_REQUEST,
      payload: {
        name,
        price,
        category,
        image,
        countInStock,
        brand,
        description,
        free,
        sameCity,
        sameState,
        nationWide,
        sellerName,
        sellerEmail,
        sellerPhone,
        sellerId,
        productStoreId,
        storeName,
        storeAddress,
        storeCity,
        storeState,
        storeCountry,
        deliveryCapacity,
        user,
      },
    });
    try {
      //get userInfo
      const {
        userLogin: { userInfo },
      } = getState();
      const { data } = await Axios.post(
        "/api/v1/product/create",
        {
          name,
          price,
          category,
          image,
          countInStock,
          brand,
          description,
          free,
          sameCity,
          sameState,
          nationWide,
          sellerName,
          sellerEmail,
          sellerId,
          sellerPhone,
          productStoreId,
          storeName,
          storeAddress,
          storeCity,
          storeState,
          storeCountry,
          deliveryCapacity,
          user,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: CREATE_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_PRODUCT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

//define actions, get all products
export const getAllProducts = () => async (dispatch) => {
  dispatch({
    type: LIST_OF_PRODUCTS_REQUEST,
  });
  //fetching data from backend
  try {
    const { data } = await Axios.get("/api/v1/product");
    dispatch({
      type: LIST_OF_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_OF_PRODUCTS_FAIL,
      payload: error.message,
    });
  }
};

//get details of a product
export const getProductDetails = (productId) => async (dispatch) => {
  dispatch({
    type: PRODUCT_DETAILS_REQUEST,
    payload: productId,
  });
  try {
    const { data } = await Axios.get(`/api/v1/product/${productId}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//get user products
export const getUserProducts = () => async (dispatch, getState) => {
  dispatch({
    type: USER_PRODUCTS_REQUEST,
  });
  //get userInfo
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/v1/product/user", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: USER_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//Find user product for update
export const findProductForUpdate = (id) => async (dispatch, getState) => {
  dispatch({
    type: GET_PRODUCT_FOR_UPDATE_REQUEST,
    payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
    const { data } = await Axios.get(`/api/v1/product/update/${id}`, {
      headers: {
          Authorization: `Bearer ${userInfo.token}`
      },
  })
  dispatch({
      type: GET_PRODUCT_FOR_UPDATE_SUCCESS,
      payload: data
  })
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_FOR_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}

//action to update user product
export const updateUserProduct = (id) => async (dispatch, getState) =>{
  dispatch({
      type: UPDATE_PRODUCT_REQUEST,
      payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
      const { data } = await Axios.put(`/api/v1/product/update/`,id, {
          headers: {
              Authorization: `Bearer ${userInfo.token}`
          },
      })
      dispatch({
          type: UPDATE_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: UPDATE_PRODUCT_FAIL, payload: message})
  }
}


//edit a product to be posted to product page
export const editPostedProduct = (id) => async(dispatch, getState) => {
  dispatch({
      type: POST_PRODUCT_REQUEST,
      payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
      const { data } = await Axios.put(`/api/v1/product/postproduct`, id, {
          headers: {
              Authorization: `Bearer ${userInfo.token}`
          },
      })
      dispatch({
          type: POST_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: POST_PRODUCT_FAIL, payload: message})
  }
}

//edit a product to be unposted or removed from product page
export const unPostedProduct = (id) => async(dispatch, getState) => {
  dispatch({
      type: UNPOST_PRODUCT_REQUEST,
      payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
      const { data } = await Axios.put(`/api/v1/product/unpostproduct`, id, {
          headers: {
              Authorization: `Bearer ${userInfo.token}`
          },
      })
      dispatch({
          type: UNPOST_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: UNPOST_PRODUCT_FAIL, payload: message})
  }
}


//update ordered products
export const orderedProduct = (id) => async(dispatch) => {
  dispatch({
      type: UPDATE_ORDERED_PRODUCT_REQUEST,
      payload: id
  })
  
  try {
      const { data } = await Axios.put(`/api/v1/product/placeorder`, id)
      dispatch({
          type: UPDATE_ORDERED_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: UPDATE_ORDERED_PRODUCT_FAIL, payload: message})
  }
}


//get ordered products
export const getOrderedProducts = () => async (dispatch, getState) => {
  dispatch({
    type: ORDERED_PRODUCTS_REQUEST,
  });
  //get userInfo
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/v1/product/orderedproducts", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: ORDERED_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDERED_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}


//update paid products
export const paidProduct = (id) => async(dispatch) => {
  dispatch({
      type: UPDATE_PAID_PRODUCTS_REQUEST,
      payload: id
  })
  
  try {
      const { data } = await Axios.put(`/api/v1/product/paidproducts`, id)
      dispatch({
          type: UPDATE_PAID_PRODUCTS_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: UPDATE_PAID_PRODUCTS_FAIL, payload: message})
  }
}



//get ordered products
export const getSoldProducts = () => async (dispatch, getState) => {
  dispatch({
    type: SOLD_PRODUCTS_REQUEST,
  });
  //get userInfo
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/v1/product/soldproducts", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: SOLD_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SOLD_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}


//block a product
export const blockProduct = (id) => async(dispatch, getState) => {
  dispatch({
      type: BLOCK_PRODUCT_REQUEST,
      payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
      const { data } = await Axios.put(`/api/v1/product/block`, id, {
          headers: {
              Authorization: `Bearer ${userInfo.token}`
          },
      })
      dispatch({
          type: BLOCK_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: BLOCK_PRODUCT_FAIL, payload: message})
  }
}



//unblock a product
export const unblockProduct = (id) => async(dispatch, getState) => {
  dispatch({
      type: UNBLOCK_PRODUCT_REQUEST,
      payload: id
  })
  //get user info
  const { userLogin: {userInfo} } = getState();
  try {
      const { data } = await Axios.put(`/api/v1/product/unblock`, id, {
          headers: {
              Authorization: `Bearer ${userInfo.token}`
          },
      })
      dispatch({
          type: UNBLOCK_PRODUCT_SUCCESS,
          payload: data
      })
      
  } catch (error) {
      const message = error.response && error.response.data.message?
      error.response.data.message : error.message;
      dispatch({type: UNBLOCK_PRODUCT_FAIL, payload: message})
  }
}