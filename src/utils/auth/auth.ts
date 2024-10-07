import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extending the Request interface to allow adding custom properties like `user`
interface AuthenticatedRequest extends Request {
  user?: string | object; // Add user info after verifying the token
}

export function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Get the Authorization header
  const bearerHeader = req.headers?.['authorization'];

  if (bearerHeader) {
    // Split the 'Bearer <token>'
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
      const secretKey = process.env.TOKEN_KEY;

      if (!secretKey) {
        throw new Error('TOKEN_KEY is not defined in the environment variables.');
      }

      // Verify the token
      const decoded = jwt.verify(token, secretKey);

      // Save the decoded data (like user info) to the request object
      req.user = decoded;

      // Proceed to the next middleware/controller
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    // No Authorization header
    return res.status(401).json({ message: 'Authorization header missing' });
  }
}
