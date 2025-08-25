import autoBind from "auto-bind";
import {Request, Response} from "express";
import {BureauService} from "./bureau.service";

export class BureauController {
  private service = new BureauService();

  constructor() {
    autoBind(this);
  }

  public check = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await this.service.check(userId);
    res.status(result.status_code).json(result);
  };
}
