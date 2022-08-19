import User from "../models/User";
import Stripe from "stripe";
import queryString from "query-string";

const stripe = new Stripe(process.env.STRIPE_SECRET);
export const makeInstructor = async (req, res) => {
  try {
    //check if user has a stripe id

    const user = await User.findById({ _id: req.body.userId }).exec();

    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });

      User.findByIdAndUpdate(
        req.body.userId,
        {
          stripe_account_id: account.id,
        },
        { new: true }
      ).exec(async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // create account link

          console.log("Result", result);

          let accountLink = await stripe.accountLinks.create({
            account: account.id,
            return_url: process.env.STRIPE_CALLBACK_URL,
            refresh_url: process.env.STRIPE_CALLBACK_URL,
            type: "account_onboarding",
          });

          accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email,
          });

          // send the link generated on stripe to the frontend as a response using the query string

          res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
        }
      });
    } else {
      res.status(400).send("You are already an instructor");
    }
  } catch (error) {
    console.log(error);
  }
};
