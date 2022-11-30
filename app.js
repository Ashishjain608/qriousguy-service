const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const { Trade } = require("./db/tradeModal");
const { AccountTracker } = require("./db/tradeModal");

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, e) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.get("/logtrade/getAllTrades", async (request, response, e) => {
  const allTrades = await Trade.find();
  response.status(200).send(allTrades);
});

app.post("/logtrade/addTradeDetails", (request, response, e) => {
  const payload = request.body;
  const tradeItem = new Trade({
    trade_date: new Date(Date.now()).toISOString(),
    quantity: payload.quantity,
    buy_price: payload.buy_price,
    sell_price: payload.sell_price,
    pnl: payload.pnl,
    comment: payload.comment,
    learning: payload.learning,
    is_overtrade: payload.is_overtrade,
    is_trade_booked: payload.is_trade_booked,
  });

  console.log(tradeItem);

  tradeItem
    .save()
    .then((result) => {
      response.status(201).send({
        message: "Trade Added Successfully",
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send({
        message: "Error creating trade",
        error,
      });
    });
});

app.put(
  "/logtrade/updateTradeDetails/:trade_id",
  async (request, response, e) => {
    const payload = request.body;
    const selectedItem = await Trade.findOne({
      _id: request.params.trade_id,
    });
    console.log(selectedItem);
    console.log("payload", payload);
    const updatedData = {
      quantity: payload.quantity || selectedItem.quantity,
      buy_price: payload.buy_price || selectedItem.buy_price,
      sell_price: payload.sell_price || selectedItem.sell_price,
      pnl: payload.pnl || selectedItem.pnl,
      comment: payload.comment || selectedItem.comment,
      learning: payload.learning || selectedItem.learning,
      is_overtrade:
        payload.is_overtrade !== undefined
          ? payload.is_overtrade
          : selectedItem.is_overtrade,
      is_trade_booked:
        payload.is_trade_booked !== undefined
          ? payload.is_trade_booked
          : selectedItem.is_trade_booked,
    };

    Trade.findOneAndUpdate(
      {
        _id: request.params.trade_id,
      },
      updatedData,
      { returnDocument: "after" }
    )
      .then((result) => {
        response.status(200).send({
          message: "Trade Updated Successfully",
          result,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).send({
          message: "Error updating trade",
          error,
        });
      });
  }
);

module.exports = app;
