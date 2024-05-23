const express = require("express");
const router = express.Router();


router.use("/",require("./api/auth/home"));
router.use("/",require("./api/auth/login"));
router.use("/",require("./api/auth/logout"));
router.use("/",require("./api/auth/register"));
router.use("/",require("./api/products/fetchProduct"));
router.use("/",require("./api/products/fetchProductDetails"));
router.use("/",require("./api/products/searchProducts"));
router.use("/",require("./api/products/updateProduct"));
router.use("/",require("./api/products/deleteProduct"));
router.use("/",require("./api/bag/fetchBag"));
router.use("/",require("./api/bag/updateBag"));
router.use("/",require("./api/bag/removeFromBag"));
router.use("/",require("./api/wishlist/addToWishlist"));
router.use("/",require("./api/wishlist/fetchWishlist"));
router.use("/",require("./api/wishlist/removeFromWishlist"));
router.use("/",require("./api/order/fetchAllOrders"));
router.use("/",require("./api/order/fetchOrder"));
router.use("/",require("./api/order/orderNow"));
router.use("/",require("./api/order/cancelOrder"));
router.use("/",require("./api/auth/forgetPassword/sendOTP"));
router.use("/",require("./api/auth/forgetPassword/updatePassword"));
router.use("/",require("./api/auth/forgetPassword/verifyOTP"));
router.use("/",require("./api/admin/fetchUsersProductsCount"));
router.use("/",require("./api/admin/fetchRevenueTransaction"));
router.use("/",require("./api/admin/fetchReview"));
router.use("/",require("./api/admin/AddNewCoupon"));

router.use("/",require("./api/admin/saveProduct"));
router.use("/",require("./api/admin/uploadImage"));
router.use("/",require("./api/products/updateProductAvailability"));
router.use("/",require("./api/user/fetchUsers"));
router.use("/",require("./api/user/updateUserRole"));
router.use("/",require("./api/user/deleteUser"));
router.use("/",require("./api/user/addAddress"));
router.use("/",require("./api/user/fetchAddress"));

router.use("/",require("./api/reserveTable/fetchReserveTables"));
router.use("/",require("./api/reserveTable/bookTable"));
router.use("/",require("./api/reserveTable/cancelReservation"));
router.use("/",require("./api/reserveTable/tableAvailable"));

router.use("/",require("./gateway/create-food-order-session"));
router.use("/",require("./gateway/create-seat-reservation-session"));

module.exports = router;