//const { Product } = require('./product.js')
const { DocumentStore } = require('ravendb')

const store = new DocumentStore(["http://127.0.0.1:8080"],"AmazonPlus");                       // Default database that DocumentStore will interact with

    const conventions = store.conventions;  // DocumentStore customizations

    store.initialize();                    

class Product{
        constructor(name,price){
            this.price = price;
            this.Name = name;
        }
    }

cargar()
async function cargar() {
    const session = store.openSession();                // Open a session for a default 'Database'

    //const category = new Category("Database Category");

    //await session.store(category);                      // Assign an 'Id' and collection (Categories)
    // and start tracking an entity

    const product1 = new Product("Kenito Rules",100);

    await session.store(product1);                       // Assign an 'Id' and collection (Products)
    // and start tracking an entity

    await session.saveChanges();                        // Send to the Server
    // one request processed in one transaction
    store.dispose();
}