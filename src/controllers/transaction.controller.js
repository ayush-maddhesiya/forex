
import { Transaction } from '../models/transaction.model.js';
import { User } from '../models/user.model.js';


const createDeposit = async (req, res) => {
    const { amount, userId ,paymentMethod } = req.body;
    if (!amount || !userId || !paymentMethod) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide all fields"
        })
    }

    if( amount <= 10) {
        return res.status(400).json({
            status: "fail",
            message: "Minimum deposit amount is 10"
        })
    }
    

    if( paymentMethod !== 'CARD' && paymentMethod !== 'UPI' && paymentMethod !== 'NETBANKING' && paymentMethod !== 'WALLET') {
        return res.status(400).json({
            status: "fail",
            message: "Invalid payment method"
        })
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            })
        }
        const transaction = new Transaction({
            userId,
            type: 'DEPOSIT',
            status: 'PENDING',
            amount: parseFloat(amount), 
            paymentMethod: paymentMethod.toUpperCase(), 
            description: `Deposit of ${amount} via ${paymentMethod} - pending verification`,
            verified: false 
        });
        await transaction.save();
        res.status(201).json({
            status: "success",
            data: transaction
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const getallDeposit = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide userId"
        })
    }
    try {
        const transactions = await Transaction.find({ userId, type: 'DEPOSIT' });
        if (!transactions) {
            return res.status(404).json({
                status: "fail",
                message: "No transactions found"
            })
        }
        res.status(200).json({
            status: "success",
            data: transactions
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const getDepositById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide deposit ID"
    })
  }
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found"
      })
    }
    res.status(200).json({
      status: "success",
      data: transaction
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}
  

  const createWithdrawal = async (req, res) => {
    const { amount, userId } = req.body;

    // Validate input
    if (!amount || typeof amount !== 'number' || amount < 10) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid withdrawal amount"
      });
    }

    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is required"
      });
    }

    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found"
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          status: "fail",
          message: "Account not verified"
        });
      }

      // Create a withdrawal transaction
      const transaction = new Transaction({
        userId,
        type: 'WITHDRAW',
        status: 'PENDING',
        amount: parseFloat(amount),
        transactionId: `WD${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
        description: `Withdrawal request of ₹${amount}`,
        currency: "INR",
        metadata: {
          bankName: user.bankName,
          accountNumber: user.accountNumber,
          ifscCode: user.ifscCode,
          accountHolder: user.accountHolder,
        },
      });

      await transaction.save();

      res.status(201).json({
        status: "success",
        data: transaction
      });
    } catch (error) {
      console.error("Withdrawal creation failed:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "Failed to process withdrawal"
      });
    }
  };
    

const getallWithdrawal = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide userId"
    })
  }

  try {
    const transactions = await Transaction.find({ userId, type: 'WITHDRAW' });
    if (!transactions) {
      return res.status(404).json({
        status: "fail",
        message: "No transactions found"
      })
    }
    res.status(200).json({
      status: "success",
      data: transactions
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

const getWithdrawalById = async (req, res) => {
  const { id } = req.params;
  //TODO: validate id (ObjectId) from mongoose
  if (!id ) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide withdrawal ID"
    })
  }
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found"
      })
    }
    res.status(200).json({
      status: "success",
      data: transaction
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

const historyTransaction = async (req, res) => { 
  const { userId } = req.params;  //TODO : replace by req.user.id
  if (!userId) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide userId"
    })
  }
  try {
    const transactions = await Transaction.find({ userId },
      { type: 1, status: 1, amount: 1, transactionId: 1, createdAt: 1 } // Select only the fields you need
    ).sort({ createdAt: -1 }
    ).limit(10); // Limit to the last 10 transactions
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No transactions found"
      })
    }
    res.status(200).json({
      status: "success",
      data: transactions
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


export {
    createDeposit,
    getallDeposit,
    getDepositById,
    createWithdrawal,
    getallWithdrawal,
    getWithdrawalById,
    historyTransaction,
}