import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  constructor(
    private router:Router
  ){}

  navigateToUsers(){
    console.log('Navegando a la lista de usuarios');
    this.router.navigate(['usuarios']);
  }

  navigateToProducts() {
    this.router.navigate(['inventario']); // Redirige a la gestión de productos
  }

  logout() {
    localStorage.removeItem('token'); // Borra el token
    this.router.navigate(['/login']); // Redirige al inicio de sesión
  }


}
