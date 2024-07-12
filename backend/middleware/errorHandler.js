import { consoleLogger, fileLogger } from "../utils/logger.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, _) => {
  const statusCode = error?.statusCode || 500;
  fileLogger.error({
    type: error?.name,
    request: {
      url: req?.originalUrl,
      method: req?.method,
      body: req?.body,
      params: req?.params,
      query: req?.query,
    },
    message: error?.message,
    stack: error?.stack,
    statusCode,
  });
  res.status(statusCode).json({ message: error?.message, stack: error?.stack });
};

const uncaughtException = () => {
  process.on("uncaughtException", (err) => {
    fileLogger.error(err);
    consoleLogger.error(err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    fileLogger.error(err);
    consoleLogger.error(err);
    process.exit(1);
  });
};

export { errorHandler, notFound, uncaughtException };
