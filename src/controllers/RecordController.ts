import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import config from "../config/config";
import { user } from "../entity/user";
import { recordsCount, increaseRecords } from "../index";

class RecordController {
  static postRecord = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(user);
    let foundUser: user;
    try {
      foundUser = await userRepository.findOneOrFail(id);
    } catch (err) {
      res.status(401).send("Usuário não encontrado");
      return;
    }

    //TODO: Generate unique file name
    increaseRecords();

    const file = `${__dirname}/records/dramaticpenguin.MOV`;
    res.download(file); // Set disposition and send it.
  };
}
export default RecordController;
