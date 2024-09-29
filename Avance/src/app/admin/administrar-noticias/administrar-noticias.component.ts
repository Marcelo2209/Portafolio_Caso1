import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-administrar-noticias',
  templateUrl: './administrar-noticias.component.html',
  styleUrls: ['./administrar-noticias.component.scss'],
})
export class AdministrarNoticiasComponent implements OnInit {
  id: string | null = null; // Aquí almacenaremos el id de la noticia
  noticiaDetails: any; // Variable para almacenar los detalles de la noticia

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    // Obtener el ID de la noticia desde los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); // Accede al id de la noticia
      console.log('ID de la noticia:', this.id);

      if (this.id) {
        // Cargar los detalles de la noticia
        this.firestoreService.getDoc<any>('noticias', this.id).subscribe(noticia => {
          if (noticia) {
            this.noticiaDetails = noticia;
            console.log('Detalles de la noticia:', this.noticiaDetails);
          } else {
            console.error('Noticia no encontrada');
          }
        }, error => {
          console.error('Error al obtener la noticia:', error);
        });
      }
    });
  }

  // Método para regresar a la lista de noticias
  goBack() {
    this.router.navigate(['/buscador-noticias']); // Asegúrate de que esta ruta sea correcta
  }

  // Método para editar la noticia
  updateDoc() {
    this.router.navigate(['/editar-noticia', this.id]);
  }

  // Método para borrar la noticia
  deleteDoc() {
    if (this.id) {
      this.firestoreService.deleteDoc('noticias', this.id).then(() => {
        console.log('Noticia borrada');
        this.goBack(); // Regresa a la lista de noticias después de borrar
      }).catch(error => {
        console.error('Error al borrar la noticia:', error);
      });
    }
  }

  // Método para deshabilitar la noticia
  deshabilitarDoc() {
    if (this.id) {
      this.firestoreService.deshabilitarDoc('noticias', this.id).then(() => {
        console.log('Noticia deshabilitada');
        this.goBack(); // Regresa a la lista de noticias después de deshabilitar
      }).catch(error => {
        console.error('Error al deshabilitar la noticia:', error);
      });
    }
  }
}
