import autoBind from "auto-bind";
import {Request, Response} from "express";
import {UploadedFile} from "express-fileupload";
import {ApiError} from "../../utils/api.response.utils";
import {StatementsService} from "./statements.service";

export class StatementsController {
  private service = new StatementsService();
  constructor() {
    autoBind(this);
  }

  public upload = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) throw ApiError.unauthorized("Unauthenticated");

    if (!req.files || !("file" in req.files)) {
      throw ApiError.badRequest("CSV file is required with field name 'file'");
    }
    const file = req.files.file as UploadedFile;

    const statementName =
      (req.body?.statementName as string | undefined) || undefined;

    const report = await this.service.uploadCsv({file, userId, statementName});

    res.status(report.status_code).json(report);
  };
}
