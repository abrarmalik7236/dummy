// pages/api/stripe/account/index.js
const stripe = require("stripe")(
    "sk_test_51Mbj53B6ei90CxjaRTe5Juh3MFL9coJOleIiP254XGsJFnU4dVpiPW1E3ABMxVaug2vfxmehgqmFVtWCPs3nLHK8000MRyUaIT"
  );
 // const host = "http://192.168.1.180:8080";
  
  const stripeTransfer = async (req, res) => {
    // await stripe.transfers.create({
    //   amount: 20.00,
    //   currency: "sek",
    //   destination: "acct_1MkpcZPVIWOUUYkE",
    // });
  
    // res.status(200).json({ success: true, data: res });
    const { method } = req;
   // if (method === "GET") {
      // CREATE CONNECTED ACCOUNT
   
  
      await stripe.transfers.create({
  
            amount:req.body.amount,
      currency: "sek",
      destination: req.body.destination,
       // type: "express",
  
      }).then((value)=>{
        res.json({
            status: "success",
            data: value,
          });
        }).catch((err) => {
          res.json({
            status: "failed",
            data: err,
          });
      });
  
   // }
  };
  
  module.exports = stripeTransfer;
  