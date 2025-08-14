import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/transaction.model.js";
import OrderHistory from "../models/orderhistory.model.js";


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
        // console.log(`User from DB : ${req.userId}`)
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

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

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
    // console.log(`User from DB : ${req.userId} User from JWT : ${userId}`)
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

    

    // console.log(`User from DB : ${user}`)
    
    
    res.status(200).json({
        status: "success",
        message: "dashboard success",
        user: user
    })
}

//--------------settings---------------------------[Done]

// // this is for both profile and KYC Information
// const profile =  async (req, res) => {
//     const userId = req.user.id;


//     const user = await User.findById(userId).select('name email phone aadharNo pan');  //there is not username for this project

//     res.status(200).json({
//         status: "success",
//         message: "profile success",
//         user: user
//     })
// };


// const getBankDetails = async (req, res) => {
//     const userId = req.user.id;

//     const user = await User.findById(userId).select('bankName accountNumber accountHolder ifscCode');

//     if (!user) {
//         return res.status(404).json({
//             status: "fail",
//             message: "User not found"
//         });
//     }

//     res.status(200).json({
//         status: "success",
//         message: "Bank details retrieved successfully",
//         bankDetails: {
//             bankName: user.bankName,
//             accountNumber: user.accountNumber,
//             accountHolder: user.accountHolder,
//             ifscCode: user.ifscCode
//         }
//     });
// };

// GET /profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      'name email phone aadharNo pan aadharPhoto panPhoto userPhoto bankName accountNumber accountHolder ifscCode lastLogin role status'
    );

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Build response
    const response = {
      personal: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.email.split('@')[0] || '', // fallback
        role: user.role,
        status: user.status,
      },
      kyc: {
        aadharNumber: user.aadharNo,
        panNumber: user.pan,
        aadharPhoto: user.aadharPhoto,
        panPhoto: user.panPhoto,
        profilePhoto: user.userPhoto,
      },
      bank: {
        name: user.bankName,
        accountHolder: user.accountHolder,
        accountNumber: user.accountNumber,
        ifsc: user.ifscCode,
      },
      security: {
        lastLogin: user.lastLogin ? user.lastLogin.toLocaleString('en-IN') : '',
        // Add additional security fields as required
        twoFactorEnabled: !!user.twoFactorEnabled, // If you store this
        lastIp: req.ip || '', // Or use stored IP
      }
    };

    res.status(200).json(
      new ApiResponse(200, response, "Profile retrieved successfully")
    );
  } catch (error) {
    next(new ApiError(500, "Internal server error while retrieving profile", error.message));
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // const { userInfo } = req.body;
    // console.log("Update Profile Request Body:", req.body);
    const { personal, kyc, bank } = req.body;
    console.log("\n\n Personal Info:", personal);
    console.log("\n\n KYC Info:", kyc);
    console.log("\n\n Bank Info:", bank);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(new ApiResponse(404, null, "User not found"));

    // Update fields as needed (example)
    if (personal) {
      user.name = personal.name;
      user.email = personal.email;
      user.phone = personal.phone;
      user.username = personal.username || user.email.split('@')[0]; // Fallback to email prefix if username not provided
        // user.role = personal.role || user.role; // Allow role update if provided
        // user.status = personal.status || user.status; // Allow status update if provided
        
    }
    if (kyc) {
      user.aadharNo = kyc.aadharNumber;
      user.pan = kyc.panNumber;
      user.aadharPhoto = kyc.aadharPhoto;
      user.panPhoto = kyc.panPhoto;
      user.userPhoto = kyc.profilePhoto;
    }
    if (bank) {
      user.bankName = bank.name;
      user.accountHolder = bank.accountHolder;
      user.accountNumber = bank.accountNumber;
      user.ifscCode = bank.ifsc;
    }

    await user.save();
    res.status(200).json(new ApiResponse(200, null, "Profile updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal server error while updating profile", error.message));
  }
};


const setting = async (req, res) => {

    res.status(200).json({
        status: "success",
        message: "settings success  need to ask what is this "
    })
}

//TODO: Add forgot password and reset password functionality
//TODO: Add email verification functionality


//admin only--- below  one better-- commented out temporarily
// const getAllUsers = async (_req, res) => {
//     try {
//         const users = await User.find().select("name _id email ");
        
//         res.status(200).json({
//             status: "success",
//             message: "Users retrieved successfully",
//             data: users
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };


