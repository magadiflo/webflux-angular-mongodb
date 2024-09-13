export const optimisticLockingDefaultMessage = 'Estás intentando modificar una versión desactualizada de este recurso. Actualiza los datos.';
export const serverErrorDefaultMessage = 'Error del servidor. Si el error persiste, por favor, contacta con el soporte.';

export interface HttpStatusCodeMessage {
  http?: string;
  message: string;
}

export const loadCodes = (): HttpStatusCodeMessage[] => {
  const errors: HttpStatusCodeMessage[] = [];

  errors[400] = {
    http: 'Bad Request',
    message: 'Esta solicitud no está correctamente formulada.'
  };
  errors[401] = {
    http: 'Unauthorized',
    message: 'Su autenticación no es válida para acceder a este recurso.'
  };
  errors[403] = {
    http: 'Forbidden',
    message: 'No tienes permiso para acceder a este recurso.'
  };
  errors[404] = {
    http: 'Not Found',
    message: 'El recurso no existe.'
  };
  errors[405] = {
    http: 'Method Not Allowed',
    message: 'La aplicación está intentando acceder a este recurso con el método HTTP incorrecto.'
  };
  errors[406] = {
    http: 'Not Acceptable',
    message: 'La aplicación está intentando acceder a este recurso con el tipo de contenido incorrecto.'
  };
  errors[408] = {
    http: 'Request Timeout',
    message: 'La aplicación intentó llamar al servidor pero se agotó el tiempo de solicitud.'
  };
  errors[409] = {
    http: 'Conflict',
    message: optimisticLockingDefaultMessage,
  };
  errors[412] = {
    http: 'Precondition failed',
    message: optimisticLockingDefaultMessage,
  };
  errors[422] = {
    http: 'Unprocessable Entity',
    message: 'El servidor considera que la validación del recurso no se cumple.'
  };
  errors[500] = {
    http: 'Internal Server Error',
    message: 'Lo sentimos, el servidor no puede procesar esta solicitud.'
  };
  errors[502] = {
    http: 'Bad Gateway',
    message: serverErrorDefaultMessage,
  };
  errors[503] = {
    http: 'Service Unavailable',
    message: serverErrorDefaultMessage,
  };
  errors[504] = {
    http: 'Gateway Timeout',
    message: serverErrorDefaultMessage,
  };

  return errors;
}
