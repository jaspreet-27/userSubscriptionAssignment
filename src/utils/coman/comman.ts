// src/utils/commonFunctions.ts

import { Response } from 'express';
import * as Yup from 'yup';
import { StatusCode } from '../message/message';

/**
 * Function to handle Yup validation errors.
 * @param error - The error thrown by Yup.
 * @param res - The Express response object.
 */
export const handleValidationError = (error: Yup.ValidationError, res: Response) => {
  // Extract only the messages from the validation errors
  const validationErrors = error.errors;

  return res.status(StatusCode.badRequest).json({
    message: 'Validation errors occurred',
    errors: validationErrors,
  });
};
