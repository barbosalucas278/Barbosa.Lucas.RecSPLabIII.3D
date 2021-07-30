import Anuncio from "./anuncio.js";

export default class Anuncio_Auto extends Anuncio {
  constructor(id, titulo, tipoTransaccion, descripcion, precio, cantidadDePuertas, cantidadDeKMs, cantidadDePotencia) {
    super(id, titulo, tipoTransaccion, descripcion, precio);
    this.cantidadDePuertas = cantidadDePuertas;
    this.cantidadDeKMs = cantidadDeKMs;
    this.cantidadDePotencia = cantidadDePotencia;
  }
}
