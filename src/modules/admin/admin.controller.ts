import autoBind from "auto-bind";
import {Request, Response} from "express";
import {RegisterDTO} from "../auth/auth.interface";
import {AdminService} from "./admin.service";

export class AdminController {
  private adminService = new AdminService();
  constructor() {
    autoBind(this);
  }

  public onboarding = async (req: Request, res: Response) => {
    const dto = req.body as RegisterDTO;
    const response = await this.adminService.onboarding(dto);
    res.status(response.status_code).json(response);
  };
}
