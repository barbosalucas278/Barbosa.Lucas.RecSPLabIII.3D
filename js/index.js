import Anuncio_Auto from "./anuncio-auto.js";
import FuncionesAxios from "./FuncionesAxios.js";

const http = new FuncionesAxios();
const URL = "http://localhost:3000/anuncios";
const frm = document.forms[0];
const divContenedor = document.getElementById("divLista");
const campoId = document.getElementById("idAnuncio");
const btnSubmit = document.getElementById("btnSubmit");
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");

const campoPrecioMaximo = document.getElementById("Maximo");
const campoPrecioMinimo = document.getElementById("Minimo");
const campoPromedioPotencia = document.getElementById("PromedioPotencia");

const selFiltro = {};
selFiltro.selectFiltro = document.getElementById("selFiltro");
selFiltro.promedio = document.getElementById("inputPromedioFiltro");
let checksLocalStorage = localStorage.getItem("checksLocalStorage").split(",") || [];
const checkMostrados = {};
checkMostrados.titulo = document.getElementById("checkTitulo");
checkMostrados.descripcion = document.getElementById("checkDescripcion");
checkMostrados.tipoTransaccion = document.getElementById("checkTransaccion");
checkMostrados.precio = document.getElementById("checkPrecio");
checkMostrados.cantidadDePuertas = document.getElementById("checkcantidadDePuertas");
checkMostrados.cantidadDeKMs = document.getElementById("checkcantidadDeKMs");
checkMostrados.cantidadDePotencia = document.getElementById("checkcantidadDePotencia");

const spinner = document.querySelector("#spinner");

window.addEventListener("DOMContentLoaded", () => {
  updateChecks();

  frm.addEventListener("submit", function (e) {
    e.preventDefault();
    handlerSubmit(e);
  });
  document.addEventListener("click", handlerClick);
  document.addEventListener("change", handlerChange);
  document.addEventListener("keypress", handlerKeyPress);
  handlerLoadList(selFiltro);
});
function handlerKeyPress(e) {
  if (e.target.matches("#inputPromedioFiltro")) {
    handlerLoadList(selFiltro);
  }
}
function handlerChange(e) {
  if (e.target.matches("#selFiltro")) {
    handlerLoadList(selFiltro);
  } else if (e.target.matches(`input[type="checkbox"]`)) {
    handlerLoadList(selFiltro);
  }
}

