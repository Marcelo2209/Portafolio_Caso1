import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore) { }

  // Crear documento
  createDoc(data: any, path: string, id: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).set(data);
  }

  // Obtener documento por ID
  getDoc<tipo>(path: string, id: string) {
    const collection = this.afs.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  updateDoc(data: any, path: string, id: string) {
    console.log('El ID que se pasa es:', id); // Verifica si es un string

    // Verificar si el ID es un string
    if (typeof id !== 'string') {
      throw new Error('El ID proporcionado no es un string');
    }

    const collection = this.afs.collection(path);
    return collection.doc(id).update(data);
  }


  // Borrar documento
  deleteDoc(path: string, id: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).delete();
  }

  // Borrar usuario
  deleteUser(path: string, rut: string) {
    const collection = this.afs.collection(path);
    return collection.doc(rut).delete();
  }
  deleteUser2(path: string, uid: string) {
    const collection = this.afs.collection(path);
    return collection.doc(uid).delete();
  }



  // Deshabilitar un documento
  deshabilitarDoc(path: string, id: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).update({ disabled: true });
  }

  // Listar documentos
  getdocs<tipo>(path: string) {
    const collection = this.afs.collection<tipo>(path);
    return collection.valueChanges();
  }

  // Crear ID de documento único
  getId() {
    return this.afs.createId();
  }

  // Obtener noticias por fecha
  getNoticiasPorFecha(fecha: string): Observable<any[]> {
    const collection = this.afs.collection('noticias', ref => ref.where('date', '==', fecha));
    return collection.valueChanges();
  }

  // Verificar si un RUT ya existe en la colección
  async checkRUTExists(rut: string, path: string): Promise<boolean> {
    const docs = await firstValueFrom(this.getdocs(path));
    return docs.some((user: any) => user.rut === rut);
  }

  // Obtener ventas por UID
  getVenta(uid: string) {
    const collection = this.afs.collection('ventas', ref => ref.where('uidComprador', '==', uid));
    return collection.valueChanges();
  }
  // Método para crear un documento con ID generado automáticamente
  createDocWithAutoId(data: any, path: string) {
    const collection = this.afs.collection(path);
    return collection.add(data);  // Esto genera automáticamente el ID único
  }

  // Método para cambiar el rol de un usuario
  updateUserRole(uid: string, newRole: string, path: string) {
    return this.updateDoc({ tipo: newRole }, path, uid);
  }

  // Método exclusivo para actualizar un documento de usuario
  updateUserDoc(rut: string, data: any) {
    if (typeof rut !== 'string' || !rut) {
      return Promise.reject('El RUT debe ser un string válido');
    }
  
    // Buscar el documento por el campo 'rut'
    return this.afs.collection('Usuario', ref => ref.where('rut', '==', rut))
      .get().toPromise()
      .then(querySnapshot => {
        if (!querySnapshot || querySnapshot.empty) {
          throw new Error('No se encontró ningún usuario con el RUT proporcionado');
        }
  
        // Obtenemos el ID del documento
        const docId = querySnapshot.docs[0].id;
        
        // Actualizamos el documento con el ID encontrado
        return this.afs.collection('Usuario').doc(docId).update(data);
      })
      .then(() => {
        console.log('Usuario actualizado correctamente');
      })
      .catch(error => {
        console.error('Error al actualizar el usuario:', error);
        throw error;
      });
  }
  
  }
  

