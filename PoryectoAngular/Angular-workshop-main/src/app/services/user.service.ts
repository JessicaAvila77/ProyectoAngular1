import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { User, UserResponse } from '../models/user.interface';
import { User, UserResponse, UserMsj } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000';
  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(){
    return this.httpClient.get<User[]>(this.API_URL+'/usuarios')
  }

  getUser(id: number){
    return this.httpClient.get<UserResponse>(this.API_URL+'/usuarios/'+id)
  }

  saveUser(user:User){
    return this.httpClient.post<UserResponse>(this.API_URL+'/usuarios',user)
  }

  getNextId(){
    return this.httpClient.get<number>(this.API_URL+'/usuarios-nextid')
  }

  deleteUser(id: number){
    return this.httpClient.delete(this.API_URL+"/usuarios/"+id)
  }

  updateUser(id: number, user: User) {
    return this.httpClient.put<UserMsj>(`${this.API_URL}/usuarios/${id}`, user);
  }

 


}
