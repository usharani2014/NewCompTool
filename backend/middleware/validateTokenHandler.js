import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {users} from "../models/UserModel.js";

const isUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized user" });
  
  try {

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await users.findOneByEmail(decodedToken.id );

    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    req.accessToken = token;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    return res.status(401).json({ message: "Invalid token" || error.message });
  }
});

const isAdmin = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'User is not authorized or token is missing' });
  }
  try {
    token = authHeader.split(" ")[1];
    if (token === 'null' || !token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }

    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verifiedUser) return res.status(401).send('Unauthorized request');

    req.userId = verifiedUser.id;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

export { isUser, isAdmin };
