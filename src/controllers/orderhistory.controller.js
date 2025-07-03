import { OrderHistory } from "../models/orderhistory.model.js";
import { User } from "../models/user.model.js";

const totalTrade = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const orders = await OrderHistory.find({ userId });
        
        res.status(200).json({
            status: "success",
            data: orders.length
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const totalInvestment = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const orders = await OrderHistory.find({ userId });
        
        let totalInvestment = 0;
        orders.forEach(order => {
            totalInvestment += order.tradeAmount;
        });
        
        res.status(200).json({
            status: "success",
            data: totalInvestment
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}
const totalProfitLoss = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const orders = await OrderHistory.find({ userId });
        
        let totalProfitLoss = 0;
        orders.forEach(order => {
            if (order.profitLoss) {
                totalProfitLoss += order.profitLoss;
            }
        });
        
        res.status(200).json({
            status: "success",
            data: totalProfitLoss
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}
const historyOrder = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const orders = await OrderHistory.find({ userId },
            {
                userId: 1,
                tradeDate: 1,
                symbol: 1,
                quantity: 1,
                buyPrice: 1,
                sellPrice: 1,
                type: 1,
                status: 1,
                profitLoss: 1,
                tradeAmount: 1,
                createdAt: 1
            }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: orders
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}



//OPEN orders to sell
const requesttoSell = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const orders = await OrderHistory.find({ userId, status: 'OPEN' },
            {
                userId: 1,
                tradeDate: 1,
                symbol: 1,
                quantity: 1,
                buyPrice: 1,
                sellPrice: 1,
                type: 1,
                status: 1,
                profitLoss: 1,
                tradeAmount: 1,
                createdAt: 1
            }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No open orders found"
            })
        }
        
        res.status(200).json({
            status: "Success",
            message: "Open orders for sell",
            data: orders
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

//PENDING_SELL orders to Sell
const requesttoSellPending = async (req, res) => {
    const { userId } = req.params;  //todo: get userId from token
    const { orderId} = req.body;
    if(!orderId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide orderId"
        })
    }
    try {
        const order = await OrderHistory.findOne({ _id: orderId, userId, status: 'OPEN' },
            {
                userId: 1,
                tradeDate: 1,
                symbol: 1,
                quantity: 1,
                buyPrice: 1,
                sellPrice: 1,
                type: 1,
                status: 1,
                profitLoss: 1,
                tradeAmount: 1,
                createdAt: 1
            }).sort({ createdAt: -1 });

        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "No pending sell orders found"
            })
        }

        // Update the order status to 'PENDING_SELL' and save it
        order.status = 'PENDING_SELL';

        await order.save();
        
        res.status(200).json({
            status: "Success",
            message: "Order status updated to PENDING_SELL",
            data: order
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const requesttoBuy = async (req, res) => {
    try {
        const { userId } = req.params;  //todo: get userId from token
        const { symbol, quantity, buyPrice, tradeAmount,tradetype } = req.body;

        if(!symbol || !quantity || !buyPrice || !tradeAmount) {
            return res.status(400).json({
                status: "error",
                message: "Please provide all required fields"
            })
        }
        if(tradetype !== 'LONG' && tradetype !== 'SHORT') {
            return res.status(400).json({
                status: "error",
                message: "Please provide valid trade type"
            })
        }

        if( tradeAmount < 0 ) {
            return res.status(400).json({
                status: "error",
                message: "Please provide valid trade amount"
            })
        }

        if(tradeAmount !== quantity * buyPrice) {
            return res.status(400).json({
                status: "error",
                message: "Trade amount should be equal to quantity * buy price"
            })
        }

        const order = new OrderHistory({
            userId,
            symbol,
            quantity,
            buyPrice,
            tradeAmount,
            type: tradetype,
            tradeDate: new Date(),
            tradeStatus: "PENDING",  
        });

        await order.save();

        res.status(201).json({
            status: "success",
            data: order
        })
        
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


//----------------------- new controllers -----------------------------------------------
const getUserTradeHistory = async (req, res) => {
    const { userId } = req.params;  //todo: get userId from token
    

    try {
        const tradeHistory = await OrderHistory.find({ userId });

        res.status(200).json({
            status: "success",
            data: tradeHistory
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const addtradetobuy = async (req, res) => {
    const { userId } = req.params;  //todo: get userId from token
    const { symbol, quantity, buyPrice, tradeAmount, tradetype } = req.body;



    if(!symbol || !quantity || !buyPrice || !tradeAmount) {
        return res.status(400).json({
            status: "error",
            message: "Please provide all required fields"
        })
    }
    if(tradetype !== 'LONG' && tradetype !== 'SHORT') {
        return res.status(400).json({
            status: "error",
            message: "Please provide valid trade type"
        })
    }

    if( tradeAmount < 0 ) {
        return res.status(400).json({
            status: "error",
            message: "Please provide valid trade amount"
        })
    }

    if(tradeAmount !== quantity * buyPrice) {
        return res.status(400).json({
            status: "error",
            message: "Trade amount should be equal to quantity * buy price"
        })
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }

    try {
        const order = new OrderHistory({
            userId,
            symbol,
            quantity,
            buyPrice,
            tradeAmount,
            type: tradetype,
            tradeDate: new Date(),
            status: "OPEN",  // Initial status is OPEN
        });

        await order.save();

        res.status(201).json({
            status: "success",
            data: order
        });

        user.orderHistory.push(order._id);
        await user.save();
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const addtradetosell = async (req, res) => {
    const { userId } = req.params;  //todo: get userId from token
    const { orderId, sellPrice } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }


    if(!orderId || !sellPrice) {
        return res.status(400).json({
            status: "error",
            message: "Please provide all required fields"
        })
    }

    try {
        const order = await OrderHistory.findById(orderId);
        if(!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found"
            })
        }

        order.sellPrice = sellPrice;
        order.status = "COMPLETED";
        await order.save();

        res.status(200).json({
            status: "success",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}


export  {
    // totalTrade,
    // totalInvestment,
    // totalProfitLoss,
    // historyOrder,
    // requesttoSell,
    // requesttoBuy,
    // requesttoSellPending,

    getUserTradeHistory,
    addtradetobuy,
    addtradetosell,
}