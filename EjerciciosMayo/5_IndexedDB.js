//Creamos una variable donde guardaremos la base de datos.
let db;
//Seleccionamos la tabla sobre la que se van a montar los datos usando su etiqueta
const tablaDatos = document.getElementById('tbody');
const campos = document.getElementsByTagName("input");

window.onload = function () {
    document.getElementById("abrirBase").addEventListener("click", abrirBase, false);
    document.getElementById("guardar").addEventListener("click", guardarFormulario, false);
    document.getElementById("ver").addEventListener("click", mostrarDatos, false);
    document.getElementById("modificar").addEventListener("click", modificarDatos, false);
    document.getElementById("borrar").addEventListener("click", borrarDatos, false);
    document.getElementById("listar").addEventListener("click", listarFormulario, false);
    document.getElementById("nuevo").addEventListener("click", crearNuevo, false);
    compatibildiadIndexedDB();
};

//Comprobamos que el navegador sea compatible
function compatibildiadIndexedDB() {
    if (!window.indexedDB) {
        escribirmensaje("IndexedDB no disponible en tu navegador.");
        console.log("IndexedDB no disponible en tu navegador.");
    }
}

//Si no tuviéramos botón de abrir esta función la ejecutaríamos dentro del window.onload = function ()
function abrirBase() {
    borrarTabla();
    //Abrimos la base de datos con nombre y versión
    let request = window.indexedDB.open("Clientes", 1);

    //Comprobamos si hay algún error
    request.onerror = function () {
        escribirmensaje("Error con IndexedDB.");
        console.log("Error con IndexedDB.");
    };
    //Si no hay error asignamos el resultado del request a la variable de base de datos
    request.onsuccess = function () {
        escribirmensaje("Base de datos abierta correctamente");
        console.log("Base de datos abierta correctamente");
        db = request.result;
    };

    //Definimos el schema
    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        //Definimos la primary Key
        let objectStore = db.createObjectStore('Clients', {keyPath: 'id', autoIncrement: true});

        //Definimos los índices
        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('apellidos', 'apellidos', {unique: false});
        objectStore.createIndex('provincia', 'provincia', {unique: false});
        objectStore.createIndex('localidad', 'localidad', {unique: false});
        objectStore.createIndex('email', 'email', {unique: true});
        escribirmensaje("Congiguración de la base de datos completada");
        console.log("Congiguración de la base de datos completada")
    };
    campos[8].disabled = true;
    campos[9].removeAttribute('hidden');
    campos[10].removeAttribute('hidden');
    campos[11].removeAttribute('hidden');
    campos[12].removeAttribute('hidden');
    campos[13].removeAttribute('hidden');

}

function guardarFormulario() {
    borrarTabla();
    //Capturamos el evento que ejecuta la función para evitar que haga la acción por defecto que sería refrescar
    // la página
    //e.preventDefault();

    //Borramos el mensaje del SPAN de notificaciones
    document.getElementsByTagName('span')[0].textContent = "";


    //Cogemos los datos y los guardamos en variables

    let nombre = campos[1].value;
    let apellidos = campos[2].value;
    let provincia = campos[3].value;
    let localidad = campos[4].value;
    let email = campos[5].value;

    //Creamos un objeto que contenga el objeto completo que vamos a guardar
    let nuevoCliente = {
        nombre: nombre,
        apellidos: apellidos,
        provincia: provincia,
        localidad: localidad,
        email: email
    };

    //Creamos un objeto que guarde la base de datos y la transacción. Indicamos Qué eaquema de la base de datos usamos y tipo
    //de operación a realizar.
    let transaction = db.transaction(['Clients'], "readwrite");

    //Creamos objetoObjectStore que contendrá el esquema dentro de la base de datos
    let objectStore = transaction.objectStore('Clients');

    //Añadimos el item al objeto que hemos creado con el esquema.
    let request = objectStore.add(nuevoCliente);

    //Una vez se ha completado, limpiamos el formulario
    request.onsuccess = () => {
        campos[1].value = "";
        campos[2].value = "";
        campos[3].value = "";
        campos[4].value = "";
        campos[5].value = "";
    };

    //Damos feedback de la operación en consola y en un SPAN
    transaction.oncomplete = () => {
        console.log("Transacción completada en la Base de Datps");
        //Pintamos mensaje de confirmación en el SPAN de notificaciones
        escribirmensaje("Datos guardados correctamente");
    };
    transaction.onerror = () => {
        console.log("Error: transacción no completada");
        //Pintamos mensaje de confirmación en el SPAN de notificaciones
        escribirmensaje("ERROR: transacción no completada");
    }
}

