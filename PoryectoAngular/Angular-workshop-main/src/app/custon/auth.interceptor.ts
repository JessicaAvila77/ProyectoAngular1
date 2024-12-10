import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
   // Obtener el token del localStorage
   const token = localStorage.getItem('token');

   // Si el token existe, clonar la solicitud y agregar el encabezado Authorization
   const authReq = token
     ? req.clone({
         setHeaders: {
           Authorization: `Bearer ${token}`,
         },
       })
     : req; // Si no hay token, la solicitud no se modifica.
 
   // Pasar la solicitud al siguiente manejador
   return next(authReq);
};
