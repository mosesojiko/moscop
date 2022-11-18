import Axios from 'axios';
import { 
    ADD_TO_BASKET, 
    BASKET_SAVE_PAYMENT_METHOD, 
    BASKET_SAVE_SHIPPING_ADDRESS, 
    REMOVE_FROM_BASKET } from '../constants/basketConstants';


export const addToBasket = (id, qty) => async(dispatch, getState) => {
    //send axios request to get information of this product
    //chnaged productId parameter to id
    const { data } = await Axios.get(`/api/v1/product/${id}`)
    dispatch({
        type: ADD_TO_BASKET,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id,
            qty,
            free: data.free,
            sameCity: data.sameCity,
            sameState: data.sameState,
            nationWide: data.nationWide,
            sellerName: data.sellerName,
            sellerEmail: data.sellerEmail,
            sellerPhone: data.sellerPhone,
            storeId: data.productStoreId,
            storeName: data.storeName,
            storeAddress: data.storeAddress,
            storeCity: data.storeCity,
            storeState: data.storeState,
            storeCountry: data.storeCountry,
            deliveryCapacity: data.deliveryCapacity,
            service: data.service
        },
    });
    localStorage.setItem('basketItems', JSON.stringify(getState().basket.basketItems));
}

//function to remove form basket
export const removeFromBasket = (productId) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_BASKET,
        payload: productId
    })
    localStorage.setItem('basketItems', JSON.stringify(getState().basket.basketItems))
}

// function to saveShippingAddress
export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: BASKET_SAVE_SHIPPING_ADDRESS,
        payload: data
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

//Payment method
export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: BASKET_SAVE_PAYMENT_METHOD,
        payload: data
    })
} 
