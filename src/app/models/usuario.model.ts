import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public google? : boolean,
        public rol?: string,
        public img?: string,
        public uid?: string,
    ){}

    get imagenUrl() {

        if ( !this.img ) {
            return `${ base_url }/upload/usuarios/no-image.jpg`;
        }else if ( this.img.includes('http') ) {
            return this.img;
        }else{
            return `${ base_url }/upload/usuarios/${ this.img }`;
        }        

    }


}