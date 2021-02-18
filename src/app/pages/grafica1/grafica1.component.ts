import { Component } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})

export class Grafica1Component {

  public labels1: string[] = ['Etiqueta 1', 'Etiqueta 2', 'Etiqueta 3'];
  public data1: [
    [100, 200, 300]
  ]; 


}
