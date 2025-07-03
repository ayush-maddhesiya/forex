import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rex.spinka@ethereal.email',
        pass: 'Dt12U39mGY7jdhatwk'
    }
});


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
    console.log("Register controller called");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    try {
        const { email, password, firstName, lastName, phone, aadharNo, pan, gender, dob, nomineeName, nomineeRelation, nomineeDob, bankName, accountNumber, accountHolder, ifscCode, address } = req.body;
        
        // Check if files are uploaded
        const files = req.files;
        console.log("Files received:", files);
        
        if (!files || !files.aadharPhoto || !files.panPhoto || !files.userPhoto) {
            console.log("Missing files:", {
                hasFiles: !!files,
                hasAadhar: !!files?.aadharPhoto,
                hasPan: !!files?.panPhoto,
                hasUser: !!files?.userPhoto
            });
            return res.status(400).json({
                status: "fail",
                message: "Please upload all required documents (Aadhar, PAN, and User photo)"
            });
        }

        // Check if all required fields are present
        if (!email || !password || !firstName || !lastName || !phone || !aadharNo || !pan || !gender || !dob || !nomineeName || !nomineeRelation || !nomineeDob || !bankName || !accountNumber || !accountHolder || !ifscCode || !address) {
            console.log("Missing fields:", {
                email: !!email,
                password: !!password,
                firstName: !!firstName,
                lastName: !!lastName,
                phone: !!phone,
                aadharNo: !!aadharNo,
                pan: !!pan,
                gender: !!gender,
                dob: !!dob,
                nomineeName: !!nomineeName,
                nomineeRelation: !!nomineeRelation,
                nomineeDob: !!nomineeDob,
                bankName: !!bankName,
                accountNumber: !!accountNumber,
                accountHolder: !!accountHolder,
                ifscCode: !!ifscCode,
                address: !!address
            });
            return res.status(400).json({
                status: "fail",
                message: "Please provide all required fields"
            });
        }

        // Check if user already exists
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
                message: "User already exists with this email, phone, PAN, or Aadhar number"
            });
        }

        console.log("Creating new user with data:", {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            aadharNo,
            pan,
            bankName,
            accountNumber,
            accountHolder,
            ifscCode,
            aadharPhoto: files.aadharPhoto[0].path,
            panPhoto: files.panPhoto[0].path,
            userPhoto: files.userPhoto[0].path
        });

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
                address,
            // Add document URLs from Cloudinary
            aadharPhoto: files.aadharPhoto[0].path,
            panPhoto: files.panPhoto[0].path,
            userPhoto: files.userPhoto[0].path
        });

        // to send email to user their password
        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
            to: email,
            subject: "User Registration Successful",
            text: `Welcome to forex! Your registration is successful. Your login email is ${email} and password is ${password}. Please keep your credentials safe.`,
            html: `
            <h2>Welcome to forex</h2>
            <p>Your registration is successful. Here are your details:</p>
            <h3>Login Information</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please keep your password safe.</p>
            
            <h3>Personal Details</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Address:</strong> ${address}</p>
            
            <h3>ID Details</h3>
            <p><strong>Aadhar Number:</strong> ${aadharNo}</p>
            <p><strong>PAN:</strong> ${pan}</p>
            
            <h3>Nominee Details</h3>
            <p><strong>Name:</strong> ${nomineeName}</p>
            <p><strong>Relation:</strong> ${nomineeRelation}</p>
            <p><strong>Date of Birth:</strong> ${nomineeDob}</p>
            
            <h3>Bank Details</h3>
            <p><strong>Bank Name:</strong> ${bankName}</p>
            <p><strong>Account Number:</strong> ${accountNumber}</p>
            <p><strong>Account Holder:</strong> ${accountHolder}</p>
            <p><strong>IFSC Code:</strong> ${ifscCode}</p>
            `
        });

        console.log("Email sent successfully:", info.messageId);

        await newUser.save();
        console.log("User saved successfully");

        res.status(201).json({
            status: "success",
            message: "Registration successful"
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({
            status: "error",
            message: "Error in registration",
            error: error.message
        });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
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

        if( user.isVerified === false){
            return res.status(402).json({
                status: "fail",
                message:"Your are not Verified"
            })
        }

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
    }
}

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
    if (oldPassword === newPassword) {
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

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({
            status: "fail",
            message: "User not found"
        })
    }

    

    console.log(`User from DB : ${user}`)
    
    
    res.status(200).json({
        status: "success",
        message: "dashboard success",
        user: user
    })
}

//--------------settings---------------------------[Done]

// this is for both profile and KYC Information
const profile =  async (req, res) => {
    const userId = req.user.id;


    const user = await User.findById(userId).select('name email phone aadharNo pan');  //there is not username for this project

    res.status(200).json({
        status: "success",
        message: "profile success",
        user: user
    })
};


const getBankDetails = async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select('bankName accountNumber accountHolder ifscCode');

    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Bank details retrieved successfully",
        bankDetails: {
            bankName: user.bankName,
            accountNumber: user.accountNumber,
            accountHolder: user.accountHolder,
            ifscCode: user.ifscCode
        }
    });
};


const setting = async (req, res) => {

    res.status(200).json({
        status: "success",
        message: "settings success  need to ask what is this "
    })
}

//TODO: Add forgot password and reset password functionality
//TODO: Add email verification functionality


//admin only
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};

//admin only
const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    if(!userId) {
        return res.status(400).json({
            status: "fail",
            message: "User ID is required"
        });
    }

    try {

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};


const getAlluserKpis = async (req, res) => {
    res.status(200).json({
        status: "success",
        message: "get all user kpis success",
    });
}


const userapprove = async (req, res) => {
    const userId  = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
        user.isVerified = true;
        await user.save();
    
        res.status(200).json({
            status: "success",
            message: "User approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}

const userreject = async (req, res) => {
    const userId  = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
        user.isVerified = false;
        await user.save();
    
        res.status(200).json({
            status: "success",
            message: "User rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}

const getUserbyId = async (req, res) => {
    const userId  = req.params.id;
    try {
        const user = await User.findById(userId).select('name email phone aadharNo pan bankName accountNumber accountHolder ifscCode isVerified');
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
    
        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}   


export { 
    test, 
    register, 
    logout, 
    changePassword, 
    dashboard, 
    login, 
    getBankDetails, 
    setting, 
    profile,



    
    //-----for admin only-------
    getAlluserKpis,
    getUserbyId,
    userapprove,
    userreject,
    
    getAllUsers,
    deleteUserById,
};