import Transaction from '../models/transaction.model.js';
import OrderHistory from '../models/orderhistory.model.js';

// Get dashboard data for the logged-in user
export const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total Deposit
    const totalDeposit = await Transaction.aggregate([
      { $match: { userId, type: 'DEPOSIT', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const deposit = totalDeposit[0]?.total || 0;

    // Total Withdrawals
    const totalWithdrawals = await Transaction.aggregate([
      { $match: { userId, type: 'WITHDRAWAL', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const withdrawals = totalWithdrawals[0]?.total || 0;

    // Account Balance
    const accountBalance = deposit - withdrawals;

    // Order Investment
    const orderInvestmentAgg = await OrderHistory.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$tradeAmount' } } }
    ]);
    const orderInvestment = orderInvestmentAgg[0]?.total || 0;

    // Profit/Loss
    const profitLossAgg = await OrderHistory.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$profitLoss' } } }
    ]);
    const profitLoss = profitLossAgg[0]?.total || 0;

    // TODO: Calculate percentage changes vs last month if needed

    res.json({
      accountBalance,
      totalDeposit: deposit,
      totalWithdrawals: withdrawals,
      profitLoss,
      orderInvestment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};


export const getalltransationhistory = async (req,res)=>{
  
}