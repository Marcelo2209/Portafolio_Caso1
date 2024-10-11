import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { IonicModule } from '@ionic/angular';
import { AdministrarActividadesComponent } from './administrar-actividades/administrar-actividades.component';
import { AdministrarEspaciosPublicosComponent } from './administrar-espacios-publicos/administrar-espacios-publicos.component';
import { AdministrarProyectosComponent } from './administrar-proyectos/administrar-proyectos.component';
import { AdministrarUsuariosComponent } from './administrar-usuarios/administrar-usuarios.component';
import { BuscadorActividadesComponent } from './buscador-actividades/buscador-actividades.component';
import { BuscadorEspaciosPublicosComponent } from './buscador-espacios-publicos/buscador-espacios-publicos.component';
import { BuscadorProyectosComponent } from './buscador-proyectos/buscador-proyectos.component';
import { BuscadorUsuariosComponent } from './buscador-usuarios/buscador-usuarios.component';
import { BuscadorNoticiasComponent } from './buscador-noticias/buscador-noticias.component';
import { AdministrarNoticiasComponent } from './administrar-noticias/administrar-noticias.component';
import { EditarUsuariosComponent } from './editar-usuarios/editar-usuarios.component';


@NgModule({
  declarations: [
    AdministrarActividadesComponent,
    AdministrarEspaciosPublicosComponent,
    AdministrarProyectosComponent,
    AdministrarUsuariosComponent,
    AdministrarNoticiasComponent,

    BuscadorActividadesComponent,
    BuscadorEspaciosPublicosComponent,
    BuscadorProyectosComponent,
    BuscadorUsuariosComponent,
    BuscadorNoticiasComponent,

    EditarUsuariosComponent,
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    IonicModule 
  ]
})
export class AdminModule { }