async function handlerSubmit(e) {
  e.preventDefault();
  const { titulo, tipoTransaccion, descripcion, precio, cantidadDePuertas, cantidadDeKMs, cantidadDePotencia } =
    e.target.elements;
  if (campoId.value) {
    const xhr = new XMLHttpRequest();
    let anuncioAModificar = new Anuncio_Auto();
    xhr.open("GET", `${URL}/${campoId.value}`, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 299) {
          anuncioAModificar = JSON.parse(xhr.responseText);
          console.log(anuncioAModificar);
        } else {
          const statusText = xhr.statusText || "Ocurrió un error";
          console.error(`Error: ${xhr.status} : ${statusText}`);
        }
      }
    };
    console.log(anuncioAModificar);
    anuncioAModificar.id = campoId.value;
    anuncioAModificar.titulo = titulo.value;
    anuncioAModificar.tipoTransaccion = tipoTransaccion.value;
    anuncioAModificar.descripcion = descripcion.value;
    anuncioAModificar.precio = precio.value;
    anuncioAModificar.cantidadDePuertas = cantidadDePuertas.value;
    anuncioAModificar.cantidadDeKMs = cantidadDeKMs.value;
    anuncioAModificar.cantidadDePotencia = cantidadDePotencia.value;
    console.log(anuncioAModificar);
    spinner.classList.remove("visually-hidden");
    almacenarDatos(anuncioAModificar);
    spinner.classList.add("visually-hidden");
    handlerLoadList(selFiltro);
    handlerClearFrm();
  } else {
    let newAnuncio = new Anuncio_Auto(
      null,
      titulo.value,
      tipoTransaccion.value,
      descripcion.value,
      precio.value,
      cantidadDePuertas.value,
      cantidadDeKMs.value,
      cantidadDePotencia.value
    );

    spinner.classList.remove("visually-hidden");

    await altaAnuncio(newAnuncio);
    spinner.classList.add("visually-hidden");
  }
  limpiarFormulario(frm);
  return false;
}
function handlerClick(e) {
  if (e.target.matches("td")) {
    let id = e.target.parentNode.dataset.id;
    cargarFormulario(id);
  } else if (e.target.matches("#btnEliminar")) {
    handlerDelete();
  } else if (e.target.matches("#btnCancelar")) {
    handlerClearFrm();
  }
}
async function handlerDelete() {
  await eliminarDatos(campoId.value);
  handlerClearFrm();
  await handlerLoadList(selFiltro);
}
async function eliminarDatos(id) {
  await http.delete(`${URL}/${id}`);
}
async function cargarFormulario(id) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        const Anuncio = JSON.parse(xhr.responseText);
        const { titulo, tipoTransaccion, descripcion, precio, cantidadDePuertas, cantidadDeKMs, cantidadDePotencia } =
          Anuncio;
        frm.id.value = id;
        frm.titulo.value = titulo;
        frm.tipoTransaccion.value = tipoTransaccion;
        frm.descripcion.value = descripcion;
        frm.precio.value = precio;
        frm.cantidadDePuertas.value = cantidadDePuertas;
        frm.cantidadDeKMs.value = cantidadDeKMs;
        frm.cantidadDePotencia.value = cantidadDePotencia;

        btnEliminar.classList.remove("visually-hidden");
        btnCancelar.classList.remove("visually-hidden");
        btnSubmit.value = "Modificar";
        spinner.classList.add("visually-hidden");
      } else {
        const statusText = xhr.statusText || "Ocurrió un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    } else {
      spinner.classList.remove("visually-hidden");
    }
  };
  xhr.open("GET", `${URL}/${id}`, true);
  xhr.send();
}

/**
 * Guarda los datos en el local storage en formato JSON
 * @param data datos a guardar en el localstorage
 */
async function almacenarDatos(data) {
  await http.put(`${URL}/${campoId.value}`, data);
}
function handlerClearFrm() {
  limpiarFormulario(frm);
  btnEliminar.classList.add("visually-hidden");
  btnCancelar.classList.add("visually-hidden");
  btnSubmit.value = "Guardar";
}
function limpiarFormulario(frm) {
  frm.reset();
  campoId.value = "";
}

async function handlerLoadList(filtro) {
  //const anunciosResponse = await http.get("http://localhost:3000/anuncios");
  const xhr = new XMLHttpRequest();
  let anunciosResponse = [];
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anunciosResponse = JSON.parse(xhr.responseText);
        const listaFiltrada = filtrarLista(filtro, anunciosResponse);
        renderizarLista(listaFiltrada, divContenedor);
        spinner.classList.add("visually-hidden");
      } else {
        const statusText = xhr.statusText || "Ocurrió un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);        
      }
    } else {
      console.log(selFiltro.selectFiltro.classList);
      spinner.classList.remove("visually-hidden");
    }
  };

  xhr.open("GET", URL);
  xhr.send();
}

