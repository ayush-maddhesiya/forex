
// import Transaction  from '../models/transaction.model.js';
// import User  from '../models/user.model.js';


// const createDeposit = async (req, res) => {
//     const { amount, userId ,paymentMethod } = req.body;
//     if (!amount || !userId || !paymentMethod) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Please provide all fields"
//         })
//     }

//     if( amount <= 10) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Minimum deposit amount is 10"
//         })
//     }
    

//     if( paymentMethod !== 'CARD' && paymentMethod !== 'UPI' && paymentMethod !== 'NETBANKING' && paymentMethod !== 'WALLET') {
//         return res.status(400).json({
//             status: "fail",
//             message: "Invalid payment method"
//         })
//     }
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "User not found"
//             })
//         }
//         const transaction = new Transaction({
//             userId,
//             type: 'DEPOSIT',
//             status: 'PENDING',
//             amount: parseFloat(amount), 
//             paymentMethod: paymentMethod.toUpperCase(), 
//             description: `Deposit of ${amount} via ${paymentMethod} - pending verification`,
//             verified: false 
//         });
//         await transaction.save();
//         res.status(201).json({
//             status: "success",
//             data: transaction
//         })
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: error.message
//         })
//     }
// }

// const getallDeposit = async (req, res) => {
//     const { userId } = req.params;
//     if (!userId) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Please provide userId"
//         })
//     }
//     try {
//         const transactions = await Transaction.find({ userId, type: 'DEPOSIT' });
//         if (!transactions) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "No transactions found"
//             })
//         }
//         res.status(200).json({
//             status: "success",
//             data: transactions
//         })
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: error.message
//         })
//     }
// }

// const getDepositById = async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Please provide deposit ID"
//     })
//   }
//   try {
//     const transaction = await Transaction.findById(id);
//     if (!transaction) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Transaction not found"
//       })
//     }
//     res.status(200).json({
//       status: "success",
//       data: transaction
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     })
//   }
// }
  

//   const createWithdrawal = async (req, res) => {
//     const { amount, userId } = req.body;

//     // Validate input
//     if (!amount || typeof amount !== 'number' || amount < 10) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Invalid withdrawal amount"
//       });
//     }

//     if (!userId) {
//       return res.status(400).json({
//         status: "fail",
//         message: "User ID is required"
//       });
//     }

//     try {
//       // Verify user exists
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({
//           status: "fail",
//           message: "User not found"
//         });
//       }

//       if (!user.isVerified) {
//         return res.status(403).json({
//           status: "fail",
//           message: "Account not verified"
//         });
//       }

//       // Create a withdrawal transaction
//       const transaction = new Transaction({
//         userId,
//         type: 'WITHDRAW',
//         status: 'PENDING',
//         amount: parseFloat(amount),
//         transactionId: `WD${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
//         description: `Withdrawal request of ₹${amount}`,
//         currency: "INR",
//         metadata: {
//           bankName: user.bankName,
//           accountNumber: user.accountNumber,
//           ifscCode: user.ifscCode,
//           accountHolder: user.accountHolder,
//         },
//       });

//       await transaction.save();

//       res.status(201).json({
//         status: "success",
//         data: transaction
//       });
//     } catch (error) {
//       console.error("Withdrawal creation failed:", error);
//       res.status(500).json({
//         status: "error",
//         message: error.message || "Failed to process withdrawal"
//       });
//     }
//   };
    

// const getallWithdrawal = async (req, res) => {
//   const { userId } = req.params;
//   if (!userId) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Please provide userId"
//     })
//   }

//   try {
//     const transactions = await Transaction.find({ userId, type: 'WITHDRAW' });
//     if (!transactions) {
//       return res.status(404).json({
//         status: "fail",
//         message: "No transactions found"
//       })
//     }
//     res.status(200).json({
//       status: "success",
//       data: transactions
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     })
//   }
// }

// const getWithdrawalById = async (req, res) => {
//   const { id } = req.params;
//   //TODO: validate id (ObjectId) from mongoose
//   if (!id ) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Please provide withdrawal ID"
//     })
//   }
//   try {
//     const transaction = await Transaction.findById(id);
//     if (!transaction) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Transaction not found"
//       })
//     }
//     res.status(200).json({
//       status: "success",
//       data: transaction
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     })
//   }
// }

