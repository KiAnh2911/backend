import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { DataStoreInToken } from '@modules/auth';
import { Logger } from '@core/utils';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const users = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '') as DataStoreInToken;

    if (!req.user) req.user = { id: '' };

    req.user.id = users.id;
    next();
  } catch (error) {
    Logger.error(`[ERROR] Msg : ${token}`);
    if (error == 'TokenExpiredError') {
      res.status(401).json({ message: 'Token is expired' });
    } else {
      res.status(401).json({ message: 'Token is not valid' });
    }
  }
};

export default authMiddleware;
