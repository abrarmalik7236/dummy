
const stripe = require("stripe")("sk_test_51Mbj53B6ei90CxjaRTe5Juh3MFL9coJOleIiP254XGsJFnU4dVpiPW1E3ABMxVaug2vfxmehgqmFVtWCPs3nLHK8000MRyUaIT")
const host = "https://movetime.herokuapp.com";


const stripeReAuth = async (req, res) => {
  const { account_id: accountId } = req.query

  const accountLinks = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${host}/reauth?account_id=${accountId}`,
    return_url:`${host}/account_id=${accountId}`,
    
    
   // //`${host}/register?account_id=${accountId}`,
    type: "account_onboarding",
  })
  res.redirect(accountLinks.url)
}

module.exports = stripeReAuth