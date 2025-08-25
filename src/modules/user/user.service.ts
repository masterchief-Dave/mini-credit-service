import autoBind from "auto-bind";
import {prisma} from "../../db/prisma";
import {hashPassword} from "../../utils/validation.utils";
import {RegisterDTO} from "../auth/auth.interface";
import {Role} from "../../../generated/prisma";

export class UserService {
  constructor() {
    autoBind(this);
  }

  public findUser = async (type: "id" | "email", value: string) => {
    if (type === "id") {
      return await prisma.user.findUnique({where: {id: value}});
    } else if (type === "email") {
      return await prisma.user.findUnique({where: {email: value}});
    }
  };

  public createUser = async (dto: RegisterDTO & {isVerified?: boolean}) => {
    const hashedPassword = await hashPassword(dto.password);
    const newUser = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role: Role.USER,
      isVerified: dto.isVerified ? true : false,
    };

    const user = await prisma.user.create({
      data: {
        ...newUser,
      },
    });

    return user;
  };
}
