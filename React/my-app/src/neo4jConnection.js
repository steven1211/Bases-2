const neo4j = require('neo4j-driver');


const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "p455word"));

//Read or write
const session = driver.session({});
//const session = driver.session({ defaultAccessMode: neo4j.session.READ });

export function setup(){
    const neo4j = require('neo4j-driver');
    const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "p455word"));
    const session = driver.session({});
}


//Create Person node with a certain name
export function createPerson(personName){
    if(personName === undefined){
        personName = "";
    }

    try{
        session.writeTransaction(tx => {
            tx.run("CREATE (p:Person { name: $name })", { name: personName });
        });
    } catch(err){
        console.log("Could not create Person named " + personName + " in database");
    }

};

export function makeFriends (tx, name1, name2) {
    return tx.run(
      'MATCH (a:Person {name: $name1}) ' +
        'MATCH (b:Person {name: $name2}) ' +
        'MERGE (a)-[:KNOWS]->(b)',
      { name1: name1, name2: name2 }
    )
  };

var num = 0;

export function getCount(){
    /*session.readTransaction(tx => {
        return tx.run(cypher).
    });*/
    const cypher = 'MATCH (n) RETURN count(n) as num';
    //const num = 0;
    var self = this;
    session.run(cypher)
        .then(function (result, num) {
            //On result, get count from first record
            const count = result.records[0].get('num');
            //Log response
            console.log(count.toString());
            //num = count.toString();
            //console.log(num);
            self.num = count.toString();
        })
        .catch( e => {
            //Output the error
            console.log("error");
            console.log(e);
        })
        return self.num;
        ;
        
}

/*try{
    const result = session.writeTransaction(tx =>
        tx.run(
            'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
            {message: 'hello, world'}
        )
    )

    const singleRecord = result.records[0]
    const greeting = singleRecord.get(0)

    console.log(greeting)
} finally{
    session.close()
}*/




