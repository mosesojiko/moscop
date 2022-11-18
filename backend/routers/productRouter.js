/* eslint-disable no-undef */
const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const productRouter = express.Router();

const Product = require("../models/productModel.js");
const { isAuth } = require("../utils/isAuth.js");
const { isAdmin } = require('../utils/isAdmin.js');

//create a product
productRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
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
      deliveryCapacity
    } = req.body;

    const product = new Product({
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
      user: req.user._id,
    });
    
    const createProduct = await product.save();
    res.json({
      _id: createProduct._id,
      name: createProduct.name,
      category: createProduct.category,
      image: createProduct.image,
      description: createProduct.description,
      countInStock: createProduct.countInStock,
      brand: createProduct.brand,
      free: createProduct.free,
      sameCity: createProduct.sameCity,
      sameState: createProduct.sameState,
      nationWide: createProduct.nationWide,
      sellerName: createProduct.sellerName,
      sellerEmail: createProduct.sellerEmail,
      sellerId: createProduct.sellerId,
      sellerPhone: createProduct.sellerPhone,
      productStoreId: createProduct.productStoreId,
      deliveryCapacity:createProduct.deliveryCapacity,
      storeName,
      storeAddress,
      storeCity,
      storeState,
      storeCountry,
      user: req.user._id,
    });
  })
);





//search for products by name
productRouter.get('/search', expressAsyncHandler(async (req, res) => {
  const searchProduct = await Product.find(
    {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { category: { $regex: req.query.search, $options: "i" } },
      ],
      isPaid:false
      }
  );
  if (searchProduct) {
    res.json(searchProduct)
  }
}))



//get product for update
productRouter.get(
    "/update/:id",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({
          message: `Product with id: ${req.params.id} not found.`,
        });
      }
    })
);

//get product for delete
productRouter.get(
  "/delete/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productToDelete = await Product.findById(req.params.id);
    if (productToDelete) {
      return res.json(productToDelete);
    } else {
      return res.status(404).json({
        message: `Product with id: ${req.params.id} not found.`,
      });
    }
  })
);


//find paid/sold items
productRouter.get('/soldproducts', isAuth, expressAsyncHandler(async(req, res) => {
  const soldItems = await Product.find({user: req.user._id, isPaid:true}).sort({ updatedAt: -1 });
  if(soldItems){
      
      return res.json(soldItems)
    
  }else{
    return res.status(404).json({message: "There are no sold products at the moment"})
  }
}))


//find ordered items
productRouter.get('/orderedproducts', isAuth, expressAsyncHandler(async(req, res) => {
  const orderedItems = await Product.find({user: req.user._id, isOrdered:true, isPaid:false}).sort({ updatedAt: -1 });
  if(orderedItems){
      
      return res.json(orderedItems)
    
  }else{
    return res.status(404).json({message: "There are no ordered products at the moment"})
  }
}))

//get all user products
productRouter.get(
    "/user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userProducts = await Product.find({ user: req.user._id, isPaid:false }).sort({ updatedAt: -1 });
    res.json(userProducts);
  })
);

//get user products for non logged in user
productRouter.get('/nonuser/:id', expressAsyncHandler(async (req, res) => {
  const nonuserProducts = await Product.find({ productStoreId: req.params.id, isPaid:false, isBlocked:false }).sort({ updatedAt: -1 });
  if (nonuserProducts) {
    res.json(nonuserProducts)
  }
}))



//get all products
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({isPosted: true, isPaid:false}).sort({ updatedAt: -1 });
    res.json(products);
  })
);



//get all products for admin
productRouter.get(
  "/admin", isAuth, isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ updatedAt: -1 });
    if (products) {
      res.json(products);
   }
  })
);

//get single product or product details
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const singleProduct = await Product.findById(req.params.id);
    if (singleProduct) {
      return res.json(singleProduct);
    } else {
      return res.status(404).json({
        message: `Product with id: ${req.params.id} not found.`,
      });
    }
  })
);

