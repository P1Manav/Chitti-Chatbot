import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const secret = process.env.JWT_SECRET;
    
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[COOKIE_NAME];
  
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return new Promise<void>((resolve, reject) => {
    jwt.verify(token, secret, (err: Error | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        res.locals.jwtData = decoded;
        resolve();
        return next();
      }
    });
  });
};
