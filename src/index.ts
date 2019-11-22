import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import { record } from "./entity/record";
const PORT = 3001;

//Connects to the Database -> then starts the express
export var recordsCount = 0;

export const increaseRecords = () => {
  recordsCount += 1;
};
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    const recordsRepository = getRepository(record);
    const list = await recordsRepository.find({});
    recordsCount = list.length;

    //Set all routes from routes folder
    app.use("/", routes);
    app.listen(PORT, () => {
      console.log(
        `Server started on port ${PORT}! There are ${recordsCount} records.`
      );
    });
  })
  .catch(error => console.log(error));
