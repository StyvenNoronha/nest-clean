import {Body,ConflictException,Controller,HttpCode,Post,} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import bcrypt from "bcryptjs";

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        "Usuário com o mesmo endereço de e-mail já existe.."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
