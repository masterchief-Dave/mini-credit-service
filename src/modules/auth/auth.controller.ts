import autoBind from "auto-bind";
import {AuthService} from "./auth.service";
import {Request, Response} from "express";
import {LoginDTO, RegisterDTO, VerifyOTPDTO} from "./auth.interface";
import {env} from "../../utils/env-config.utils";

export class AuthController {
  private authService = new AuthService();
  constructor() {
    autoBind(this);
  }

  public login = async (req: Request, res: Response) => {
    const dto = req.body as LoginDTO;
    const response = await this.authService.login(dto);

    res.cookie("accessToken", response.data.token.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });
    res.status(response.status_code).json(response);
  };

  public register = async (req: Request, res: Response) => {
    const dto = req.body as RegisterDTO;
    const response = await this.authService.register(dto);
    res.status(response.status_code).json(response);
  };

  public verifyOTp = async (req: Request, res: Response) => {
    const dto = req.body as VerifyOTPDTO;
    const response = await this.authService.verifyOTP(dto);
    res.status(response.status_code).json(response);
  };

  public validateUser = async (req: Request, res: Response) => {};

  public onboarding = async () => {};

  public logout = async () => {};
}
