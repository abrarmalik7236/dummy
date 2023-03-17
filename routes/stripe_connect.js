var config = require("../env");
const port = process.env.PORT || 8080;
const stripe = require("stripe")(
  "sk_test_51Mbj53B6ei90CxjaRTe5Juh3MFL9coJOleIiP254XGsJFnU4dVpiPW1E3ABMxVaug2vfxmehgqmFVtWCPs3nLHK8000MRyUaIT"
);
//const host = port;
const host = "https://movetime.herokuapp.com";
const stripeAccount = async (req, res) => {
    const account = await stripe.accounts.create({
      type: "express",
    })
    const accountLinks = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${host}/reauth?account_id=${account.id}`,
      return_url: `${host}/account_id=${account.id}`,
      // `${host}/register${mobile ? "-mobile" : ""}?account_id=${
      //   account.id
      // }&result=success`,
      type: "account_onboarding",
    })
   // if (mobile) {
      // In case of request generated from the flutter app, return a json response
      res.status(200).json({ success: true, url: accountLinks.url });
   // } else {
    //  res.status(200).json({ success: true, url: accountLinks.url });
    //}

};

module.exports = stripeAccount;
