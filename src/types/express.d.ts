import type {UploadedFile} from "express-fileupload";
import {AuthenticatedUser} from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      files?: {
        image?: UploadedFile | UploadedFile[];
        [key: string]: UploadedFile | UploadedFile[] | undefined;
      };
      scopeFilter?: Record<string, any>;
    }
  }
}
