import type {Request, Response, NextFunction} from "express";
import {ApiError} from "../utils/api.response.utils";
import {prisma} from "../server";
import {Role} from "../../generated/prisma";

export async function authorizeInsightOwnerOrAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (!user) return next(ApiError.unauthorized("Unauthenticated"));

  const {id} = req.params;
  if (!id) return next(ApiError.notFound("Insight id is required"));

  const insight = await prisma.insight.findUnique({where: {id}});
  if (!insight) return next(ApiError.notFound("Insight not found"));

  const isOwner = insight.userId === user.id;
  const isAdmin = user.role === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    return next(ApiError.badRequest("You do not have access to this insight"));
  }

  // req.insight = insight;
  return next();
}
