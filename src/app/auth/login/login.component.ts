import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;
 
@Component({
  selector: 'app-login',
  templateUrl:  './login.component.html',
  styleUrls:   [ './login.component.css' ]
})

export class LoginComponent implements OnInit{

  public formSubmitted = false;
  public auth2: any;
  
  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [Validators.required, Validators.email] ],
    password: [ '123456', Validators.required ],
    remember: [ localStorage.getItem('email')?true:false ]
   });

  constructor( private router: Router,
                private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private ngZone: NgZone ) { }
  
  ngOnInit(): void {
    this.renderButton();
  }

  login(){
    // console.log('Login function');

    this.formSubmitted = true; 
    // console.log( this.loginForm.value );

    if ( this.loginForm.invalid ) {
      return;
    }

    this.usuarioService.login( this.loginForm.value )
          .subscribe( resp => {
            // console.log('Usuario logeado');
            //console.log(resp);

            if ( this.loginForm.get('remember').value ) {
              localStorage.setItem( 'email', this.loginForm.get('email').value );
            }else{
              localStorage.removeItem( 'email' );
            }

          // Navegar al dashboard
          this.router.navigateByUrl('/');

          }, ( err ) => {
            // Desplegar alerta en caso de error
            Swal.fire({
              title: 'Error!',
              text: err.error.msg,
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          } );
  }

  campoNoValido ( campo: string ): boolean {
    
    if ( this.loginForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }

  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }


  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));

  }

  attachSignin(element) {

    this.auth2.attachClickHandler( element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle( id_token )
            .subscribe( resp => {
              this.ngZone.run( () => {
                // Navegar al dashboard
                this.router.navigateByUrl('/');
              })
            });


        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });

  }


}
