import { Response } from "express";

export const hasDrizzzzzleError = function <T>(
  drizzzzzleError: PostgresError | undefined,
  result: Array<T> | undefined,
  res: Response,
  fallbackMessage: string | null,
  statusCode: number | null
) {
  
  if (drizzzzzleError || !result || result.length === 0) {
    res
      .status(500)
      .json({
        error: drizzzzzleError ? drizzzzzleError.message : fallbackMessage ?? "Internal server error. Please try again later",
      });
    return null;
  }
  return result;
};
