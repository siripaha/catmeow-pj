import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {

  name: any
  gene: any
  imageurl: any
  userid: any
  listCat: any
  currentcat: any
 

  public goalList: any[];
  public loadedGoalList: any[];
  // 

  options = {
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: -60,
  };

  categories = {
    slidesPerView: 2.5,
  };

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firebaseservice: FirebaseService,

  ) {

    //ดึงข้อมูลตอน login มาแสดงจาก localStorage
    let tmpuser = JSON.parse(localStorage.getItem('user'))
    console.log("uid => ", tmpuser.user.uid)
    if (tmpuser) {
      this.userid = tmpuser.user.uid
    } else {
      console.log('not user')
    }


    this.firebaseservice.get_cat().subscribe((data) => {
      this.listCat = data.map((e) => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          catname: e.payload.doc.data()['catname'.toString()],
          gene: e.payload.doc.data()['gene'.toString()],
          image: e.payload.doc.data()['image'.toString()]
        }
      })
      // this.listCat = this.listCat.filter((cat:any) => cat.userid === this.userid) ยังเขียนบ่แล้ว
    })
  }
  
  // ****************************
  ngOnInit() {
    this.firestore.collection('goals').valueChanges().subscribe((goalList) => {
      this.goalList = goalList;
      this.loadedGoalList = goalList;
    });
  }

  // *************************
  // logout
  logout() {
    this.afauth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

  presentAlertEditData() {

    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Update Catmeow';

    alert.inputs = [
      {
        name: 'name', 
        id: 'name',
        value: this.name,
        placeholder: 'name'
      },
      {
        name: 'gene',
        id: 'gene',
        value: this.gene,
        placeholder: 'gene'
      },
      {
        name: 'imageurl',
        id: 'imageurl',
        value: this.imageurl,
        placeholder: 'imageurl'
      },
  
    ];
    alert.buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel')
        }
      }, {
        text: 'add!',
        handler: data => {
          console.log(data)
          let catData = {
            userid: this.userid,
            catname: data.name,
            gene: data.gene,
            image: data.imageurl
          };
          this.firebaseservice.add_cat(catData)
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
  }

  feed(item) {
    const data = JSON.stringify(item)
    this.router.navigate(['cat-feed', data])
  }

}
 

