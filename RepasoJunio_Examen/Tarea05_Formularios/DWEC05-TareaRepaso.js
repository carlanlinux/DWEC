/* Cuando el documento esté completamente cargado se hará ua llamada a la función inicializar(). De esta forma,
nos aseguramos que todos los objetos estén disponibles para trabjar en las asignaciones de los eventos. */


window.onload = inicializar;

//----------------------------------------------------------//
function inicializar() {
    // Cuando el documento esté cargado asignaremos los eventos siguientes.
// Al hacer click en el botón de enviar tendrá que llamar a la validación del miformulario.
    document.getElementById("enviar").addEventListener('click', validar, false);

    // Asignamos que cuando pierda el foco el Nombre y los apellidos ponga en mayúsculas las Iniciales.
    document.getElementById("nombre").addEventListener('blur', mayusculas, false);
    document.getElementById("apellidos").addEventListener('blur', mayusculas, false);
}

function validar(eventoPorDefecto) {
    if (contadorIntentos() && validarNombreApellidos() && validarEdad() && validarNIF() && validarEmail() && validarProvincia()
        && validarFecha() && validarTelefono() && validarHora() && confrimarEnvio()) {
        return true;
    } else {
        // Cancelamos el evento de envío por defecto asignado al boton de submit enviar.
        eventoPorDefecto.preventDefault();
        return false; // Sale de la función devolviendo false.
    }
}

function mayusculas() {
    //Cogemos el campo que ha llamado a la función con this y le asignamos su valor a su valor en mayus
    this.value = this.value.toUpperCase();
}

function validarEdad() {
    let campoEdad = document.getElementById("edad");
    campoEdad.className = "";
    //Si no es un número y la edad es menor de 0 y mayor de 120 años da error
    if (isNaN(parseInt(campoEdad.value)) || campoEdad.value < 0 || campoEdad.value > 120) {
        document.getElementById("errores").innerHTML = "Error: Edad debe estar comprendida entre 0 y 120";
        //Asignamos clase error para que se active el CSS en rojo
        campoEdad.className = "error"
        //Ponemos el foco en el elemento que ha dado error y no pasa la validación
        campoEdad.focus();
        //Devolvemos falso si no pasa la validación
        return false;
    }
    // Si llega aquí la edad está dentro de los límites y se le deja la clase en blanco
    return true;
}

function validarNombreApellidos() {
    //Nos guardamos todas las etiquetas input de la página
    let formulario = document.getElementsByTagName('input');
    //Nos recorremos el array de etiquetas solo en la primera y la segunda donde esta nombre y apellidos
    for (let i = 0; i < 2; i++) {
        formulario[i].className = "";
        //Si el tipo del campo es texto y está vacío pintamos mensaje, ponemos foco y clase error y devolvemos falso
        if ((formulario[i].name === 'nombre' || formulario[i].name === 'apellidos') && formulario[i].value === "") {
            document.getElementById("errores").innerHTML = `El campo ${formulario[i].name} no puede estar vacío`;
            formulario[i].focus();
            formulario[i].className = "error";
            return false;
        }
    }
    //Si no ha devuelto false durante el bucle devolverá true
    return true;
}

function validarNIF() {
    let campoNif = document.getElementById('nif');
    //Quitamos el elemento de la clase error (Por si previamente había dado error)
    campoNif.className = "";
    // 8 números - Letra
    let patron = new RegExp(/^\d{8}-[A-Z]$/);
    //si no cumple el patrón
    if (!patron.test(campoNif.value)) {
        document.getElementById("errores").innerHTML = "Error: El número de DNI introducido no es correcto.<br />Formato 8 digitos-Letra Mayúscula";
        campoNif.className = "error";
        campoNif.focus();
        return false;
    }
    //si llega aquí es que pasa la validación
    return true;
}

function validarEmail() {
    let campoEmail = document.getElementById("email");
    //Quitamos el elemento de la clase error (Por si previamente había dado
    campoEmail.className = "";
    let patron = new RegExp(/^[\w-.]{2,}@([\w-]{2,}\.)+([\w-]{2,4})$/);
    //Si no cumple el patrón
    if (!patron.test(campoEmail.value)) {
        document.getElementById("errores").innerHTML = "Error: El email introducido no es correcto";
        campoEmail.className = "error";
        campoEmail.focus();
        return false;
    }
    //si llega aquí es que pasa la validación
    return true;
}

