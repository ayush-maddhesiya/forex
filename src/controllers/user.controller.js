import  User  from "../models/user.model.js"
import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
const test = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "test success"
    })
}

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();

        await user.save({ validateBeforeSave: false });

        return { accessToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the JWT tokens")
    }
}

const register = async (req, res) => {
    const { email, password, firstName, lastName, phone, aadharNo, pan, gender, dob, nomineeName, nomineeRelation, nomineeDob, bankName, accountNumber, accountHolder, ifscCode, address } = req.body;

    if (!email || !password || !firstName || !lastName || !phone || !aadharNo || !pan || !gender || !dob || !nomineeName || !nomineeRelation || !nomineeDob || !bankName || !accountNumber || !accountHolder || !ifscCode || !address) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide all fields"
        })
    }

    // Check if user already exists
    
    try {
        const userExists = await User.findOne({
            $or: [
            { email },
            { phone },
            { pan },
            { aadharNo }
            ]
        });
        if (userExists) {
            return res.status(400).json({
                status: "fail",
                message: "User already exists"
            })
        }
    
        

        // Create new user
        const newUser = new User({
            name: `${firstName} ${lastName}`,
            email,
            password,
            phone,
            aadharNo,
            pan,
            gender,
            dob,
            nomineeName,
            nomineeRelation,
            nomineeDob,
            bankName,
            accountNumber,
            accountHolder,
            ifscCode,
            address
        });


        await newUser.save();

        res.status(200).json({
            status: "success",
            message: "register success"
        })

    
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        })   
    }     
} 


    const login = async (req, res) => {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password"
            })
        }
    try {
        const user = await User.findOne({ email });
        console.log(`User from DB : ${req.userId}`)
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email"
            });
        }

        
        const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password.trim());
        console.log(`Old Password: ${user.password} New Password: ${password} Is Password Correct: ${isPasswordCorrect}`)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid password"
            });
        }

        const { accessToken } = await generateAccessToken(user._id);

        const options = { httpOnly: true, secure: true, sameSite: "none" };
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                status: "success",
                message: "login success"
            });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }}

const logout = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json({
            status: "success",
            message: "logout success"
        })

}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide old password and new password"
        })
    }
    if( oldPassword === newPassword) {
        return res.status(400).json({
            status: "fail",
            message: "Old password and new password cannot be same"
        })
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "User not found"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid old password"
            })
        }

        //dont need to hash password again as it is already hashed in the model
        user.password = newPassword;
        await user.save();

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        })
    }
    
    res.status(200).json({
        status: "success",
        message: "change password success"
    })
}


/*
            totalDeposits,
            totalWithdrawals,
            recentTransactions,
            openPositions,
            closedPositions,
            approvedLoan,
            verifiedOrdersAmount
*/

const dashboard = async (req, res) => {
    const userId = req.user.id;
    console.log(`User from DB : ${req.userId} User from JWT : ${userId}`)
    // if (!userId) {
    //     return res.status(400).json({
    //         status: "fail",
    //         message: "User not found"
    //     })
    // }
    res.status(200).json({
        status: "success",
        message: "dashboard success"
    })
}

//TODO: Add forgot password and reset password functionality
//TODO: Add email verification functionality

export { test, register, logout, changePassword, dashboard, login };