// const historyTransaction = async (req, res) => { 
//   const  userId  = req.user._id;  //TODO : replace by req.user.id
//   if (!userId) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Please provide userId"
//     })
//   }
//   try {
//     const transactions = await Transaction.find({ userId },
//       { type: 1, status: 1, amount: 1, transactionId: 1, createdAt: 1 } // Select only the fields you need
//     ).sort({ createdAt: -1 }
//     ).limit(10); // Limit to the last 10 transactions
//     if (!transactions || transactions.length === 0) {
//       return res.status(404).json({
//         status: "fail",
//         message: "No transactions found"
//       })
//     }
//     res.status(200).json({
//       status: "success",
//       data: transactions
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     })
//   }
// }


// export {
//     createDeposit,
//     getallDeposit,
//     getDepositById,
//     createWithdrawal,
//     getallWithdrawal,
//     getWithdrawalById,
//     historyTransaction,

// }

//----------------------------------------------New Code----------------------------------------------

import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// import PaymentInfo  from '../models/paymentinfo.model.js'


// Helper function to generate unique transaction ID
const generateTransactionId = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create Deposit Transaction
// transaction.controller.js
const deposit = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id; // from JWT

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const transaction = await Transaction.create({
    userId,
    type: 'DEPOSIT',
    transactionId: generateTransactionId(),
    status: 'PENDING',
    amount: Number(amount),
    paymentMethod: 'UPI',
    description: `Deposit of ₹${amount} via UPI`,
    verified: false,
  });

  user.transactions.push(transaction._id);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, transaction, "Deposit request created"));
});




// Create Withdrawal Transaction
const withdraw = asyncHandler(async (req, res) => {
  const { amount,  } = req.body;
  const userId = req.user._id;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  try {
    const transaction = await Transaction.create({
      userId,
      type: 'WITHDRAWAL',
      transactionId: generateTransactionId(),
      status: 'PENDING',
      amount,
      description : "Withdrawal request of ₹" + amount,
      verified: false
    });
    const user = await User.findById(userId);

    user.transactions.push(transaction._id);
    await user.save();

    return res.status(201).json(
      new ApiResponse(201, transaction, "Withdrawal transaction created successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to create withdrawal transaction");
  }
});

// Get Transaction History (with DEPOSIT and WITHDRAWAL)
const transactionHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const transactionsRaw = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    const total = await Transaction.countDocuments({ userId });

    const transactions = transactionsRaw.map((tx) => ({
      id: tx._id,
      date: tx.timestamp.toISOString().split('T')[0], // Format YYYY-MM-DD
      type: tx.type.toLowerCase() === 'deposit' ? 'deposit' : 'withdraw',
      amount: `$${tx.amount.toLocaleString()}`,
      status: tx.status.toLowerCase(),
    }));

    const response = {
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    };

    return res.status(200).json(
      new ApiResponse(200, response, "Transaction history retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new ApiError(500, "Failed to retrieve transaction history");
  }
});


// Get Deposit History
const depositHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter = { userId, type: 'DEPOSIT' };
  
  if (status) {
    filter.status = status.toUpperCase();
  }

  try {
    const deposits = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    const response = {
      deposits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };

    return res.status(200).json(
      new ApiResponse(200, response, "Deposit history retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve deposit history");
  }
});

// Get Withdrawal History
const withdrawHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter = { userId, type: 'WITHDRAWAL' };
  
  if (status) {
    filter.status = status.toUpperCase();
  }

  try {
    const withdrawals = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    const response = {
      withdrawals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };

    return res.status(200).json(
      new ApiResponse(200, response, "Withdrawal history retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve withdrawal history");
  }
});



// Get Deposit Details/Summary
const depositDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const totalSummary = await user.getUserBalances(userId)
    if(!totalSummary){
      throw new ApiError(404, "User not found or no transactions available");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve deposit details");
  }

});

