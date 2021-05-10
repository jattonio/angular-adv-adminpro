import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2'; 

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css'],
})
export class RegisterComponent {

  public formSubmitted = false;
  
  public registerForm = this.fb.group({
    nombre: [],
    email: [ 'jattonio@gmail.com', [Validators.required, Validators.email] ],
    password: [ '123456', Validators.required ],
    passwordc: [ '123456', Validators.required ],
    terminos: [ true , Validators.required ],
  }, {
    validators: this.passwordsIguales ( 'password', 'passwordc' )
  });

  constructor( private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private router: Router ) { }

  crearUsuario () {
    this.formSubmitted = true; 
    this.registerForm.value['nombre'] = this.registerForm.value['email'];
    // console.log( this.registerForm.value );

    if ( this.registerForm.invalid ) {
      return;
    }

    this.usuarioService.crearUsuario( this.registerForm.value )
          .subscribe( resp => {

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
    
    if ( this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }

  }

  contrasenasNoValidas ( ) {

    const pass1 = this.registerForm.get('password').value;
    const pass2  = this.registerForm.get('passwordc').value;

    if ( pass1 !== pass2 && this.formSubmitted ){
      return true;
    }else{
      return false;
    }

  }

  aceptaTerminos () {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsIguales ( pass1: string, pass2: string ) {

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors( null );
      }else{
        pass2Control.setErrors( {noEsIgual: true} );
      }

    }

  }

}
