const db = new Dexie('MyDatabase');
db.version(1).stores({
    contacts: '++id, firstName, lastName'
})

db.contacts.put({firstName: "Manny", lastName: "Henri"});
db.contacts.put({firstName: "Julia", lastName: "Henri"});
//Borrar posición array base de datos
db.contacts.delete(1);
