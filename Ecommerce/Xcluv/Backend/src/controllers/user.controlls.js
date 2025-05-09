
import { asyncHandler } from '../utils/asyncHandler.js';
import { User, Product, Menu, Order } from "../models/user.model.js";
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCoudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';




//generate referesh and access token
const generateRefereshAndAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        //save
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refereshToken and Access Tokens");
    }
}


// user register
const registerUser = asyncHandler(async (req, res) => {

    const { fullName, userName, email, password } = req.body;

    if (
        [fullName, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const exitedUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { userName: userName.toLowerCase() }]
    });


    if (exitedUser) {
        throw new ApiError(401, "Email or Username already exists");
    }

    const profileImgLocalPath = req.files?.profileImg?.[0]?.path;
    const profileImg = await uploadOnCoudinary(profileImgLocalPath);

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email: email.toLowerCase(),
        password,
        profileImg: profileImg?.url || "",
    });

    const checkUser = await User.findById(user._id).select("-password -refreshToken");

    if (!checkUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(200).json(
        new ApiResponse(200, checkUser, "User Registered Successfully")
    );
})



// login user 
const loginUser = asyncHandler(async (req, res) => {

    // input user
    const { userName, email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "All fields are required")
    }

    // check email
    const user = await User.findOne({
        $or: [{ email }]
    })

    if (!user) {
        throw new ApiError(402, "Invalid email")
    }

    //check password
    const checkPassword = await user.isPasswordCorrect(password);

    if (!checkPassword) {
        throw new ApiError(403, "Password not match");
    }

    // generate refreshToken and accessToken
    const { accessToken, refreshToken } = await generateRefereshAndAccessTokens(user._id)

    // send cookie
    const loginUser = await User.findById(user._id).select("-password -refreshToken");


    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("User login");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken,
                    user: loginUser
                },
                "User Login Successfully"
            )
        )
})




//logout user
const logoutUser = asyncHandler(async (req, res) => {

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")?.trim();

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodeInfoToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const newUser = await User.findById(decodeInfoToken?._id).select("-password -refreshToken");


    await User.findByIdAndUpdate(
        newUser._id,
        {
            $unset: { refreshToken: "" }
        },
        {
            new: true
        }
    )


    console.log("User logged Out");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged Out"));

})


// userData
const userData = asyncHandler(async (req, res) => {
    // const token =
    //     req.cookies?.accessToken ||
    //     req.header("Authorization")?.replace("Bearer ", "")?.trim();

    const token = req.header("Authorization")?.replace("Bearer ", "")?.trim();

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    // verfy token 
    const decodeInfoToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeInfoToken?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid User Access");
    }



    // const options = {
    //     httpOnly: true,
    //     secure: true
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: user,
                },
                "User Data Send Successfully"
            )
        )
});



// menu data add 
const addMenu = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Name are required");
    }

    if (!req.files || !req.files.image || req.files.image.length === 0) {
        throw new ApiError(400, "Image is required");
    }

    const menuImg = req.files?.image?.[0]?.path;
    const img = await uploadOnCoudinary(menuImg);


    const menu = await Menu.create({
        name,
        image: img.url,
    })

    const menuItems = await Menu.findById(menu._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Menu Data Send Successfully"
            )
        )
})



// get product data
const productData = asyncHandler(async (req, res) => {

    // const token =
    //     req.cookies?.accessToken ||
    //     req.header("Authorization")?.replace("Bearer ", "")?.trim();

    // if (!token) {
    //     throw new ApiError(401, "Unauthorized request for finding product")
    // }

    // const decodeInfoToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const newUser = await User.findById(decodeInfoToken?._id).select("-password -refreshToken");

    // if(!newUser){
    //     throw new ApiError(401, "Unauthorized request for finding product")
    // }

    // get all product 
    const product = await Product.find({});
    if (!product) {
        throw new ApiError(401, "Product not found");
    }

    // get menu
    const menu = await Menu.find({});
    if (!menu) {
        if (!product) {
            throw new ApiError(401, "Product Menu not found");
        }
    }


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    product: product,
                    menu: menu,
                },
                " Product data Send Successfully"
            )
        )
})




// add product
const addProduct = asyncHandler(async (req, res) => {

    const {
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        discount,
        bestseller,
        sellerName,
        brand,
        rating,
        stock
    } = req.body;


    // check all required fileds
    if (
        [name, description, price, category].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check img path files or  not
    const productImg = req.files?.image?.[0]?.path;

    // check image 
    if (!productImg) {
        throw new ApiError(400, "Product Image are required");
    }

    // upload img on coudinary
    const Img = await uploadOnCoudinary(productImg);


    // create product and upload on database
    const product = await Product.create({
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        discount,
        bestseller,
        sellerName,
        brand,
        rating,
        stock,
        image: Img.url,
    })


    //find product by id
    const newProduct = await Product.findById(product._id);


    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    Product: newProduct,
                },
                "Product Add Successfully"
            )
        )
});



// get order place
const placeOrder = asyncHandler(async (req, res) => {
    const { items, address, amount } = req.body;
    const userId = req.user?._id;

    if (!userId || !items || !address || !amount) {
        throw new ApiError(400, "All fields are required");
    }

    // Convert {productId: quantity} into [{productId, quantity}]
    const formattedItems = Object.entries(items).map(([productId, quantity]) => ({
        productId,
        quantity,
    }));

    const newOrder = await Order.create({
        userId,
        items: formattedItems,
        address,
        amount,
        orderStatus: "Processing"
    });


    //Push order ID into user.orders
    await User.findByIdAndUpdate(userId, {
        $push: { orders: newOrder._id },
    });

    // const orderPlaceItems = await Order.findById(newOrder._id);
    //console.log(newOrder);

    return res.status(201).json(
        new ApiResponse(201, { order: newOrder }, "Order placed successfully")
    );
});



// get Order
const getOrder = asyncHandler(async (req, res) => {

    const allOrder = await Order.find({});
    if (!allOrder) {
        throw new ApiError(401, "Order not found");
    }

    // console.log(allOrder)


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    order: allOrder,
                },
                "Order get Successfully"
            )
        )
})



const changeOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    // Update the order status
    order.orderStatus = status;

    // Save the updated order
    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orderId: order._id,
                updatedStatus: order.orderStatus,
            },
            "Order status changed successfully"
        )
    );
});




export { registerUser, loginUser, logoutUser, userData, addProduct, productData, addMenu, placeOrder, getOrder, changeOrderStatus };