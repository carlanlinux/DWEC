/* Cuando el documento esté completamente cargado se hará ua llamada a la función inicializar(). De esta forma,
nos aseguramos que todos los objetos estén disponibles para trabjar en las asignaciones de los eventos. */


window.onload = inicializar;

//----------------------------------------------------------//

//Inicializamos la validación y primero comprobamos si la cookie tiene algún valor en contador.
function inicializar() {
    // Borramos la cookie si existe anteriormente para empezar a contar desde 0.
    borrarCookie("contador");

    //Hacemos que se cargue la función de cambiar el texto a mayus que se tiene que hacer en todos los casos.
    aMayus();
    document.getElementById("enviar").addEventListener('click', validar, false);


    //Si existe el valor en la cookie entonces llamamos al evento que se va a encargar de la validación
    if (document.cookie[contador] != null) {

        //Si no existe el contador en la cookie lo creamos y lo igualamos a 0
    } else {
        crearCookie();
    }

}


function validar(evento) {
    /*
        En la variable que pongamos aquí gestionaremos el evento por defecto asociado al botón de "enviar"
        (type=submit) que en este caso lo que hace por defecto es enviar un formulario.
    */
    if (validarTexto(this) && validadNIF() && validarProvincia() && validarFecha() && validarHora()
        && validarTelefono() && validarEmail() && confirm("¿Deseas enviar el formulario?")) {
        return true;

    } else {
        evento.preventDefault();
        intentosCookie();
        return false;
    }

}


//Función para crear una coockie con inicializando el contador a 0
function crearCookie() {
    document.cookie = "contador=0";
}

//Cuando se da al botón enviar, si ha habido algún error, ponemos en el div el número de intentos.
function intentosCookie() {
    let intentos = parseInt(document.cookie[contador]);
    document.cookie = "contador=" + intentos++;
    document.getElementById("intentos").innerHTML = "Intentos de envío del formulario:" + intentos + 1;

}

//Función para poner el texto en mayúsculas cuando se quite el foco
function aMayus() {
    //Usamos una función anónima para hacer el cambio de valor
    document.getElementById("nombre").addEventListener("blur", function () {
        document.getElementById("nombre").value = document.getElementById("nombre").value.toUpperCase();
    }, false);

    document.getElementById("apellidos").addEventListener("blur", function () {
        document.getElementById("apellidos").value = document.getElementById("apellidos").value.toUpperCase();
    }, false)

}

function validarNombre() {
    if (document.getElementById("nombre").value === "" || document.getElementById("apellido").value === "") {

    }

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

    }

    // Recorrer todos los elementos del formulario, buscando los que son de tipo texto y validar que contengan valor.
    for (let i = 0; i < formulario.elements.length; i++) {

        if (formulario.elements[i].type === "text" && formulario.elements[i].value === "") {
            //Pintamos mensaje en el contenedor
            document.getElementById("errores").innerHTML = "El campo" + formulario.elements[i].name +
                "no puede estar en blanco.";
            //Asignamos clase error para que se active el CSS en rojo
            formulario.elements[i].className = "error";
            //Ponemos el foco en el elemento en cuestión que no pasa la validación.
            formulario.elements[i].focus();
            return false;
        }

        // Aprovechamos y dentro de la función validamos también la edad buscando el elemento
        else if (formulario.elements[i].id === "edad") {
            //Si vemos que no contiene un número o que sea negativo o mayor de 120 no lo damos por válido.

            if (isNaN(formulario.elements[i].value) || formulario.elements[i].value < 0 || formulario.elements[i].value > 120) {
                //Pintamos mensaje en el contenedor
                document.getElementById("errores").innerHTML = "El campo" + formulario.elements[i].name + " tiene" +
                    "valores incorrectos. Edad debe estar comprendida entre 0 y 120";
                //Asignamos clase error para que se active el CSS en rojo
                formulario.elements[i].className = "error";
                //Ponemos el foco en el elemento en cuestión que no pasa la validación.
                formulario.elements[i].focus();
                return false;
            }
        } else {
            document.getElementById("email").className = "";
            return true;
        }
    }

}


