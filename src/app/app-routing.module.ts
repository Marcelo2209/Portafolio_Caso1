import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdministrarUsuariosComponent } from './admin/administrar-usuarios/administrar-usuarios.component';
import { BuscadorUsuariosComponent } from './admin/buscador-usuarios/buscador-usuarios.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  
 
  
  { path: 'administrar-usuarios/:rut', component: AdministrarUsuariosComponent }, // Cambia a minúscula
  { path: 'buscador', component: BuscadorUsuariosComponent },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