// //admin only
// const deleteUserById = async (req, res) => {
//     const userId = req.params.id;
//     if(!userId) {
//         return res.status(400).json({
//             status: "fail",
//             message: "User ID is required"
//         });
//     }

//     try {

//         const user = await User.findByIdAndDelete(userId);
//         if (!user) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "User not found"
//             });
//         }
//         res.status(200).json({
//             status: "success",
//             message: "User deleted successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };

const getAlluserKpis = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        
        // Get active traders (users with transactions or login in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeTraders = await User.countDocuments({
            $or: [
                { lastLogin: { $gte: thirtyDaysAgo } },
                { 
                    _id: { 
                        $in: await Transaction.distinct('userId', { 
                            createdAt: { $gte: thirtyDaysAgo } 
                        }) 
                    } 
                }
            ]
        });

        console.log("This is admin dashboard __________________------------------:::::::::")
        // Get pending withdrawals
        const pendingWithdrawals = await Transaction.aggregate([
            {
                $match: {
                    type: 'WITHDRAW',
                    status: 'PENDING'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const pendingWithdrawalData = pendingWithdrawals[0] || { totalAmount: 0, count: 0 };

        // Get pending deposits
        const pendingDeposits = await Transaction.aggregate([
            {
                $match: {
                    type: 'DEPOSIT',
                    status: 'PENDING'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const pendingDepositData = pendingDeposits[0] || { totalAmount: 0, count: 0 };

        // Get recent withdrawal requests (last 10) with null check
        const recentWithdrawals = await Transaction.find({
            type: 'WITHDRAW',
            status: { $in: ['PENDING', 'COMPLETED', 'REJECTED'] },
            createdAt: { $exists: true, $ne: null } // Add this filter
        })
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        // Get recent deposit requests (last 10) with null check
        const recentDeposits = await Transaction.find({
            type: 'DEPOSIT',
            status: { $in: ['PENDING', 'COMPLETED', 'REJECTED'] },
            createdAt: { $exists: true, $ne: null } // Add this filter
        })
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        // Calculate trends (compare with previous month)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        // Previous period users (30-60 days ago)
        const previousPeriodUsers = await User.countDocuments({
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });

        // Previous period active traders
        const previousActiveTraders = await User.countDocuments({
            $or: [
                { lastLogin: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } },
                { 
                    _id: { 
                        $in: await Transaction.distinct('userId', { 
                            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
                        }) 
                    } 
                }
            ]
        });

        // Previous period pending withdrawals
        const previousPendingWithdrawals = await Transaction.aggregate([
            {
                $match: {
                    type: 'WITHDRAW',
                    status: 'PENDING',
                    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo, $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const previousWithdrawalData = previousPendingWithdrawals[0] || { totalAmount: 0 };

        // Previous period pending deposits
        const previousPendingDeposits = await Transaction.aggregate([
            {
                $match: {
                    type: 'DEPOSIT',
                    status: 'PENDING',
                    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo, $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const previousDepositData = previousPendingDeposits[0] || { totalAmount: 0 };

        // Calculate trend percentages
        const usersTrend = previousPeriodUsers > 0 
            ? ((totalUsers - previousPeriodUsers) / previousPeriodUsers * 100).toFixed(1)
            : totalUsers > 0 ? 100 : 0;

        const tradersTrend = previousActiveTraders > 0
            ? ((activeTraders - previousActiveTraders) / previousActiveTraders * 100).toFixed(1)
            : activeTraders > 0 ? 100 : 0;

        const withdrawalTrend = previousWithdrawalData.totalAmount > 0
            ? ((pendingWithdrawalData.totalAmount - previousWithdrawalData.totalAmount) / previousWithdrawalData.totalAmount * 100).toFixed(1)
            : pendingWithdrawalData.totalAmount > 0 ? 100 : 0;

        const depositTrend = previousDepositData.totalAmount > 0
            ? ((pendingDepositData.totalAmount - previousDepositData.totalAmount) / previousDepositData.totalAmount * 100).toFixed(1)
            : pendingDepositData.totalAmount > 0 ? 100 : 0;

        // Helper function to get payment method display name
        const getPaymentMethodDisplay = (method) => {
            const methodMap = {
                'CARD': 'Credit Card',
                'UPI': 'UPI',
                'NETBANKING': 'Bank Transfer',
                'WALLET': 'Wallet',
                'BITCOIN': 'Bitcoin',
                'ETHEREUM': 'Ethereum',
                'CRYPTO': 'Cryptocurrency'
            };
            return methodMap[method?.toUpperCase()] || method || 'Bank Transfer';
        };

        // Helper function to safely format date
        const safeFormatDate = (date) => {
            if (!date) return new Date().toISOString().split('T')[0];
            try {
                return new Date(date).toISOString().split('T')[0];
            } catch (error) {
                return new Date().toISOString().split('T')[0];
            }
        };

        // Format response data with safe date handling
        const kpiData = {
            mainStats: [
                {
                    title: 'Total Users',
                    value: totalUsers.toLocaleString(),
                    trend: {
                        value: `${Math.abs(usersTrend)}%`,
                        isUp: usersTrend >= 0
                    }
                },
                {
                    title: 'Active Traders',
                    value: activeTraders.toLocaleString(),
                    trend: {
                        value: `${Math.abs(tradersTrend)}%`,
                        isUp: tradersTrend >= 0
                    }
                },
                {
                    title: 'Pending Withdrawals',
                    value: `$${pendingWithdrawalData.totalAmount.toLocaleString()}`,
                    trend: {
                        value: `${pendingWithdrawalData.count} requests`,
                        isUp: withdrawalTrend >= 0
                    }
                },
                {
                    title: 'Pending Deposits',
                    value: `$${pendingDepositData.totalAmount.toLocaleString()}`,
                    trend: {
                        value: `${pendingDepositData.count} requests`,
                        isUp: depositTrend >= 0
                    }
                }
            ],
            recentWithdrawals: recentWithdrawals.map(withdrawal => ({
                id: withdrawal._id,
                user: withdrawal.userId?.name || 'Unknown User',
                userEmail: withdrawal.userId?.email,
                userPhone: withdrawal.userId?.phone,
                amount: `$${(withdrawal.amount || 0).toLocaleString()}`,
                date: safeFormatDate(withdrawal.createdAt),
                status: withdrawal.status ? withdrawal.status.toLowerCase() : 'unknown',
                rawAmount: withdrawal.amount || 0,
                rawDate: withdrawal.createdAt || new Date(),
                paymentMethod: getPaymentMethodDisplay(withdrawal.paymentMethod),
                transactionId: withdrawal.transactionId || withdrawal._id
            })),
            recentDeposits: recentDeposits.map(deposit => ({
                id: deposit._id,
                user: deposit.userId?.name || 'Unknown User',
                userEmail: deposit.userId?.email,
                userPhone: deposit.userId?.phone,
                amount: `$${(deposit.amount || 0).toLocaleString()}`,
                method: getPaymentMethodDisplay(deposit.paymentMethod),
                date: safeFormatDate(deposit.createdAt),
                status: deposit.status ? deposit.status.toLowerCase() : 'unknown',
                rawAmount: deposit.amount || 0,
                rawDate: deposit.createdAt || new Date(),
                transactionId: deposit.transactionId || deposit._id
            }))
        };

        res.status(200).json({
            status: "success",
            message: "KPI data retrieved successfully",
            data: kpiData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching KPI data:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve KPI data",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


// Additional controller functions for handling approve/reject actions
const approveWithdrawal = async (req, res) => {
    try {
        const { withdrawalId } = req.body;
        
        if (!withdrawalId) {
            return res.status(400).json({
                status: "error",
                message: "Withdrawal ID is required"
            });
        }

        const withdrawal = await Transaction.findByIdAndUpdate(
            withdrawalId,
            { 
                status: 'COMPLETED',
                approvedBy: req.user._id,
                approvedAt: new Date()
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!withdrawal) {
            return res.status(404).json({
                status: "error",
                message: "Withdrawal request not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Withdrawal request approved successfully",
            data: withdrawal
        });

    } catch (error) {
        console.error('Error approving withdrawal:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to approve withdrawal request",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const rejectWithdrawal = async (req, res) => {
    try {
        const { withdrawalId, reason } = req.body;
        
        if (!withdrawalId) {
            return res.status(400).json({
                status: "error",
                message: "Withdrawal ID is required"
            });
        }

        const withdrawal = await Transaction.findByIdAndUpdate(
            withdrawalId,
            { 
                status: 'CANCELLED',
                rejectedBy: req.user._id,
                rejectedAt: new Date(),
                rejectionReason: reason || 'Request rejected by admin'
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!withdrawal) {
            return res.status(404).json({
                status: "error",
                message: "Withdrawal request not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Withdrawal request rejected successfully",
            data: withdrawal
        });

    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to reject withdrawal request",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status, reason } = req.body;

        // Validate status
        const validStatuses = ['PENDING', 'COMPLETED', 'REJECTED', 'FAILED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid status provided"
            });
        }

        // Find and update transaction
        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { 
                status,
                updatedAt: new Date(),
                ...(reason && { reason })
            },
            { new: true }
        ).populate('userId', 'name email phone');

        if (!transaction) {
            return res.status(404).json({
                status: "error",
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: `Transaction ${status.toLowerCase()} successfully`,
            data: transaction
        });

    } catch (error) {
        console.error('Error updating transaction status:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to update transaction status",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const approveDeposit = async (req, res) => {
    try {
        const { depositId } = req.body;
        
        if (!depositId) {
            return res.status(400).json({
                status: "error",
                message: "Deposit ID is required"
            });
        }

        const deposit = await Transaction.findByIdAndUpdate(
            depositId,
            { 
                status: 'COMPLETED',
                approvedBy: req.user._id,
                approvedAt: new Date()
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!deposit) {
            return res.status(404).json({
                status: "error",
                message: "Deposit request not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Deposit request approved successfully",
            data: deposit
        });

    } catch (error) {
        console.error('Error approving deposit:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to approve deposit request",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

const rejectDeposit = async (req, res) => {
    try {
        const { depositId, reason } = req.body;
        
        if (!depositId) {
            return res.status(400).json({
                status: "error",
                message: "Deposit ID is required"
            });
        }

        const deposit = await Transaction.findByIdAndUpdate(
            depositId,
            { 
                status: 'FAILED',
                rejectedBy: req.user._id,
                rejectedAt: new Date(),
                rejectionReason: reason || 'Request rejected by admin'
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!deposit) {
            return res.status(404).json({
                status: "error",
                message: "Deposit request not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Deposit request rejected successfully",
            data: deposit
        });

    } catch (error) {
        console.error('Error rejecting deposit:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to reject deposit request",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};



// const userapprove = async (req, res) => {
//     const userId  = req.params.id;
//     try {
//         const user = await User.findById(userId);
//         if(!user) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "User not found"
//             });
//         }
//         user.isVerified = true;
//         await user.save();
    
//         res.status(200).json({
//             status: "success",
//             message: "User approved successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });   
//     }
// }

// const userreject = async (req, res) => {
//     const userId  = req.params.id;
//     try {
//         const user = await User.findById(userId);
//         if(!user) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "User not found"
//             });
//         }
//         user.isVerified = false;
//         await user.save();
    
//         res.status(200).json({
//             status: "success",
//             message: "User rejected successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });   
//     }
// }

// const getUserbyId = async (req, res) => {
//     const userId  = req.params.id;
//     try {
//         const user = await User.findById(userId).select('name email phone aadharNo pan bankName accountNumber accountHolder ifscCode isVerified');
//         if(!user) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "User not found"
//             });
//         }
    
//         res.status(200).json({
//             status: "success",
//             message: "User retrieved successfully",
//             data: user
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });   
//     }
// }   

const userapprove = async (req, res) => {
    // Get userId from params, body, or query (flexible approach)
    const userId = req.params.id || req.body.userId || req.query.userId;
    
    if (!userId) {
        return res.status(400).json({
            status: "fail",
            message: "User ID is required"
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "User approved successfully",
            data: {
                userId: user._id,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}

const userreject = async (req, res) => {
    // Get userId from params, body, or query (flexible approach)
    const userId = req.params.id || req.body.userId || req.query.userId;
    
    if (!userId) {
        return res.status(400).json({
            status: "fail",
            message: "User ID is required"
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        user.isVerified = false;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "User rejected successfully",
            data: {
                userId: user._id,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}

const getUserbyId = async (req, res) => {
    // Get userId from params, body, or query (flexible approach)
    const userId = req.params.id || req.body.userId || req.query.userId;
    
    if (!userId) {
        return res.status(400).json({
            status: "fail",
            message: "User ID is required"
        });
    }

    try {
        const user = await User.findById(userId).select('name email phone aadharNo pan bankName accountNumber accountHolder ifscCode isVerified createdAt updatedAt');
        if (!user) {
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
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}



const getAllUsers = async (req, res) => {
    try {
        // You can add pagination, filtering, and sorting here
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('name email phone aadharNo pan bankName accountNumber accountHolder ifscCode isVerified createdAt updatedAt')
            .sort({ createdAt: -1 }) // Latest users first
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: users,
            pagination: {
                page,
                limit,
                total: totalUsers,
                pages: Math.ceil(totalUsers / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });   
    }
}

const deleteUserById = async (req, res) => {
    const { userId } =  req.params.id || req.body.userId || req.query.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
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
}

// // You'll also need to implement getAlluserKpis function
// const getAlluserKpis = async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();
//         const verifiedUsers = await User.countDocuments({ isVerified: true });
//         const unverifiedUsers = await User.countDocuments({ isVerified: false });
        
//         // Calculate new users (last 30 days)
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//         const newUsers = await User.countDocuments({ 
//             createdAt: { $gte: thirtyDaysAgo } 
//         });

//         res.status(200).json({
//             status: "success",
//             data: {
//                 totalUsers,
//                 activeUsers: verifiedUsers,
//                 suspendedUsers: unverifiedUsers,
//                 newUsers
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: error.message
//         });   
//     }
// }


const getKYCInfo = async (req,res) => {
    res.status(200).json({
        status: "success",
        message: "KYC info is provided to you shortly."
    });   
}


const getLastLogin = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('lastLogin');
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        return res.status(201).json(
            new ApiResponse(200, user.lastLogin ? user.lastLogin.toISOString() : null, "Last login retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Internal server error while retrieving last login", error.message);
    }
};

const getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status } = req.query; // Add filter support

        // Build filter query
        let filterQuery = { userId };
        if (status && status !== 'All') {
            filterQuery.status = status.toUpperCase();
        }

        // Fetch order history from OrderHistory collection
        const orderHistory = await OrderHistory.find(filterQuery)
            .sort({ tradeDate: -1 });

        // Calculate summary data
        const summaryData = await calculateSummaryData(userId);

        return res.status(200).json(
            new ApiResponse(200, {
                trades: orderHistory,
                summary: summaryData
            }, "Order history retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Internal server error while retrieving order history", error.message);
    }
};

// Helper function to calculate summary data
const calculateSummaryData = async (userId) => {
    const trades = await OrderHistory.find({ userId });
    
    const totalTrades = trades.length;
    const totalInvestment = trades.reduce((sum, trade) => sum + trade.tradeAmount, 0);
    const totalProfitLoss = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    
    // You can add logic here to calculate changes from last week
    // For now, returning basic calculations
    
    return [
        { 
            title: 'Total Trades', 
            value: totalTrades.toString(), 
            change: '+5 from last week' // You can calculate this dynamically
        },
        { 
            title: 'Total Investment', 
            value: `$${totalInvestment.toLocaleString()}`, 
            change: '+$1,200 from last week' // You can calculate this dynamically
        },
        { 
            title: 'Net Profit/Loss', 
            value: totalProfitLoss >= 0 ? `+$${totalProfitLoss.toLocaleString()}` : `-$${Math.abs(totalProfitLoss).toLocaleString()}`, 
            change: '+$320 from last week' // You can calculate this dynamically
        }
    ];
};


const getPersonalInfo = async (req, res) => {
    //need to fix this
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }
        const personalInfo = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            aadharNo: user.aadharNo,
            pan: user.pan
        };

        return res.status(200).json(
            new ApiResponse(200, personalInfo, "Personal information retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Internal server error while retrieving personal information", error.message);
    }
};



const getTradeHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 }); // Most recent first

    return res.status(200).json(
      new ApiResponse(200, transactions, "Trade history retrieved successfully")
    );

  } catch (error) {
    return next(
      new ApiError(500, "Internal server error while retrieving trade history", error.message)
    );
  }
};



export { 
    test, 
    register, 
    logout, 
    changePassword, 
    dashboard, 
    login, 
    // getBankDetails, 
    setting, 
    // profile,
    //profile 
    getProfile,
    updateProfile,


    getLastLogin,
    getKYCInfo,
    getOrderHistory,
    getPersonalInfo,
    // getProfile,
    getTradeHistory,


    
    //-----for admin only-------
    getAlluserKpis,
    updateTransactionStatus,
    getUserbyId,
    userapprove,
    userreject,
    approveWithdrawal,
    rejectWithdrawal,
    approveDeposit,
    rejectDeposit,
    
    getAllUsers,
    deleteUserById,
};