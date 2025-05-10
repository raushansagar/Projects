import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// address schema
const addressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['Home', 'Office', 'Other'],
            default: 'Home'
        },
    }, { timestamps: true }
)

const Address = mongoose.model("Address", addressSchema);









// order schema 
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    address: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        zip: String,
        country: {
            type: String,
            default: "India"
        }
    },
    amount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Order = mongoose.model("Order", orderSchema);



// product schema 
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        subCategory: {
            type: String,
        },
        sizes: {
            type: [String],
            default: [],
        },
        discount: {
            type: String,
            default: "0%",
        },
        bestseller: {
            type: Boolean,
            default: false,
        },
        sellerName: {
            type: String,
        },
        brand: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 1,
            required: true,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                comment: String,
                rating: Number,
            },
        ],
    },
    { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);


// menu schema
const menuSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    }
)

const Menu = mongoose.model("Menu", menuSchema);



// user schema 
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImg: {
            type: String,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            }
        ],
        refreshToken: {
            type: String,
        },
    }, { timestamps: true },
);



// encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})


// check password  using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// Refresh token generate
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("User", userSchema);


export { User, Address, Product, Menu, Order };