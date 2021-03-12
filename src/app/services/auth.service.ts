import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { switchMap } from 'rxjs/operators'

@Injectable()

export class AuthService {

  user$ : Observable<User>;
  user:User;
  userData: any


  constructor(

    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
  ) 
  { 
    this.user$ = this.afauth.authState.pipe(
      switchMap(user =>
        {
          if(user)
          {
            return this.afs.doc('users/${user.uid}').valueChanges();
          } else {
            return of(null);
          }
      })
    );
  } //end of constructor

  async login(email , pass){
    const loading = await this.loadingCtrl.create({
      message: 'Authenicating..',
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();

    this.afauth.signInWithEmailAndPassword(email, pass).then((data) => {
      if(!data.user.emailVerified)
      {
        loading.dismiss();
        this.toast('Please verified your email!', 'danger');
        this.logout();   
        localStorage.setItem('user', null)
        localStorage.getItem('user')
      } else {
        console.log('user login =>', data)
        this.userData = data
        localStorage.setItem('user', JSON.stringify(this.userData))
        loading.dismiss();
        this.router.navigate(['/home']);
      }
    })
  } // end of login

  logout()
  { 
    this.afauth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  async toast(message, status){
    const toast = await this.toastr.create({
      message:message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  } // end of toast

} 
