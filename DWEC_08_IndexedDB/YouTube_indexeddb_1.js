const idb = indexedDB;

if (idb) {
    let db;
    //ESte método permite acceder a la base de datos. Recibe el nombre de la base de datos y segundo la versión de la
    // base de datos. Tienen qe ser números enteros. Con distintas versiones crea distinas base de datos
    const request = idb.open('tasklist', 1);

    //Sólo se ejecuta a la hora de acceder a la base de datos por primera vez
    request.onsuccess = () => {
        db = request.result;
        console.log('OPEN', db);

    };

    //Una vez está la página linkada, ya se usa este método para todas las operaciones
    request.onupgradeneeded = () => {
        db = request.result;
        console.log('Create', db);
        //Aquí damos el nombre al ammacén de datos. Puedes crear tantos almacenes como se quieran.
        const objectStore = db.createObjectStore('tareas');
        const objectStore2 = db.createObjectStore('chuches');
    };

    request.onerror = (error) => {
        console.log("Error", error)
    }
}
