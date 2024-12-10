import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User, UserResponse } from '../../models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  //user!: User;

  user: User = {
    id: 0,
    nombre: '',
    email: '',
    password: '',
    id_rol: ''
  };

  constructor(
    private userService: UserService,
    private ActivedRouted: ActivatedRoute,
    private router:Router
  ){}

  ngOnInit(): void {
    let id = this.ActivedRouted.snapshot.paramMap.get('id') || '';
  
    this.userService.getUser(parseInt(id)).subscribe((response: UserResponse)=>{
      if(response.mensaje === 'Ok'){
        this.user = response.usuario
      }else{
        alert("Usuario no encontrado")
      }
    }, )

    
  }

  regresar(): void {
    this.router.navigate(['/usuarios']); 
  }
  


}