function validadNIF() {
    //Metemos el valor del campo dni en una variable para luego llevar a cabo el test.
    let dni = document.getElementById("dni").value;
    //Creamos el patrón a seguir con: 8 caracteres decimales, seguidos de un guión y de un caracter no dígito
    let patron = /^\d{8}\s-\[A-Z]$/;
    //Compronamos que cuando no coincida el valor con el patrón salte el error y ponga el foco.
    if (!patron.test(dni)) {
        document.getElementById("errores").innerHTML = "El número de DNI introducido no es correcto";
        document.getElementById("dni").className = "error";
        document.getElementById("dni").focus();
        return false
    } else {
        //Quitamos el elemento de la clase error (Por si previamente había dado error)
        document.getElementById("email").className = "";
        return true;
    }
}

function validarEmail() {
    //Metemos el valor del mail en una variable
    let email = document.getElementById("email").value;
    /*    Creamos el patrón con la expresión regular de forma que:
        /\S+@ --> Metemos más de una cadena de texto hasta llegar a una arroba
        \S+ -->.Se mete tra cadena de texto hasta llegar a un punto
        \S+/ --> Se sigue con otra cadena de texto después del punto */
    let patron = /\S+@\S+\.\S+/;

    if (!patron.test(email)) {
        document.getElementById("errores").innerHTML = "El emaail introducido no es correcto";
        document.getElementById("email").className = "error";
        document.getElementById("email").focus();
        return false;
    } else {
        document.getElementById("email").className = "";
        return true;
    }
}

function validarProvincia() {
    /* Nos recorremos el array de los select con las provincias. Empezamos en 1 porque la posición no es una provincia
    Válida sino forma parte del menú*/
    for (let i = 1; i < document.getElementById("provincia").options.length; i++) {
        //Si la posición del array de select está seleccionada entonces me quita la clase de error y me devuelve verdadero
        if (document.getElementById("provincia").options[i].selected) {
            document.getElementById("provincia").className = "";
            return true;
        } else {
            document.getElementById("errores").innerHTML = "Debe seleccionar una provincia";
            document.getElementById("provincia").className = "error";
            document.getElementById("provincia").focus();

        }
    }
    return false;
}

function validarFecha() {
    /*    No se me ocurre cómo validarlo con regExp, además, lo que he encontrado por internet eran unos tochos bastante
        ininteligibles. Si se pudiera tocar el HMTL pondría type fecha al campo y evitaba esta validación. */
    let patron = /\d{2}\s-\d{2}\s-\d{4}/;

    if (!patron.test(document.getElementById("fecha").value)) {
        document.getElementById("errores").innerHTML = "La fecha introducida no es correcta";
        document.getElementById("fecha").className = "error";
        document.getElementById("fecha").focus();
        return false;

    } else {
        document.getElementById("email").className = "";
        return true;
    }
}

function validarTelefono() {
    let patron = /\d{9}/;
    if (!patron.test(document.getElementById("telefono").value)) {
        document.getElementById("errores").innerHTML = "El teléfono introducido es incorrecta";
        document.getElementById("telefono").className = "error";
        document.getElementById("telefono").focus();
        return false;
    } else {
        document.getElementById("telefono").className = "";
        return true;
    }
}

function validarHora() {
    let patron = /\d{2}\s:\d{2}/;
    if (!patron.test(document.getElementById("hora").value)) {
        document.getElementById("error").innerHTML = "La hora introducida no es correcta";
        document.getElementById("hora").className = "error";
        document.getElementById("hora").focus();
        return false;
    }
    document.getElementById("telefono").className = "";
    return true;

}

//función para crear la cookie contador
crearCookie();
{
    document.cookie = "contador=0";
}

//función para leer la cookkie contador:
leerCookie(nombre);
{

}