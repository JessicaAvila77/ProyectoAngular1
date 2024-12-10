import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users!: User[]

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  //obtiene los usuarios para mostrar en el html del componente
  ngOnInit(): void {
    this.userService.getUsers().subscribe((usersR: User[])=>{
      this.users = usersR
    })
  }

  llevameAlDetalle(userId: number){
    this.router.navigate(['user-detail/', userId])
  }

  navegarUsuario(){
    this.router.navigate(['user-create/'])

  }

  eliminarUsuario(id: number){
    this.userService.deleteUser(id).subscribe((res: any) => {
      console.log(res.mensaje)
      alert(`Usuario con id ${id} eliminado`)
      this.userService.getUsers().subscribe((usersR: User[]) => {
        this.users = usersR
      });
     
    })
  }

  
  editarUsuario(id: number): void{
    console.log('ID del usuario:', id); 
    this.router.navigate(['user-edit/', id])
  }

  regresar(): void {
    this.router.navigate(['/menu']); 
  }

}