//update a product
productRouter.put(
  "/update",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.body.id);
    if (product) {
      (product.name = req.body.name || product.name),
      (product.price = req.body.price || product.price),
        (product.category = req.body.category || product.category),
        (product.image = req.body.image || product.image),
        (product.description = req.body.description || product.description),
        (product.countInStock = req.body.countInStock || product.countInStock),
        (product.brand = req.body.brand || product.brand),
        (product.free = req.body.free || product.free),
        (product.sameCity = req.body.sameCity || product.sameCity),
        (product.sameState = req.body.sameState || product.sameState),
        (product.nationWide = req.body.nationWide || product.nationWide),
        (product.sellerName = req.body.sellerName || product.sellerName),
        (product.sellerEmail = req.body.sellerEmail || product.sellerEmail),
        (product.sellerId = req.body.sellerId || product.sellerId),
        (product.sellerPhone = req.body.sellerPhone || product.sellerPhone),
        (product.productStoreId = req.body.productStoreId || product.productStoreId),
        (product.storeName = req.body.storeName || product.storeName),
        (product.storeAddress = req.body.storeAddress || product.storeAddress),
        (product.storeCity = req.body.storeCity || product.storeCity),
        (product.storeState = req.body.storeState || product.storeState),
        (product.storeCountry = req.body.storeCountry || product.storeCountry),
        (product.deliveryCapacity = req.body.deliveryCapacity || product.deliveryCapacity),
        (user = req.user._id);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  })
);

productRouter.delete('/delete/:id', isAuth, (req, res) =>{
  Product.findByIdAndDelete(req.params.id)
  .then(data =>{
      if(!data){
          res.status(404).json({message: `Cannot delete product with id: ${id}, maybe id is wrong.`})
      }else{
          res.send("Product was deleted successfully.")
      }
  })
  .catch(err =>{
      res.status(500).json({
          message: err.message || `Could not delete product with id ${id}.`
      })
  })
})


//update a product to be posted
productRouter.put('/postproduct', isAuth, expressAsyncHandler( async(req,res) =>{
  const product = await Product.findById(req.body.id);
  if(product){
      product.isPosted = true;
  }
  const postedProduct = await product.save();
      res.json(postedProduct)
}))

//update a product to be unposted
productRouter.put('/unpostproduct', isAuth, expressAsyncHandler( async(req,res) =>{
  const product = await Product.findById(req.body.id);
  if(product){
      product.isPosted = false;
  }
  const unPostedProduct = await product.save();
      res.json(unPostedProduct)
}))

//update a product when it is ordered
productRouter.put('/placeorder', expressAsyncHandler( async(req, res) => {
  const product = await Product.findById(req.body.id);
  if(product) {
    product.isOrdered = true;
    product.buyerName = req.body.buyerName;
    product.buyerPhone = req.body.buyerPhone;
    product.buyerAddress = req.body.buyerAddress;
    product.buyerId = req.body.buyerId;
  }
  const orderedProduct = await product.save();
  res.json(orderedProduct);
}))

//update a product when it is paid for
productRouter.put('/paidproducts', expressAsyncHandler( async(req, res) => {
  const product = await Product.findById(req.body.id);
  if(product) {
    product.isPaid = true;
    product.isPosted = false;
    product.isPaidAt = Date.now()
    product.buyerEmail = req.body.buyerEmail
    product.orderId = req.body.orderId
    product.deliveryCost = req.body.deliveryCost;
    product.service = req.body.service;
  }
  const paidProduct = await product.save();
  res.json(paidProduct);
}))

//update a product when it is delivered
productRouter.put('/isdelivered', expressAsyncHandler( async(req, res) => {
  const product = await Product.findById(req.body.id);
  if(product) {
    product.isDelivered = true;
    product.isDeliveredAt = Date.now()
  }
  const deliveredProduct = await product.save();
  res.json(deliveredProduct);
}))

//update a product when it is settled
productRouter.put('/issettled', expressAsyncHandler( async(req, res) => {
  const product = await Product.findById(req.body.id);
  if(product) {
    product.isSettled = true;
    product.isSettledAt = Date.now()
  }
  const settledProduct = await product.save();
  res.json(settledProduct);
}))


//block all user's products
productRouter.put('/banned', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({user:req.body.id});
    if (product) {
        product.isBanned = true
    }
    const bannedProduct = await product.save()
    res.json(bannedProduct)
}))


//unblock all user's products
productRouter.put('/unbanned', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({user:req.body.id});
    if (product) {
        product.isBanned = false
    }
    const bannedProduct = await product.save()
    res.json(bannedProduct)
}))


//block a product
productRouter.put('/block', isAuth, isAdmin, expressAsyncHandler( async(req,res) =>{
  const product = await Product.findById(req.body.id);
  if(product){
      product.isBlocked = true;
  }
  const blockedProduct = await product.save();
      res.json(blockedProduct)
}))

//unblock a product
productRouter.put('/unblock', isAuth, isAdmin, expressAsyncHandler( async(req,res) =>{
  const product = await Product.findById(req.body.id);
  if(product){
      product.isBlocked = false;
  }
  const unblockedProduct = await product.save();
      res.json(unblockedProduct)
}))


module.exports = productRouter;
