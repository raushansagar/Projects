import { Router } from "express";
import { upload } from '../middleware/multer.middleware.js';
import { loginUser, logoutUser, registerUser, userData, addProduct, productData, addMenu, placeOrder, getOrder, changeOrderStatus } from '../controllers/user.controlls.js';
import { verifyJWT } from '../middleware/auth.middleware.js';


// make router 
const router = Router();


// register route
router.route("/register").post(
    upload.fields([
        {
            name: "profileImg",
            maxCount: 1,
        }
    ]),
    registerUser
);


// login router
router.route("/login").post(loginUser);


// logout router
router.route("/logout").post(logoutUser)


// user data
router.route("/userData").post(userData);


// add produt
router.route("/product").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    addProduct
);


// get all product 
router.route("/getProduct").post(productData);


// add order placed
router.route("/orderPlaced").post(verifyJWT, placeOrder);


//get all or(der placed
router.route("/getOrderPlaced").post(getOrder);


router.route("/orderStatus").post(changeOrderStatus);



// menu route
router.route("/menu").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    addMenu
);




// export 
export { router };