// Get Withdrawal Details/Summary
// Get Withdrawal Details/Summary
const withdrawDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Method 1: If you have getUserBalances method
    const totalSummary = await user.getUserBalances(userId);
    
    if (!totalSummary) {
      // Method 2: Calculate manually if getUserBalances doesn't exist
      const deposits = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'DEPOSIT', status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const withdrawals = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'WITHDRAWAL', status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const totalDeposit = deposits[0]?.total || 0;
      const totalWithdrawals = withdrawals[0]?.total || 0;
      const accountBalance = totalDeposit - totalWithdrawals;

      const summary = {
        accountBalance,
        totalDeposit,
        totalWithdrawals,
        orderInvestment: 0, // You might need to calculate this based on your business logic
        profitLoss: 0 // You might need to calculate this based on your business logic
      };

      return res.status(200).json(
        new ApiResponse(200, summary, "Withdrawal details retrieved successfully")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, totalSummary, "Withdrawal details retrieved successfully")
    );
  } catch (error) {
    console.error('Error in withdrawDetails:', error);
    throw new ApiError(500, "Failed to retrieve withdrawal details");
  }
});





// Get Transaction Summary for Dashboard
const getTransactionSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const detail = await user.getUserBalances(userId);

  return res.status(200).json(
    new ApiResponse(200, detail, "Transaction summary retrieved successfully")
  );
  
});

//---------------------------------admin----------------------------------
// Update Transaction Status (Admin only)
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { status, failureReason } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { 
        $or: [
          { _id: transactionId },
          { transactionId: transactionId }
        ]
      },
      { 
        status: status.toUpperCase(),
        failureReason,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return res.status(200).json(
      new ApiResponse(200, transaction, "Transaction status updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to update transaction status");
  }
});


// Get Transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user._id;

  try {
    const transaction = await Transaction.findOne({
      $or: [
        { _id: transactionId, userId },
        { transactionId: transactionId, userId }
      ]
    }).populate('userId', 'name email');

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return res.status(200).json(
      new ApiResponse(200, transaction, "Transaction retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve transaction");
  }
});


// Admin: Get All Pending Withdrawals

//----------------deposit-------------------
const getAllPendingDeposits = asyncHandler(async (req, res) => {
  try {
    const pendingDeposits = await Transaction.find({ type: 'DEPOSIT', status: 'PENDING' })
      .populate('userId', 'name email');
    const totalPending = pendingDeposits.length;
    return res.status(200).json(
      new ApiResponse(200, { pendingDeposits, totalPending }, "Pending deposits retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve pending deposits");
  }
});

const getPendingDepositById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deposit = await Transaction.findOne({ _id: id, type: 'DEPOSIT', status: 'PENDING' })
      .populate('userId', 'name email');

    if (!deposit) {
      throw new ApiError(404, "Pending deposit not found");
    }

    return res.status(200).json(
      new ApiResponse(200, deposit, "Pending deposit retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve pending deposit");
  }
});



const getVerifiedDepositById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deposit = await Transaction.findOne({ _id: id, type: 'DEPOSIT', status: 'VERIFIED' })
      .populate('userId', 'name email ');

    if (!deposit) {
      throw new ApiError(404, "Verified deposit not found");
    }

    return res.status(200).json(
      new ApiResponse(200, deposit, "Verified deposit retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve verified deposit");
  }
});

const approvedDeposit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deposit = await Transaction.findOneAndUpdate(
      { _id: id, type: 'DEPOSIT', status: 'PENDING' },
      { status: 'COMPLETED' },
      { new: true }
    ).populate('userId', 'name email ');

    if (!deposit) {
      throw new ApiError(404, "Pending deposit not found");
    }
    deposit.verified = true; // Mark as verified
    await deposit.save();

    return res.status(200).json(
      new ApiResponse(200, deposit, "Pending deposit approved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to approve pending deposit");
  }
});


const rejectDeposit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Reason for rejection is required");
  }

  try {
    const deposit = await Transaction.findOneAndUpdate(
      { _id: id, type: 'DEPOSIT', status: 'PENDING' },
      { status: 'CANCELLED', failureReason: reason || "This is a reason that no one can tell , ask your lord" },
      { new: true }
    ).populate('userId', 'name email ');

    if (!deposit) {
      throw new ApiError(404, "Pending deposit not found");
    }

    return res.status(200).json(
      new ApiResponse(200, deposit, "Pending deposit rejected successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to reject pending deposit");
  }
});


const getAllDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Transaction.find({ type: 'DEPOSIT' })
      .populate('userId', 'name email ');

    if (!deposits || deposits.length === 0) {
      throw new ApiError(404, "No deposits found");
    }

    return res.status(200).json(
      new ApiResponse(200, deposits, "All deposits retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve all deposits"); 
  }
});

