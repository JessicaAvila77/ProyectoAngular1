import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserResponse } from '../../models/user.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user: User = {
    id: 0,
    nombre: '',
    email: '',
    password: '',
    id_rol: ''
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde la URL
    const userId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    if (userId) {
      this.userService.getUser(userId).subscribe((response: UserResponse) => {
        if (response.mensaje === 'Ok') {
          this.user = response.usuario; // Cargar los datos del usuario
        } else {
          alert('Usuario no encontrado');
          this.router.navigate(['/usuarios']);
        }
      });
    }
  }

  onSubmit(): void {
    console.log(this.user); // Para verificar los datos enviados
    this.userService.updateUser(this.user.id, this.user).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response); // Para depuración
        alert(response.mensaje);
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al guardar los cambios');
      }
    );
  }
}