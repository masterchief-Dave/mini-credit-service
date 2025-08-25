import type {NextFunction, Request, RequestHandler, Response} from "express";
import {Role} from "../../generated/prisma";

export const authorize =
  (...allowedRoles: Role[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !user.role) {
      res.status(401).json({error: "Not authenticated"});
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({error: "Forbidden: insufficient permissions"});
      return;
    }

    next();
  };
