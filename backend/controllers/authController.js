import bcrypt from 'bcrypt';
import {users} from '../models/UserModel.js';
import { COOKIE_OPTIONS } from '../constants/apiConstants.js';
import generateAccessToken from '../utils/tokenGeneration.js';

const registerUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !department) {
    return res.status(400).json({
      message: "All fields are mandatory!",
    });
  }

  try {
    const existingUser = await users.findOneByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already registered!" });
    }

    const newUser = await users.create({
      name,
      email,
      password,
      department,
      position: role,
      verified: false,
    });

    return res
      .status(201)
      .json({
        message: "User registered successfully",
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  try {
    const user = await users.findOneByEmail(email);
    console.log(user);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const accessToken = generateAccessToken(user.email);

    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .json({
        message: "User login successful",
        accessToken,
        user: { id: user.id, email: user.email, position: user.position, department: user.department },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLogout = async (_, res) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken", COOKIE_OPTIONS)
      .json({ message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerUser, loginUser, userLogout };
