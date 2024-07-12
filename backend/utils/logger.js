import fs from "fs";
import pino from "pino";
import pretty from "pino-pretty";

const logStream = fs.createWriteStream("errors.log", { flags: "a" });

const fileLogger = pino({}, logStream);

const consoleLogger = pino(pretty());

export { fileLogger, consoleLogger };
