/* Cuando el documento esté completamente cargado se hará ua llamada a la función inicializar(). De esta forma,
nos aseguramos que todos los objetos estén disponibles para trabjar en las asignaciones de los eventos. */


window.onload = inicializar;

//----------------------------------------------------------//

//Inicializamos la validación y primero comprobamos si la cookie tiene algún valor en contador.
function inicializar() {
    // Borramos la cookie si existe anteriormente para empezar a contar desde 0.
    crearCookie("contador");

    //Hacemos que se cargue la función de cambiar el texto a mayus que se tiene que hacer en todos los casos.
    document.getElementById("nombre").addEventListener("blur", aMayus, false);
    document.getElementById("apellidos").addEventListener("blur", aMayus, false);
    document.getElementById("enviar").addEventListener('click', validar, false);
    leerCookie("contador");
}


function validar(evento) {
    //Sumar 1 intento
    var intentos = leerCookie("contador") + 1;

    //Creamos la Cookie si no está creada. Si está metemos el nuevo número de intentos.
    crearCookie("contador", intentos);

    //Mostrarmos el valor de la cookie en el Div
    document.getElementById("intentos").innerHTML = "Intentos de envío del formulario:" + intentos;

    //Validamos cada uno de los apartados con llamadas a las funciones de validación
    if (validarTexto(this) && validarEdad() && validadNIF() && validarEmail() && validarProvincia() && validarFechas() && validarTelefonos() && validarHora() && confirm("¿Deseas enviar el formulario?")) {
        return true;

    } else {
        //Cancelamos el envio del formulario
        evento.preventDefault();
        return false; // Salimos de la función devolviendo falso
    }

}


//Función para poner el texto en mayúsculas cuando se quite el foco
function aMayus() {
        document.getElementById("nombre").value = document.getElementById("nombre").value.toUpperCase();
        document.getElementById("apellidos").value = document.getElementById("apellidos").value.toUpperCase();
}


function validarTexto(objeto) {
    /* Le pasamos un objeto, el botón de enviar. Con el validarcampostexto(this) hace referencia al objeto dónde se
    programó ese evento, el botón de enviar. */

    // La propiedad form del botón enviar contiene la referencia del formulario dónde está ese botón submit.
    var formulario = objeto.form;

    /* Nos recorremos el formulario y comprobamos que en el caso que algún campo tenga como clase error la quitamos para
    evitar que nos marquen en rojo cosas que están correctas y que pasan la validación. */
    for (let i = 0; i < formulario.elements.length; i++) {
        formulario.elements[i].className = "";
        //buscando los que son de tipo texto y validar que contengan valor.
        if (formulario.elements[i].type === "text" && formulario.elements[i].value === "") {
            //Pintamos mensaje en el contenedor
            document.getElementById("errores").innerHTML = "El campo " + formulario.elements[i].name + " no puede estar en blanco.";
            //Asignamos clase error para que se active el CSS en rojo
            formulario.elements[i].className = "error";
            //Ponemos el foco en el elemento en cuestión que no pasa la validación.
            formulario.elements[i].focus();
            return false;
        }
    }
    //Si ha llegado aquí quiere decir que todos los campos se han validado correctamente
    return true;
}


function validarEdad() {
    //Si no es un número y la edad es menor de 0 y mayor de 120 años da error
    if (isNaN(document.getElementById("edad").value) || document.getElementById("edad").value < 0 ||
        document.getElementById("edad").value > 120) {
        //Pintamos mensaje en el contenedor
        document.getElementById("errores").innerHTML = "Error: Edad debe estar comprendida entre 0 y 120";
        //Asignamos clase error para que se active el CSS en rojo
        formulario.elements[i].className = "error";
        //Ponemos el foco en el elemento en cuestión que no pasa la validación.
        formulario.elements[i].focus();
        return false;
    }
    // Si llega aquí la edad está dentro de los límites y se le deja la clase en blanco
    document.getElementById("edad").className = "";
    return true;

}



function validadNIF() {
    //Metemos el valor del campo dni en una variable para luego llevar a cabo el test.
    let dni = document.getElementById("nif").value;
    //Creamos el patrón a seguir con: 8 caracteres decimales, seguidos de un guión y de un caracter de A a Z
    let patron = /^\d{8}-[A-Z]$/;
    //Compronamos que cuando no coincida el valor con el patrón salte el error y ponga el foco.
    if (!patron.test(dni)) {
        document.getElementById("errores").innerHTML = "Error: El número de DNI introducido no es correcto";
        document.getElementById("nif").className = "error";
        document.getElementById("nif").focus();
        return false
    }
    //si llega aquí es que pasa la validación
    //Quitamos el elemento de la clase error (Por si previamente había dado error)
    document.getElementById("nif").className = "";
    return true;
}