//----------------withdrawals-------------------
const getAllPendingWithdrawals = asyncHandler(async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'WITHDRAWAL', status: 'PENDING' })
      .populate('userId', 'name');

    const totalPending = withdrawals.length;

    if (!withdrawals || withdrawals.length === 0) {
      throw new ApiError(404, "No pending withdrawals found");
    }

    return res.status(200).json(
      new ApiResponse(200,{ totalPending, withdrawals }, "All pending withdrawals retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve all pending withdrawals");
  }
});

const getallCompletedWithdrawals = asyncHandler(async (req, res) => {
  try {
    const totalCompleted = await Transaction.countDocuments({ type: 'WITHDRAWAL', status: 'COMPLETED' });
    return res.status(200).json(
      new ApiResponse(200, { totalCompleted }, "All completed withdrawals retrieved successfully")
    );
  
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve all completed withdrawals");
  }
  });



const getPendingWithdrawalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const withdrawal = await Transaction.findOne({ _id: id, type: 'WITHDRAWAL', status: 'PENDING' })
      .populate('userId', 'name email amount date method status');

    if (!withdrawal) {
      throw new ApiError(404, "Pending withdrawal not found");
    }

    return res.status(200).json(
      new ApiResponse(200, withdrawal, "Pending withdrawal retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve pending withdrawal");
  }
});

const getVerifiedWithdrawalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const withdrawal = await Transaction.findOne({ _id: id, type: 'WITHDRAWAL', status: 'COMPLETED' })
      .populate('userId', 'name email amount date method status');

    if (!withdrawal) {
      throw new ApiError(404, "Verified withdrawal not found");
    }

    return res.status(200).json(
      new ApiResponse(200, withdrawal, "Verified withdrawal retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve verified withdrawal");
  }
});

const approveWithdrawal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const withdrawal = await Transaction.findOneAndUpdate(
      { _id: id, type: 'WITHDRAWAL', status: 'PENDING' },
      { status: 'COMPLETED' },
      { new: true }
    ).populate('userId', 'name email amount date method status');

    if (!withdrawal) {
      throw new ApiError(404, "Pending withdrawal not found");
    }

    withdrawal.verified = true; // Mark as verified
    await withdrawal.save();

    return res.status(200).json(
      new ApiResponse(200, withdrawal, "Pending withdrawal approved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to approve pending withdrawal");
  }
});

const rejectWithdrawal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const withdrawal = await Transaction.findOneAndUpdate(
      { _id: id, type: 'WITHDRAWAL', status: 'PENDING' },
      { status: 'CANCELLED' },
      { new: true }
    ).populate('userId', 'name email amount date method status');

    if (!withdrawal) {
      throw new ApiError(404, "Pending withdrawal not found");
    }

    return res.status(200).json(
      new ApiResponse(200, withdrawal, "Pending withdrawal rejected successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to reject pending withdrawal");
  }
});

const getAllWithdrawals = asyncHandler(async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'WITHDRAWAL' })
      .populate('userId', 'name email amount date method status');

    const totalWithdrawals = withdrawals.length;

    const totalAmount = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    if (!withdrawals || withdrawals.length === 0) {
      throw new ApiError(404, "No withdrawals found");
    }

    return res.status(200).json(
      new ApiResponse(200, {withdrawals, totalWithdrawals , totalAmount}, "All withdrawals retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve all withdrawals");
  }

});


export {
  deposit,
  withdraw,
  transactionHistory,
  depositHistory,
  withdrawHistory,
  depositDetails,
  withdrawDetails,
  getTransactionById,
  updateTransactionStatus,
  getTransactionSummary,

  //-----for admin----
  //--------withdrawals

  //-------------------------------------------------Total Requests, Pending Requests, total Amount,Completed Requests
  getAllPendingWithdrawals,   // for number of pending withdrawals [route]  .length()
  getPendingWithdrawalById,   
  getVerifiedWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
  getAllWithdrawals,  //from i can get total requests  .populate(user)
  getallCompletedWithdrawals, // for KPIs


  //--------deposits
  getAllPendingDeposits,
  getPendingDepositById,
  getVerifiedDepositById,
  approvedDeposit,
  rejectDeposit,
  getAllDeposits,
};