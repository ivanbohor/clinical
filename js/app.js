const mascotaIn = document.querySelector("#mascota");
const propieIn = document.querySelector("#propietario");
const telIn = document.querySelector("#telefono");
const fechaIn = document.querySelector("#fecha");
const horaIn = document.querySelector("#hora");
const sintoIn = document.querySelector("#sintomas");

const formulario = document.querySelector("#nueva-cita");

const contenedorCitas = document.querySelector("#citas");

let editing;

eventListeners();

class Citas {
  constructor() {
    this.citas = [];
  }
  addCita(cita) {
    this.citas = [...this.citas, cita];
    console.log(this.citas);
  }

  deleteCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editeCita(citaAct) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaAct.id ? citaAct : cita
    );
  }
}
class UI {
  printAlert(mensaje, tipo) {
    const divMen = document.createElement("div");
    divMen.classList.add("alert", "d-block", "text-center", "col-12");
    if (tipo === "error") {
      divMen.classList.add("alert-danger");
    } else {
      divMen.classList.add("alert-success");
    }
    divMen.textContent = mensaje;

    document
      .querySelector("#contenido")
      .insertBefore(divMen, document.querySelector(".agregar-cita"));

    setTimeout(() => {
      divMen.remove();
    }, 3000);
  }

  imprimirCita({ citas }) {
    this.limpiarHtml();

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      const mascotaParrafo = document.createElement("h3");
      mascotaParrafo.classList.add("card-title", "font-weight:bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `<span class="font-weight-bolder"> Propietario: </span> ${propietario}`;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `<span class="font-weight-bolder"> Fecha: </span> ${fecha}`;

      const sintomaParrafo = document.createElement("p");
      sintomaParrafo.innerHTML = `<span class="font-weight-bolder"> Sintomas: </span> ${sintomas}`;

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-danger", "m-2");
      btnDelete.innerHTML = "eliminar";

      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(sintomaParrafo);

      contenedorCitas.appendChild(divCita);
      divCita.appendChild(btnDelete);

      btnDelete.onclick = () => deleteCita(id);

      const btnEdit = document.createElement("button");
      btnEdit.classList.add("btn", "btn-info", "m-2");
      btnEdit.innerHTML = "Editar";

      divCita.appendChild(btnEdit);

      btnEdit.onclick = () => editCita(cita);
    });
  }

  limpiarHtml() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();

const adminCitas = new Citas();

const citaObj = {
  mascota: "",
  sintomas: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
};
function eventListeners() {
  mascotaIn.addEventListener("input", datoCita);
  propieIn.addEventListener("input", datoCita);
  telIn.addEventListener("input", datoCita);
  fechaIn.addEventListener("input", datoCita);
  horaIn.addEventListener("input", datoCita);
  sintoIn.addEventListener("input", datoCita);

  formulario.addEventListener("submit", nuevaCita);
}

function nuevaCita(e) {
  e.preventDefault();
  const { mascota, sintomas, propietario, telefono, fecha, hora } = citaObj;
  if (mascota === "" || propietario === "") {
    ui.printAlert("los datos son obligatorios", "error");

    return;
  }
  if (editing) {
    ui.printAlert("se Edito correctamente");

    adminCitas.editeCita({ ...citaObj });

    formulario.querySelector(`button[type="submit"]`).textContent =
      "Crear Cita";

    editing = false;
  } else {
    citaObj.id = Date.now();

    adminCitas.addCita({ ...citaObj }); //tomamos solo la copia para que no se repita todo el array cada vez que guardamos
    ui.printAlert("se agrego correctamente");
  }

  reiniciarObj();

  formulario.reset();

  ui.imprimirCita(adminCitas);
}

//tomo el atributo html name que es "mascota" del input y
//la iguala al value ingresado. con obj[x] estoy matcheando el name con la prop del obj
//ya que tienen los mismo nombres (name "mascota" = prop= mascota, asi con las demas)
function datoCita(e) {
  citaObj[e.target.name] = e.target.value;
  /*   console.log(citaObj);
   */
}

function reiniciarObj() {
  citaObj.mascota = "";
  citaObj.sintomas = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
}

function deleteCita(id) {
  /* console.log(id); */
  adminCitas.deleteCita(id);
  ui.printAlert("cita eliminada!");
  ui.imprimirCita(adminCitas);
}

function editCita(cita) {
  const { mascota, sintomas, propietario, telefono, fecha, hora, id } = cita;

  mascotaIn.value = mascota;
  propieIn.value = propietario;
  telIn.value = telefono;
  fechaIn.value = fecha;
  horaIn.value = hora;
  sintoIn.value = sintomas;

  //llenar objeto para modo edicion

  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  formulario.querySelector(`button[type="submit"]`).textContent =
    "Guardar Cambios";
  /*   console.log(cita);
   */
  editing = true;
}
