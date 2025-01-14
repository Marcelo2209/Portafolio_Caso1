import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-nuevos-usuarios',
  templateUrl: './gestion-nuevos-usuarios.component.html',
  styleUrls: ['./gestion-nuevos-usuarios.component.scss'],
})
export class GestionNuevosUsuariosComponent  implements OnInit {
  rut: string | null = null; // Aquí almacenaremos el RUT del usuario
  usuarioForm: FormGroup; // FormGroup para el formulario
  roles: string[] = ['Administrador', 'Coordinador', 'Secretario', 'Usuario Registrado'];
  estado: string[] = ['Activo', 'Pendiente'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private formBuilder: FormBuilder,
    private alertController: AlertController // Inyectar AlertController
  ) { 
       // Inicializar el FormGroup
       this.usuarioForm = this.formBuilder.group({
        rut: ['', Validators.required],
        email: ['', Validators.required],
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        rol: ['', Validators.required],
        estado: ['', Validators.required],
        foto: [''], // Agregamos el control para la foto
        documento: [''],
      });
  }
  ngOnInit() {
    // Obtener el RUT del usuario desde los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.rut = params.get('rut'); // Accede al RUT del usuario
      console.log('RUT del usuario:', this.rut);

      // Aquí puedes hacer una llamada al servicio para obtener la información del usuario
      if (this.rut) {
        this.firestoreService.getdocs<any>('usuarios').subscribe(users => {
          // Filtra el usuario basado en el RUT
          const userDetails = users.find(user => user.rut === this.rut);
          if (userDetails) {
            console.log('Detalles del usuario:', userDetails);
            // Cargar los datos en el formulario
            this.usuarioForm.patchValue(userDetails);
          } else {
            console.error('Usuario no encontrado');
          }
        }, error => {
          console.error('Error al obtener los usuarios:', error);
        });
      }
    });
  }

  // Método para guardar los cambios en el usuario
  async onSubmit() {
    if (this.usuarioForm.valid) {
      const updatedUser = { ...this.usuarioForm.value, rut: this.rut }; // Agregar RUT a los datos actualizados
      if (this.rut) {
        try {
          await this.firestoreService.updateUserDoc(this.rut, updatedUser);
          console.log('Usuario actualizado');
          this.showSuccessAlert(); // Mostrar alerta de éxito
          this.router.navigate(['/lista-registros-usuarios']); // Redirigir a la lista de usuarios
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
        }
      } else {
        console.error('RUT es nulo o no es un string');
      }
    }
  }

  // Método para mostrar la alerta de éxito
  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Los cambios han sido guardados correctamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para manejar la selección de imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioForm.patchValue({
          foto: e.target.result // Guarda la imagen en el formulario
        });
      };
      reader.readAsDataURL(file);
    }
  }
  

  onImageSelected2(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioForm.patchValue({
          documento: e.target.result // Guarda la imagen en el formulario
        });
      };
      reader.readAsDataURL(file);
    }
  }

// Método para regresar a la lista de actividades
goBack() {
  this.router.navigate(['/lista-registros-usuarios']); // Asegúrate de que esta ruta sea correcta
}
  // Método para borrar la usuario
  deleteUser2() {
    if (this.rut) {
      // Primero verificar si el usuario con ese RUT existe
      this.firestoreService.checkUserExists(this.rut, 'usuarios').then(exists => {
        if (exists) {
          // Si el RUT existe, proceder con la eliminación
          this.firestoreService.deleteUser2('usuarios', this.rut!).then(() => {
            console.log('Usuario Borrado');
            this.goBack(); // Regresa a la lista de usuarios después de borrar
          }).catch(error => {
            console.error('Error al borrar al usuario:', error);
          });
        } else {
          console.error('El usuario no existe');
        }
      }).catch(error => {
        console.error('Error al verificar si el RUT existe:', error);
      });
    } else {
      console.error('No se ha especificado un RUT válido');
    }
  }
  
  
}
