import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from '../../services/acceso.service.';
import { Login } from '../../interfaces/Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  private formBuil = inject(FormBuilder); //recibir las credenciales

  //utilice los mismos del create componente
  public formLogin:FormGroup = this.formBuil.group({
    email : ['', [Validators.required, Validators.email]],
    password : ['', [Validators.required]],

  })
  
  public errorMessage: string | null = null;

  iniciarSesion(){
    if(this.formLogin.invalid) return; //si le falta algun campo

    const objeto:Login = {
      email:this.formLogin.value.email,
      password:this.formLogin.value.password,

    }

    this.accesoService.login(objeto).subscribe({
      next:(data)=>{
        localStorage.setItem('token', data.token)
        this.router.navigate(['menu'])//este path trae el componente de listar home?
      },

      error: (error) => {
        // Mostrar el error si las credenciales son incorrectas
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas, por favor intente nuevamente.';
        } else {
          this.errorMessage = 'Ocurrió un error, intente de nuevo más tarde.';
        }
        console.log(error.message);
      }   

    })

  }


}
