import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.interface';


//Es el primer componente que Angular carga cuando se inicia la aplicación 
//y sirve como punto de entrada para todos los demás componentes y vistas.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',//aca se renderiza cualquier componente
  styleUrl: './app.component.scss'
})
export class AppComponent{
  constructor(
   private userService: UserService
  ){}


}