function validarProvincia() {
    let campoProvincia = document.getElementById("provincia");
    // Eliminamos la clase error por si estuviera asignada al elemento de antes
    campoProvincia.className = "";
    //El primer option no es ninguna provincia, por lo que si está ese seleccionado (posición 0) hacer saltar error
    if (campoProvincia.selectedIndex === 0) {
        document.getElementById("errores").innerHTML = "Atención!: Debes seleccionar una PROVINCIA.";
        campoProvincia.focus();
        campoProvincia.className = "error";
        return false
    }
    //si llega aquí es que pasa la validación
    return true;
}

function validarFecha() {
    let campoFecha = document.getElementById("fecha");
    //Se puede usar quitando el atributo clase
    campoFecha.removeAttribute('class');
    /*
   /^((0?[1-9])|(1\d)|(2\d)|(3[0-1])) --> Debe empezar por 0 (no obligatorio) y un número del 1 al 9, ó por 1 y un
   dígito decimal, ó por 2 y un dígito decimal, ó por 3 y un dígito entre el 0 y el 1.
   [-|\/] --> Acepta un guión o una barra inclinada.
   ((0?[1-9])|(1[0-2])) --> 0 (no obligatorio) y un dígito entre el 1 y el 9, ó un 1 seguido de dígitos entre el 0 y el 2
   [-|\/] --> Acepta un guión o una barra inclinada.
   ([1-2]\d{3})$/ --> Un dígito entre el 1 y el 2 (por 1000 o 2000) seguido de 3 dígitos numéricos
 */
    let patron = new RegExp(/^((0?[1-9])|(1\d)|(2\d)|(3[0-1]))[-|\/]((0?[1-9])|(1[0-2]))[-|\/]([1-2]\d{3})$/);

    // Se puede simplificar con dos patrones del tipo dd-mm-aaaa o bien dd/mm/aaaa
    let patron1 = /^\d{2}-\d{2}-\d{4}$/;
    let patron2 = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!patron.test(campoFecha.value)) {
        document.getElementById("errores").innerHTML = "El campo: FECHA está incorrecto.<br />Formato dd/mm/aaaa o dd-mm-aaaa";
        campoFecha.focus();
        campoFecha.className = "error";
        return false;
    }
    //si llega aquí es que pasa la validación
    return true;
}

function validarTelefono() {
    let campoTelefono = document.getElementById("telefono");
    campoTelefono.className = "";
    /* Los teléfonos empiezan en ES por 9,6 o 7 y está formado por 9 numeros (Excluimos 800 de uso empresarial)
    /^[69]\ --> Empieza por 6, 7 o 9
    \d{8}$/ --> 8 números.  */
    let patron = new RegExp(/^[679]\d{8}$/);
    if (!patron.test(campoTelefono.value)) {
        document.getElementById("errores").innerHTML = "Error: El teléfono introducido es incorrecta";
        campoTelefono.focus();
        campoTelefono.className = "error";
        return false
    }
    //si llega aquí es que pasa la validación
    return true;
}

function validarHora() {
    let campoHora = document.getElementById("hora");
    // Eliminamos la clase error asignada al elemento hora.
    campoHora.className = "";

    // 4 números separados por :
    let patron = /^(0?[1-9]|1\d|2[0-3]):([0-5]?\d)$/;

    if (!patron.test(campoHora.value)) {
        document.getElementById("errores").innerHTML = "El campo: HORA está incorrecto.<br/>Formato: HH:MM";
        campoHora.focus();
        campoHora.className = "error";
        return false;
    }
    return true;
}

function contadorIntentos() {
    let contador = 0;
    //si no existe la cookie se crea y se graba el texto contador=0;
    if (document.cookie === "") {
        document.cookie = "contador=0";
    }
    //Sacamos de la cookie el valor
    contador = parseInt(document.cookie.substring(9));
    contador++;
    document.cookie = `contador=${contador}`;
    document.getElementById("intentos").innerHTML = `Intentos de envío del formulario: ${contador}`;
    //Mandamos un return true para que pase la validacion antes del envío.
    return true
}

function confrimarEnvio() {
    document.getElementById("errores").innerHTML = "";
    return confirm("¿Deseas enviar el formulario?");
}
