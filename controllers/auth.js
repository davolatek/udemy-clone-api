import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from 'jsonwebtoken'

export const register = async(req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(422).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(422)
        .send(
          "Password is required and should be minimum of 6 characters long"
        );
    }

    if (!email) return res.status(422).send("Email is required");

    let userExist = await User.findOne({ email }).exec();

    if (userExist) return res.status(422).send("Email already taken");
    

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).send("Error, try again");
  }
};


export const login = async (req, res) =>{
  try {
    const {email, password} = req.body

    const user = await User.findOne({email}).exec()

    if(!user) return res.status(422).send("Invalid Email or Password")

    const isMatch = await comparePassword(password, user.password)

    if(!isMatch) return res.status(422).send("Invalid Email or Password")


    // create signed jwt
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: "7d"})

    // exclude the hashed password

    user.password = undefined;

    // send a cookie response for the token
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true
    })

    res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Error, try again")
  }
}


export const logout = async (req, res) =>{
  try {
    res.clearCookie('token')
    return res.json({message:"User successfully signed out"})
  } catch (error) {
    console.log(error)
  }
}
