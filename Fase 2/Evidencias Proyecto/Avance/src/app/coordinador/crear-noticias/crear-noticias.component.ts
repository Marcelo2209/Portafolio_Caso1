import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FcmService } from '../../service/Fcm.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-noticias',
  templateUrl: './crear-noticias.component.html',
  styleUrls: ['./crear-noticias.component.scss'],
})
export class CrearNoticiasComponent implements OnInit {
  newsForm!: FormGroup;
  selectedFile: File | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB en bytes

  constructor(
    private firestore: FirestoreService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private alertController: AlertController,
    private fcmService: FcmService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {}

  private initForm() {
    this.newsForm = this.formBuilder.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      details: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.newsForm.valid && this.selectedFile) {
      try {
        // Mostrar loading
        const loading = await this.alertController.create({
          message: 'Subiendo noticia...',
        });
        await loading.present();

        if (!this.validateFile(this.selectedFile)) {
          await loading.dismiss();
          return;
        }

        const newsData = this.newsForm.value;
        newsData.date = this.getCurrentDate();
        const id = this.firestore.getId();
        newsData.id = id;

        // Subir imagen primero
        try {
          const filePath = `noticias/${Date.now()}_${this.selectedFile.name}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = await this.storage.upload(filePath, this.selectedFile);
          const url = await fileRef.getDownloadURL().toPromise();
          console.log('URL de imagen obtenida:', url);
          newsData.image = url;
        } catch (error) {
          console.error('Error en subida de imagen:', error);
          await loading.dismiss();
          this.showErrorAlert('Error al subir la imagen. Por favor, intente nuevamente.');
          return;
        }

        // Crear documento
        try {
          await this.createNews(newsData, id);
        } catch (error) {
          console.error('Error al crear noticia:', error);
          await loading.dismiss();
          this.showErrorAlert('Error al crear la noticia. Por favor, intente nuevamente.');
          return;
        }

        // Todo exitoso
        await loading.dismiss();
        await this.showSuccessAlert();
        
        // Limpiar y recargar de manera forzada
        this.newsForm.reset();
        this.selectedFile = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // Esperar un momento y recargar
        setTimeout(() => {
          window.location.href = window.location.href;
        }, 1000);

      } catch (error) {
        console.error('Error general:', error);
        this.showErrorAlert('Error inesperado. Por favor, intente nuevamente.');
      }
    } else {
      this.showErrorAlert('Por favor, complete todos los campos y seleccione una imagen.');
    }
  }

  validateFile(file: File): boolean {
    console.log('Validando archivo:', file);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      this.showErrorAlert('Solo se permiten archivos PNG o JPG/JPEG.');
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.showErrorAlert('El archivo no debe superar los 5MB.');
      return false;
    }

    console.log('Archivo válido');
    return true;
  }

  async createNews(newsData: any, id: string) {
    try {
      const path = 'noticias';
      await this.firestore.createDoc(newsData, path, id);
      console.log('Documento creado exitosamente');
      
      // Enviar notificación solo si el documento se creó correctamente
      try {
        await this.fcmService.sendNotification(
          'Nueva Noticia',
          `Se ha publicado: ${newsData.title}`,
          'usuariosLogueados'
        );
        console.log('Notificación enviada exitosamente');
      } catch (notifError) {
        console.error('Error al enviar notificación:', notifError);
        // No detenemos el proceso si falla la notificación
      }
    } catch (error) {
      console.error('Error en createNews:', error);
      throw error;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.newsForm.patchValue({ image: file.name });
      } else {
        event.target.value = '';
        this.selectedFile = null;
        this.newsForm.patchValue({ image: '' });
      }
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'La noticia ha sido creada correctamente.',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Forzar recarga después de cerrar el alert
          window.location.reload();
        }
      }]
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDate(dateString: string): string {
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
}