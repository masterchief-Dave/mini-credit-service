import autoBind from "auto-bind";
import {Request, Response} from "express";
import {
  normalizeRunInsightsBody,
  RunInsightsBodyDTO,
} from "./insight.interface";
import {InsightService} from "./insight.service";
import {AuthenticatedUser} from "../user/user.interface";

export class InsightController {
  private service = new InsightService();
  constructor() {
    autoBind(this);
  }

  public run = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const body = req.body as RunInsightsBodyDTO;
    const normalized = normalizeRunInsightsBody(userId, body);
    const result = await this.service.run(normalized, userId);
    res.status(result.status_code).json(result);
  };

  public getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = req.user as AuthenticatedUser;
    const result = await this.service.getById(id, user);
    res.status(result.status_code).json(result);
  };
}
