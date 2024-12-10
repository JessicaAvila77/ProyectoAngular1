import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent implements OnInit{
nextid = 0
  form!: FormGroup
  constructor(
    private fb: FormBuilder,
    private userService : UserService,
    private router:Router

  ){}

  ngOnInit():void{
    this.form = this.fb.group({
      id:[0, [Validators.required]],
      nombre : ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]],
      id_rol : ['', [Validators.required]]

    })

    this.userService.getNextId().subscribe(nuevoId => this.nextid = nuevoId)
   

  }

  crearUsuario(){
    if (this.form.invalid) {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
      // Muestra una alerta
      alert('Por favor, completa todos los campos requeridos.');
      return; // Detiene la ejecución del método
    }


    this.form.get('id')?.setValue(this.nextid)
    this.userService.saveUser(this.form.value).subscribe((res: UserResponse)=>{
      console.log(res.usuario)
      this.router.navigate(['usuarios'])
    })

  }

  

}
