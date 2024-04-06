interface ErrorDisplayType {
  statusCode?: number;
  message: string;
}

export const errorHandler = (statusCode: number, message: string) => {
  const error: ErrorDisplayType = new Error();

  error.statusCode = statusCode;
  error.message = message;

  return error;
};