function filtrarLista(filtro, anuncios) {
  if (filtro.selectFiltro.value == 1) {
    const anunciosResponse = anuncios.filter((x) => x.tipoTransaccion == "alquiler");
    calculosInformados(filtro.promedio, anunciosResponse);
    return anunciosResponse;
  } else if (filtro.selectFiltro.value == 2) {
    const anunciosResponse = anuncios.filter((x) => x.tipoTransaccion == "venta");
    calculosInformados(filtro.promedio, anunciosResponse);
    return anunciosResponse;
  }
  filtro.promedio.value = "N/A";
  return anuncios;
}
function calculosInformados(promedioFiltro, anuncios) {
  const precios = anuncios.map((x) => parseInt(x.precio));
  const acumulador = precios.reduce((acc, curr) => acc + curr);
  const promedio = acumulador / anuncios.length;
  promedioFiltro.value = promedio.toFixed(1);

  const min = precios.reduce((acc, curr) => (acc < curr ? acc : curr));
  campoPrecioMinimo.value = min;
  const max = precios.reduce((acc, curr) => (acc > curr ? acc : curr));
  campoPrecioMaximo.value = max;

  const potencias = anuncios.map((x) => parseInt(x.cantidadDePotencia));
  const acumuladorPotencias = potencias.reduce((acc, curr) => acc + curr);
  const promedioPotencia = acumuladorPotencias / anuncios.length;
  campoPromedioPotencia.value = promedioPotencia.toFixed(1);
  // console.log(`${precios}`);
  // console.log(`${campoPrecioMaximo.value} ${campoPrecioMinimo.value} ${campoPromedioPotencia.value}`);
}
function renderizarLista(lista, contenedor) {
  let nuevosChecks = [];
  for (const key in checkMostrados) {
    if (Object.hasOwnProperty.call(checkMostrados, key)) {
      if (checkMostrados[key].checked) {
        nuevosChecks.push(key);
      }
    }
  }
  localStorage.setItem("checksLocalStorage", nuevosChecks);
  updateChecks();
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }
  if (lista) {
    contenedor.appendChild(crearTabla(lista));
  }
  
}
/**
 *  Da de alta una persona en la tabla
 * @param {Anuncio} a
 */
async function altaAnuncio(a) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", URL);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        let data = JSON.parse(xhr.responseText);
        console.log(data);
        handlerLoadList(selFiltro); //carga la tabla de nuevo
        spinner.classList.add("visually-hidden");
      } else {
        const statusText = xhr.statusText || "Ocurrió un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    } else {
      spinner.classList.remove("visually-hidden");
    }
  };
  xhr.send(JSON.stringify(a));
}

//////////////////// Checks ///////////////////////
function updateChecks() {
  checksLocalStorage = localStorage.getItem("checksLocalStorage").split(',')
  if (checksLocalStorage.length == 0) {
    for (const key in checkMostrados) {
      checksLocalStorage.push(key);
    }
  }

  for (const check in checkMostrados) {
    if (checksLocalStorage.includes(check)) {
      checkMostrados[check].checked = true;
    } else {
      checkMostrados[check].checked = false;
    }
  }
}
////////////////////Creacion de tabla dinamica ///////////////////
function crearTabla(items) {
  const tabla = document.createElement("table");
  tabla.classList.add("table");
  tabla.classList.add("table-striped");
  tabla.classList.add("table-bordered");
  tabla.classList.add("table-sm");
  tabla.appendChild(crearTHead(items[0]));
  tabla.appendChild(crearTBody(items));
  
  return tabla;
}

function crearTHead(item) {
  const tHead = document.createElement("thead");
  const tr = document.createElement("tr");
  tr.classList.add("table-danger");
  for (const key in item) {
    if (key === "id") {
      const th = document.createElement("th");
      th.textContent = key;
      tr.appendChild(th);
    }

    if (checksLocalStorage.includes(key) && checkMostrados.hasOwnProperty(key) && checkMostrados[key].checked) {
      const th = document.createElement("th");
      th.textContent = key;
      tr.appendChild(th);
    }
  }

  tHead.appendChild(tr);
  return tHead;
}

function crearTBody(items) {
  const tBody = document.createElement("tbody");
  items.forEach((item) => {
    const tr = document.createElement("tr");
    for (const key in item) {
      if (key === "id") {
        tr.setAttribute("data-id", item[key]);
        const td = document.createElement("td");
        td.textContent = item[key];
        tr.appendChild(td);
      }
      if (checksLocalStorage.includes(key) && checkMostrados.hasOwnProperty(key) && checkMostrados[key].checked) {
        const td = document.createElement("td");
        td.textContent = item[key];
        tr.appendChild(td);
      }
    }
    tBody.appendChild(tr);
  });
  return tBody;
}
