const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
    trade_date:{ type: Date, default: Date.now },
    equipment: String,
    quantity: Number,
    buy_price: Number,
    sell_price: Number,
    pnl: Number,
    comment: String,
    learning: String,
    is_overtrade: Boolean,
    is_trade_booked: Boolean
})

const AccountTrackerSchema = new mongoose.Schema({
    trade_date:{ type: Date, default: Date.now },
    starting_balance: Number,
    pnl: Number,
    brokerage: Number,
    actual_pnl: Number,
    credit_debit: Number
})

module.exports = {
    Trade: mongoose.model.Trade || mongoose.model("Trade", TradeSchema),
    AccountTracker: mongoose.model.AccountTracker || mongoose.model("AccountTracker", AccountTrackerSchema),
}