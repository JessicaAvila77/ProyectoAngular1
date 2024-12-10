import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { authGuard } from './custon/auth.guard';

//Contiene la definición de las rutas y los componentes asociados, 
//permitiendo la navegación entre las diferentes vistas de la aplicación.

const routes: Routes = [

  
  {path: 'login', component:LoginComponent},

  {path: 'menu', component: MenuComponent, canActivate:[authGuard]}, 

  {path: 'usuarios', component: UserListComponent, canActivate:[authGuard]},
  
  {path:'inventario', component: ProductListComponent, canActivate:[authGuard]},

  {path: 'user-detail/:id', component: UserDetailComponent},
   
  {path: 'user-create', component: UserCreateComponent}, 
  
  {path: 'user-edit/:id', component: UserEditComponent},

  {path: 'product-create', component: ProductCreateComponent}, 

  {path: 'product-edit/:id', component: ProductEditComponent}, 

  {path: 'product-detail/:id', component: ProductDetailComponent},

  {path: '', component:LoginComponent},
  
  { path: "**", redirectTo: ''},
    
  


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
