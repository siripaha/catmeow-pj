import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService 
{
  create(arg0: { cssClass: string; header: string; message: string; buttons: ({ text: string; role: string; cssClass: string; handler: (blah: any) => void; } | { text: string; handler: () => void; })[]; }) {
    throw new Error('Method not implemented.');
  }

  collectionName = 'cat-meow';
  uid: any


  constructor(
    private firestroe: AngularFirestore
  ) { 
    const tmpuser = JSON.parse(localStorage.getItem('user'))
    if (tmpuser) {

      this.uid = tmpuser['uid']
    } else {
      console.log("user not found!")
    }
  }

  //read
  get_cat(){
    return this.firestroe.collection('cat-meow').snapshotChanges();
  }

  //add
  add_cat(data){
    return this.firestroe.collection('cat-meow').add(data);
  }

  //delete
  delete_cat(id){
    return this.firestroe.doc('cat-meow/' + id).delete();

  } //edit
  editData(id, data: any) {
    return this.firestroe.doc('cat-meow/' + id).update(data)
    
  }

  //update
  update_cat(id,data :any){
    return this.firestroe.doc('cat-meow' + '/' +id).update(data);
  }
  
 }

