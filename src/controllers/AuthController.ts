import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
const axios = require("axios");
import config from "../config/config";
import { user as userEntity, user } from "../entity/user";
import { record } from "../entity/record";
import { recordsCount } from "../index";

const BACKINGTRACK = "BACKING TRACK";
const CROW_RECORD = "CROWD RECORD";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("O campo usuário e senha são obrigatórios");
      return;
    }
    const userRepository = getRepository(userEntity);
    let foundUser: userEntity;
    try {
      foundUser = await userRepository.findOneOrFail({
        where: { email: email }
      });
    } catch (error) {
      res.status(401).send("Usuário não encontrado");
      return;
    }
    //Check if encrypted password match
    if (!foundUser.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send("Usuário ou senha inválidos");
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign({ userId: foundUser.idUser }, config.jwtSecret, {
      expiresIn: "1h"
    });

    //Send the jwt in the response

    res.send(
      createResponse({
        token: token,
        name: foundUser.firstName,
        foundRecord: "FOUND RECORD" //TODO
      })
    );
  };
  static signUp = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password, firstName, lastName } = req.body;

    if (!(email && password && firstName)) {
      res.status(400).send("Todos os campos são obrigatórios!");
      return;
    }
    const userRepository = getRepository(userEntity);
    let foundUser: userEntity;

    foundUser = await userRepository.findOne({
      where: { email }
    });

    if (foundUser) {
      res.status(401).send("Já existe um usuário cadastrado com este e-mail!");
      return;
    }

    let newUser = new userEntity();
    newUser.firstName = firstName;
    newUser.email = email;
    newUser.password = password;
    newUser.hashPassword();

    let recordsCount: number;
    const recordsRepository = getRepository(record);
    try {
      const list = await recordsRepository.find({});
      recordsCount = list.length;
    } catch (error) {
      res.status(500).send("Erro interno no servidor");
      return;
    }

    newUser = await userRepository.save(newUser);

    //Sing JWT, valid for 1 hour
    const token = jwt.sign({ userId: newUser.idUser }, config.jwtSecret, {
      expiresIn: "1h"
    });

    //Send the jwt in the response

    res.send(
      createResponse({
        token: token,
        name: newUser.firstName,
        foundRecord: "FOUND RECORD" //TODO
      })
    );
  };
  static loginFb = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { token, facebookId } = req.body;

    if (!token) {
      res.status(400).send("Bad request");
      return;
    }
    const userRepository = getRepository(userEntity);
    let foundUser: userEntity;

    foundUser = await userRepository.findOne({
      where: {
        facebookId
      }
    });

    axios
      .get(
        `https://graph.facebook.com/${facebookId}?fields=name&access_token=${token}`
      )
      .then(async response => {
        if (foundUser) {
          const tokenJwt = jwt.sign(
            {
              userId: foundUser.idUser
            },
            config.jwtSecret,
            {
              expiresIn: "1h"
            }
          );
          res.send(
            createResponse({
              token: tokenJwt,
              name: foundUser.firstName,
              foundRecord: "FOUND RECORD" //TODO
            })
          );
        } else {
          //didnt find user
          let newUser = new user();
          // console.log(response.data)
          const name = response.data.name;
          newUser.firstName = name;
          newUser.facebookId = facebookId;

          newUser = await userRepository.save(newUser);

          //Sing JWT, valid for 1 hour
          const tokenJwt = jwt.sign(
            {
              userId: newUser.idUser
            },
            config.jwtSecret,
            {
              expiresIn: "1h"
            }
          );

          //Send the jwt in the response

          res.send(
            createResponse({
              token: tokenJwt,
              name: name
            })
          );
          return;
        }
      })
      .catch(error => {
        res.status(400).send("Facebook token inválido");
        return;
      });
  };
  static loginGoogle = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { name, googleId } = req.body;

    if (!name || !googleId) {
      res.status(400).send("Bad request");
      return;
    }
    const userRepository = getRepository(userEntity);
    let foundUser: userEntity;

    foundUser = await userRepository.findOne({
      where: {
        googleId
      }
    });

    let recordsCount: number;
    const recordsRepository = getRepository(record);
    try {
      const list = await recordsRepository.find({});
      recordsCount = list.length;
    } catch (error) {
      res.status(500).send("Erro interno no servidor");
      return;
    }

    if (foundUser) {
      const tokenJwt = jwt.sign(
        {
          userId: foundUser.idUser
        },
        config.jwtSecret,
        {
          expiresIn: "1h"
        }
      );
      res.send(
        createResponse({
          token: tokenJwt,
          name: name,
          foundRecord: "FOUND RECORD" //TODO
        })
      );
      return;
    } else {
      //didnt find user
      let newUser = new user();
      // console.log(response.data)
      newUser.firstName = name;
      newUser.googleId = googleId;

      newUser = await userRepository.save(newUser);

      //Sing JWT, valid for 1 hour
      const tokenJwt = jwt.sign(
        {
          userId: newUser.idUser
        },
        config.jwtSecret,
        {
          expiresIn: "1h"
        }
      );

      //Send the jwt in the response

      res.send(
        createResponse({
          token: tokenJwt,
          name: name
        })
      );
      return;
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
      return;
    }

    //Get user from the database
    const userRepository = getRepository(userEntity);
    let foundUser: userEntity;
    try {
      foundUser = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }
    if (foundUser == undefined || foundUser == null) {
      res.status(401).send();
      return;
    }

    try {
      //Check if old password matchs
      if (!foundUser.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
      }
    } catch (id) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    foundUser.password = newPassword;
    const errors = await validate(foundUser);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    foundUser.hashPassword();
    userRepository.save(foundUser);

    res.status(204).send();
  };
}

const createResponse = (obj: object) => {
  return {
    ...obj,
    backingtrack: BACKINGTRACK,
    crowdRecord: CROW_RECORD,
    countRecords: recordsCount
  };
};
export default AuthController;