function modificarDatos() {
    //Borramos la tabla
    borrarTabla();


    //Creamos la transacción de nuestra base de datos (db) de forma que podamos leer y escribir
    let transaction = db.transaction(['Clients'], 'readwrite');

    //Creamos un objeto ObjectStore, llamando a la transacción RW que hemos creado para poder abrir un cursor usando nuestra base de datos
    let objectStore = transaction.objectStore('Clients');

    //Abrimos un cursor usando el objectStore y cuando sea exitoso definimos el cursor con los resultados
    objectStore.openCursor().onsuccess = function (e) {
        //creamos la variable cursor que nos va a recorrer la base de datos
        let cursor = e.target.result;
        //Mientras que tenga datos cursor los recogemos y que nos pinte la tabla
        if (cursor) {
            //Sacamos el valor ID del cursor para comprarlo
            let valorIdBD = Number(cursor.value.id);
            //Si el cursor coincide con el id que tenemos en el campo
            if (Number(valorIdBD) === Number(campos[0].value)) {
                //Creamos un nuevo objeto para hacer el put y modificarlo
                let nuevoObjeto = {
                    id: cursor.value.id,
                    nombre: campos[1].value,
                    apellidos: campos[2].value,
                    provincia: campos[3].value,
                    localidad: campos[4].value,
                    email: campos[5].value,
                };
                //Creamos variable para actualizar los datos donde llamamos al objectstore, método put y pasamos el objeto.
                //Importante que le tenemos que pasar el objeto.
                var requestUpdate = objectStore.put(nuevoObjeto);

                requestUpdate.onerror = function (event) {
                    escribirmensaje("No se han podido modificar los datos");
                    console.log("No se han podido modificar los datos");
                };
                requestUpdate.onsuccess = function (event) {
                    escribirmensaje("Datos borrados correctamente");
                    console.log("Modificado");
                }

            } else {
                cursor.continue();
            }
        }
    }
}


function listarFormulario() {
    borrarTabla();

    //Creamos un objeto ObjectStore para empezar la transacción y poder abrir un cursor usando nuestra base de datos
    let objectStore = db.transaction('Clients').objectStore('Clients');

    //Abrimos un cursor usando el objectStore y cuando sea exitoso definimos el cursor con los resultados
    objectStore.openCursor().onsuccess = function (e) {
        //Ya tenemos la variable cursor
        let cursor = e.target.result;

        //Mientras que tenga datos cursor los recogemos y que nos pinte la tabla
        if (cursor) {
            //Creamos los elemento que necesitamos para montar una tabla.
            // Primero creamos la fila de la tabla
            //Creamos cada <td> con el nombre de cada campo que vamos a necesitar
            let tablerow = document.createElement('tr'), cellID = document.createElement('td'),
                cellNombre = document.createElement('td'), cellApellidos = document.createElement('td'),
                cellLocalidad = document.createElement('td'), cellProvincia = document.createElement('td'),
                cellEmail = document.createElement('td');

            //Añadimos los hijos <td> al elemento padre que hemos creado <tr>
            tablerow.appendChild(cellID);
            tablerow.appendChild(cellNombre);
            tablerow.appendChild(cellApellidos);
            tablerow.appendChild(cellApellidos);
            tablerow.appendChild(cellLocalidad);
            tablerow.appendChild(cellProvincia);
            tablerow.appendChild(cellEmail);

            //Añadimos el padre que hemos creado <tr> al table body que tenemos como constante en el incio.
            document.getElementById("tbody").appendChild(tablerow);
            document.getElementById("contenedor").setAttribute("style", "margin-top: 20px;");

            //Añadimos los datos sacados del cursor a cada elemento
            cellID.textContent = cursor.value.id;
            cellNombre.textContent = cursor.value.nombre;
            cellApellidos.textContent = cursor.value.apellidos;
            cellLocalidad.textContent = cursor.value.localidad;
            cellProvincia.textContent = cursor.value.provincia;
            cellEmail.textContent = cursor.value.email;

            //Se le dice que continue con el siguiente hasta que cursor esté vacío.
            console.log("Clientes mostrados en listado");
            cursor.continue();

        }
        //Si no encuentra nada
        else {
            //Si no tiene hijos el cuerpo de la tabla
            if (!document.getElementById("tbody").firstChild) {
                escribirmensaje("No se han encontrado datos");
                console.log("No hay datos");
            }
        }
    };
    campos[10].disabled = true;
}


