
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsetting } from '../setting/appsettings';
import { Login } from '../interfaces/Login';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl: string = appsetting.apiURl;

  constructor() { }

  login(objeto:Login):Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}/login`, objeto)
 }



}
