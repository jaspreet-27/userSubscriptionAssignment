// Dynamic Messages Utility
const createMessage = (action: string, value?: string) => {
  if (value) {
    return `${value} ${action} Successfully.`;
  }
  return `${action} Successfully.`;
};

// Success messages
export const SuccessMessages = {
  login: 'Login Successfully.',
  upadate: 'Updated Successfully',
  delete: 'deletd Successfully',
  fetchedAllCodes: createMessage('fetched all codes'),
  fetchedAllTemplates: createMessage('fetched all templates'),
  codesCreated: createMessage('codes Created'),

  create: (value: string) => createMessage('created', value),
};

// Error messages
export const ErrorMessages = {
  somethingWentWrong: 'Something went wrong.',
  internalServerError: 'Internal server error.',
  tokenRequired: 'Auth token is required.',
  tokenExpired: 'Session expired. Please login again.',
  validationError: 'Validation error.',
  unauthorizedUser: 'Unauthorized user.',
  invalidLogin: 'Invalid login request. Please check and try again.',
  wrongPassowrd: 'wrongPassowrd',
  schemaNotVerfied: 'schema is not verified',

  notExist: (value: string) => `${value} does not exist.`,
  alreadyExists: (value: string) => `${value} already exists.`,
  errorLog: (functionName: string, controllerName: string, err: any) => `${functionName} ${controllerName} Error @ ${err}`,
};

// Status codes
export const StatusCode = {
  success: 200,
  created: 201,
  badRequest: 400,
  serverError: 501,
  internalServerError: 500,
  forbidden: 203,
  notFound: 404,
  notAllowed: 205,
  failed: 401,
  emailOrUserExists: 207,
  wrongPassword: 208,
  accountDeactivated: 209,
  authTokenRequired: 499,
  unauthorized: 403,
};