function mostrarDatos() {
    borrarTabla();
    //Guardamos el valor del formulario Id en una variable
    let idCliente = Number(prompt("Introducir ID de cliente"));
    //Controlamos que nos venga un número para ejecutar los pasos sino mostramos mensaje de error
    //Creamos un objeto ObjectStore para empezar la transacción y poder abrir un cursor usando nuestra base de datos
    let objectStore = db.transaction('Clients').objectStore('Clients');

    //Abrimos un cursor usando el objectStore y cuando sea exitoso definimos el cursor con los resultados
    objectStore.openCursor().onsuccess = function (e) {
        //Ya tenemos la variable cursor
        let cursor = e.target.result;
        //Mientras que tenga datos cursor los recogemos y que nos pinte la tabla
        if (cursor) {
            //Si el cursor coincide con el id introducido
            let valorIdBD = Number(cursor.value.id);
            if (Number(valorIdBD) === Number(idCliente)) {
                //Añadimos los datos sacados del cursor a cada elemento
                let campos = document.getElementsByTagName("input");
                //Ojo poner CURSOR.VALUE.[clave] para sacar el valor
                campos[0].value = cursor.value.id;
                campos[1].value = cursor.value.nombre;
                campos[2].value = cursor.value.apellidos;
                campos[3].value = cursor.value.provincia;
                campos[4].value = cursor.value.localidad;
                campos[5].value = cursor.value.email;
                //Se le dice que continue con el siguiente hasta que cursor esté vacío.
                console.log("Clientes mostrados en listado");
                escribirmensaje("Cliente encontrado. Mostrando datos en el formulario");
                campos[7].removeAttribute('hidden');
                campos[6].removeAttribute('hidden');
            } else {
                cursor.continue();
            }
            //Si no encuentra nada que lo marque por consola y resetee el valor de ID del formulario
        } else {
            escribirmensaje(`El ID ${idCliente} no existe. No se han encontrado datos`);
            console.log("El ID seleccionado no existe. No se han encontrado datos ");
            document.getElementById('id').value = "";
        }
    };
    campos[6].style.visibility = "visible";
    campos[7].style.visibility = "visible";
    campos[9].disabled = true;
    campos[10].disabled = true;
}


function borrarDatos() {
    borrarTabla();
    //Guardamos el valor del formulario Id en una variable
    let idCliente = Number(document.getElementById('id').value);

    //Controlamos que nos venga un número para ejecutar los pasos sino mostramos mensaje de error
    //Creamos la transacción
    let transaction = db.transaction(['Clients'], 'readwrite');
    //Creamos el objectStore
    let objectStore = transaction.objectStore('Clients');
    //guardamos la petición en una variable
    let request = objectStore.delete(idCliente);

    //Si la transacción se copmpleta con éxito mostramos feedback positivo
    transaction.oncomplete = () => {
        console.log(`¡Cliente ${idCliente} ha sido eliminado!`);
        escribirmensaje(`¡Cliente ${idCliente} ha sido eliminado!`);
    };
    //Si la transacción devuelve algún error con éxito mostramos feedback negativo

    transaction.onerror = () => {
        console.log(`¡El Id ${idCliente} no existe!`);
        escribirmensaje(`¡El Id ${idCliente} no existe!`);
    };
    borrarCampos();
    campos[6].style.visibility = "hidden";
    campos[7].style.visibility = "hidden";
    campos[9].disabled = false;
}

function crearNuevo() {
    borrarCampos();
    campos[6].style.visibility = "hidden";
    campos[7].style.visibility = "hidden";
}

function borrarCampos() {
    //Ojo poner CURSOR.VALUE.[clave] para sacar el valor
    campos[0].value = "";
    campos[1].value = "";
    campos[2].value = "";
    campos[3].value = "";
    campos[4].value = "";
    campos[5].value = "";
}

function borrarTabla() {
    //Borramos todos los elementos pintados de la lista en caso que haya algo. Mientras la lista tenga primerHijo,
    // borramos hijo de la lista que sea este primer hijo.
    while (tablaDatos.firstChild) {
        tablaDatos.removeChild(tablaDatos.firstChild);
    }
    document.getElementById('contenedor').setAttribute("style", "margin-top: 20px; display: none");
}

//Mostramos una alerta de una duración determinada cada vez que haya que dar feedback al usuario
function escribirmensaje(mensaje) {
    const segundos = 3;
    //Recogemos el span donde queremos mostrarla y la pintamos
    document.getElementsByTagName('span')[0].textContent = mensaje;
    //Creamos un intervalo de tiempo de X segundos para que se mentenga visible y llamamos a la función
    let cuentaAtras = setInterval(quitarMensaje, segundos * 1000);

    //Borra el mensaje pasados X segundos y quita el intervalo
    function quitarMensaje() {
        document.getElementsByTagName('span')[0].textContent = "";
        clearInterval(cuentaAtras);
    }
}