function validarEmail() {
    //Metemos el valor del mail en una variable
    let email = document.getElementById("email").value;
    /*    Creamos el patrón con la expresión regular de forma que:
    [\w-.]{2,} --> 2 ó más caracteres alfanuméricos, incluyendo el guión y el punto, seguido de un símbolo @
    ([\w-]{2,}\.) -->  2 ó más caracteres alfanuméricos incluido el guión y finalizando en un punto.
    +([\w-]{2,4})$ -->  Terminará con 2 a 4 caracteres alfanuméricos incluidos el guión
     */


    let patron = /^[\w-.]{2,}@([\w-]{2,}\.)+([\w-]{2,4})$/;
    //Si no se cumple el patrón
    if (!patron.test(email)) {
        document.getElementById("errores").innerHTML = "Error: El email introducido no es correcto";
        document.getElementById("email").className = "error";
        document.getElementById("email").focus();
        return false;
    }
    //si llega aquí es que pasa la validación
    //Quitamos el elemento de la clase error (Por si previamente había dado
    document.getElementById("email").className = "";
    return true;
}

function validarProvincia() {
    /* Nos recorremos el array de los select con las provincias. Empezamos en 1 porque la posición no es una provincia
    Válida sino forma parte del menú*/
    for (let i = 1; i < document.getElementById("provincia").options.length; i++) {
        //Si la posición del array de select está seleccionada entonces me quita la clase de error y me devuelve verdadero
        if (document.getElementById("provincia").options[i].selected) {
            document.getElementById("provincia").className = "";
            return true;
        }
    }
    //si llega aquí es que no hay seleccionada ninguna provincia
    document.getElementById("errores").innerHTML = "Error: Debe seleccionar una provincia";
    document.getElementById("provincia").className = "error";
    document.getElementById("provincia").focus();
    return false;
}

function validarFechas() {
    /*
       /^((0?[1-9])|(1\d)|(2\d)|(3[0-1])) --> Debe empezar por 0 (no obligatorio) y un número del 1 al 9, ó por 1 y un
       dígito decimal, ó por 2 y un dígito decimal, ó por 3 y un dígito entre el 0 y el 1.
       [-|\/] --> Acepta un guión o una barra inclinada.
       ((0?[1-9])|(1[0-2])) --> 0 (no obligatorio) y un dígito entre el 1 y el 9, ó un 1 seguido de dígitos entre el 0 y el 2
       [-|\/] --> Acepta un guión o una barra inclinada.
       ([1-2]\d{3})$/ --> Un dígito entre el 1 y el 2 (por 1000 o 2000) seguido de 3 dígitos numéricos
     */
    patron = /^((0?[1-9])|(1\d)|(2\d)|(3[0-1]))[-|\/]((0?[1-9])|(1[0-2]))[-|\/]([1-2]\d{3})$/;

    //si no cumple el patrón:
    if (!patron.test(document.getElementById("fecha").value)) {
        document.getElementById("errores").innerHTML = "La fecha introducida no es correcta";
        document.getElementById("fecha").className = "error";
        document.getElementById("fecha").focus();
        return false;

    }
    //si llega aquí es que pasa la validación
    //Quitamos el elemento de la clase error (Por si previamente había dado
    document.getElementById("email").className = "";
    return true;
}

function validarTelefonos() {
    /* Los teléfonos empiezan en ES por 9,6 o 7 y está formado por 9 numeros
    /^[69]\ --> Empieza por 6 o 9
    \d{8}$/ --> 8 números.
    */
    let patron = /^[679]\d{8}$/;

    if (!patron.test(document.getElementById("telefono").value)) {
        document.getElementById("errores").innerHTML = "Error: El teléfono introducido es incorrecta";
        document.getElementById("telefono").className = "error";
        document.getElementById("telefono").focus();
        return false;
    }
    //si llega aquí es que pasa la validación
    //Quitamos el elemento de la clase error (Por si previamente había dado
    document.getElementById("telefono").className = "";
    return true;
}

function validarHora() {
    /*
    /^(0?[1-9]|1\d|2[0-3]) --> Comenzamos con un 0 (no obligatorio) y un dígito del 1 al 9, ó un 1 y un dígito numérico
    (hasta las 19 horas), ó un 2 y un dígito de 0 a 3 (hasta las 23)
    : --> dos puntos
    ([0-5]?\d)$/ --> un dígito entre el 0 y el 5 (no obligatorio) y un dígito cualquiera (No puede superar lo 59 segundos)
    */

    let patron = /^(0?[1-9]|1\d|2[0-3]):([0-5]?\d)$/;
    if (!patron.test(document.getElementById("hora").value)) {
        document.getElementById("error").innerHTML = "Error: La hora introducida no es correcta";
        document.getElementById("hora").className = "error";
        document.getElementById("hora").focus();
        return false;
    }
    //si llega aquí es que pasa la validación
    //Quitamos el elemento de la clase error (Por si previamente había dado
    document.getElementById("hora").className = "";
    return true;

}

//función para crear la cookie contador
function crearCookie(nombre, intentos) {
    if (intentos) {
        document.cookie = nombre + "=" + intentos;
    } else {
        document.cookie = nombre + "=0";
    }

}

//Leemos el nombre de la cookie
function leerCookie(nombre) {
    //Guardamos el nombre de la cookie seguido del igual
    let cookie = document.cookie;

    //Devolvemos el número de intentos haciendo split en la cookie
    //Se devuelve el array 1 porque al separar,  la primera posición del array (0) está vacía, no hay nada y por eso
    //Tenemos que devolver la posición 1.
    return parseInt(cookie.split(nombre + "=")[1]);

}
