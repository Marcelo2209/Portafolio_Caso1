import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: any; // Almacena los datos personales del usuario
  postulacionesEspacios: any[] = []; // Lista de postulaciones a espacios públicos del usuario
  postulacionesActividades: any[] = []; // Lista de postulaciones a actividades del usuario

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.cargarPerfilUsuario();
    this.cargarPostulacionesUsuario();
    this.cargarPostulacionesActividades(); // Cargar postulaciones a actividades
  }

  // Cargar datos del usuario autenticado
  cargarPerfilUsuario() {
    this.authService.stateAuth().subscribe(user => {
      if (user) {
        this.firestoreService.getDoc<any>('usuarios', user.uid).subscribe(usuarioData => {
          this.usuario = usuarioData;
          console.log('Datos del usuario:', this.usuario);
        });
      }
    });
  }

  // Cargar postulaciones de espacios públicos del usuario
  cargarPostulacionesUsuario() {
    this.authService.stateAuth().subscribe(user => {
      if (user) {
        this.firestoreService.getPostulacionesUsuario(user.uid).subscribe(postulaciones => {
          this.postulacionesEspacios = postulaciones.map((post: any) => {
            if (post.fechasReservadas && post.fechasReservadas.length > 0) {
              const primeraReserva = post.fechasReservadas[0]; // Obtener la primera reserva
              return {
                ...post,
                fechaReservada: this.formatDate(primeraReserva.fecha), // Formatear la fecha reservada
                horaInicio: primeraReserva.horaInicio,
                horaFin: primeraReserva.horaFin,
                fechaSolicitud: this.formatDate(primeraReserva.solicitante.fechaSolicitud), // Formatear la fecha de solicitud
                image: post.image // Asegúrate de tener la URL de la imagen aquí
              };
            }
            return post; // Retorna el post original si no hay reservas
          });
          console.log('Postulaciones a espacios públicos cargadas:', this.postulacionesEspacios);
        }, error => {
          console.error('Error al cargar postulaciones de espacios públicos:', error);
        });
      }
    });
  }

  // Cargar postulaciones a actividades del usuario
  cargarPostulacionesActividades() {
    this.authService.stateAuth().subscribe(user => {
      if (user) {
        // Aquí asumimos que tienes un método en tu FirestoreService que obtiene todas las actividades
        this.firestoreService.getActividades().subscribe(actividades => {
          // Filtrar las actividades en las que el usuario está inscrito
          this.postulacionesActividades = actividades.filter((actividad: any) =>
            actividad.participantes.some((participante: any) => participante.uid === user.uid)
          ).map((actividad: any) => {
            // Aquí extraemos la información necesaria
            const participante = actividad.participantes.find((p: any) => p.uid === user.uid);
            return {
              ...actividad,
              fechaInscripcion: this.formatDate(participante.fechaInscripcion), // Formatear la fecha de inscripción
              fechaEvento: this.formatDate(actividad.fechaEvento), // Formatear la fecha del evento
              cantidadParticipantes: participante.cantidadParticipantes // Cantidad de participantes
            };
          });
          console.log('Postulaciones a actividades cargadas:', this.postulacionesActividades);
        }, error => {
          console.error('Error al cargar postulaciones de actividades:', error);
        });
      }
    });
  }

  // Función para formatear fechas de 'DD/MM/YYYY'
  formatDate(date: string): string {
    if (date) {
      const [year, month, day] = date.split('-'); // Separa la cadena por "-"
      return `${day}/${month}/${year}`; // Devuelve la fecha en el formato DD/MM/YYYY
    }
    return 'Fecha no disponible'; // Mensaje si la fecha no está definida
  }
}
