//JavaScript
var bd;
window.addEventListener("load", iniciar, false);

function iniciar() {
	//Activamos el evento click de cada botón.
	//El de Nuevo no hace falta porque usamos reset
	document.getElementById("ver").addEventListener("click", verPropiedades);
	document.getElementById("guardar").addEventListener("click", agregarObjeto);
	document.getElementById("modificar").addEventListener("click", modificarObjeto);
	document.getElementById("abrirBase").addEventListener("click", abrirCrearBase);
	document.getElementById("listar").addEventListener("click", listarRegistros);
	document.getElementById("borrar").addEventListener("click", borrarObjeto);
}

function abrirCrearBase() {
	var solicitud = indexedDB.open("almacen");
	//Si la base esta creada la abrimos
	solicitud.onsuccess = function (e) {
		console.log("entrando en onsuccess")
		bd = e.target.result;
	}
	//Cuando la base no está creada. Creamos el contenedor "productos" y le asignamos una clave
	solicitud.onupgradeneeded = function (e) {
		console.log("entrando en upgrade")
		bd = e.target.result;
		bd.createObjectStore("productos", {keyPath: "clave"});
	}
	//Si se produce un error
	solicitud.onerror = (error) => {
		console.log('Error', error);
	}
}

//En agregarObjeto os pongo una alternativa simplificada pero podría ser igual que 
//la función modificar objeto. La diferencia está en usar add o put

function agregarObjeto() {
	var transaccion = bd.transaction(["productos"], "readwrite");
	var almacen = transaccion.objectStore("productos");
	almacen.add({clave: clave.value, color: color.value, precio: precio.value});
}

function modificarObjeto() {
	var clave = document.getElementById("clave").value;
	var color = document.getElementById("color").value;
	var precio = document.getElementById("precio").value;
	var transaccion = bd.transaction(["productos"], "readwrite");
	var almacen = transaccion.objectStore("productos");
	almacen.put({clave: clave, color: color, precio: precio});
}

function borrarObjeto() {
	//Elimina un objeto a partir de su clave
	var clave = document.getElementById("clave").value;
	var transaccion = bd.transaction(["productos"], "readwrite");
	var almacen = transaccion.objectStore("productos");
	almacen.delete(clave);
	//Limpiamos el formulario
	document.getElementById("clave").value = "";
	document.getElementById("color").value = "";
	document.getElementById("precio").value = "";
}

//En listado declaramos la variable cursor y activamos el evento "success"
//Si el cursor apunta a un registro ejecutamos la función mostrarDatos
function listarRegistros() {
	listado.innerHTML = "";
	var transaccion = bd.transaction(["productos"], "readonly");
	var almacen = transaccion.objectStore("productos");
	var cursor = almacen.openCursor();
	cursor.addEventListener("success", mostrarDatos, false);
}

//Anotamos los valores del registro y avanzamos el cursor
function mostrarDatos(e) {
	var cursor = e.target.result;
	if (cursor) {
		listado.innerHTML += "<div>" + cursor.value.clave + " - " + cursor.value.color + " - " + cursor.value.precio + "</div>";
		cursor.continue();
	}
}

//Igual que en listado pero ahora ejecutamos la función verDatos
function verPropiedades() {
	var transaccion = bd.transaction(["productos"], "readonly");
	var almacen = transaccion.objectStore("productos");
	var cursor = almacen.openCursor();
	cursor.addEventListener("success", verDatos, false);
}

function verDatos(e) {
	var cursor = e.target.result;
	var n = document.getElementById("clave").value;
	if (cursor) {
		//Comprobamos que el cursor apunta a la clave que estamos buscando
		if (cursor.value.clave == n) {
			document.getElementById("color").value = cursor.value.color;
			document.getElementById("precio").value = cursor.value.precio;
			var encontrado = true;
		} else {
			cursor.continue();
		}
	}
	//Si no lo encontramos limpiamos los campos para evitar confusión
	if (!encontrado) {
		document.getElementById("color").value = "";
		document.getElementById("precio").value = "";
		console.log("producto no existe")
	}
}




