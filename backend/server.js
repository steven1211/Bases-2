const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const redis = require('redis');
const session = require('express-session');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const User = require('./user');
const Product = require('./ProductSchema');
const Conversation = require('./ConversationSchema');
const crypto = require('crypto');
const mysql = require("mysql");
let RedisStore = require('connect-redis')(session);
const Neode = require('neode');

const API_PORT = 3001;
const app = express();
app.use(cors());
//const router = express.Router();

// append /api for our http requests
//app.use('/api', router);

// launch our backend into a port
app.listen(3001, () => console.log(`LISTENING ON PORT ${API_PORT}`));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));



/////////////////////////////
////   NEO4J CONNECTION
////////////////////////////

const neo4jConnection = new Neode('bolt://localhost:7687','neo4j', '123');
neo4jConnection.setEnterprise(true);

neo4jConnection.with({
    User: require('./neo4j/userModel'),
    Category: require('./neo4j/categoryModel')
})

/////////////////////////////
////   REDIS CONNECTION
////////////////////////////
let redisClient = redis.createClient();
// checks if connection with redis is successful
redisClient.on('connect', function () {
    console.log('------->>> REDIS CLIENT CONNECTED <<<------');
});
redisClient.on('error', function (error) {
    console.log('------->>> FAILED CONNECTION WITH REDIS <<<------')
    console.error(error);
});

app.use(session({
    store: new RedisStore({ client: redisClient,ttl:260 }),
    secret: 'secret word',
    resave: false,
    saveUninitialized: false
}));


//////////////////////////////
///   MONGODB CONNECTION
//////////////////////////////
const dbRoute =
    //'mongodb+srv://DCheng:wyIldsyMozyEZO0X@amazonplus-c7ziv.mongodb.net/AmazonPlus?retryWrites=true&w=majority';
    'mongodb+srv://DCheng:wyIldsyMozyEZO0X@amazonplus-c7ziv.mongodb.net/AmazonPlus?authSource=admin&replicaSet=AmazonPlus-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true'
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once('open', () => console.log('------->>> MONGO CLIENT CONNECTED <<<------'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, '------->>> FAILED CONNECTION WITH MONGO DB <<<------:'));


/////////////////////////////
///  MYSQL CONNECTION
/////////////////////////////
let mysqlConnection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "12345",
        database: "PROGRA"
    }
)
mysqlConnection.connect((err) => {
    if (!err)
        console.log('------->>> MYSQL CLIENT CONNECTED <<<------');
    else
        console.log("------->>> FAILED CONNECTION WITH MYSQL <<<------" + JSON.stringify(err, undefined, 2));

}

);

//Salt generator for password encryption
function saltGenerator(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));

//Hash Creator for password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest("hex");
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
});

////////////////////////
//// NEO4J QUERIES
////////////////////////

//Get friends
app.get('/getFriends', function(req, res){ 
    neo4jConnection.cypher(
        'MATCH(:User { _id: $id })-[:FOLLOWS]->(userFriend) RETURN userFriend._id as friendId',
        {id: req.session._id})
    .then(queryRes => {
        console.log(queryRes.records.length + " friends found");
        return res.json({success: true, friends: queryRes.records})
    });
});


app.post('/getUsersById', function(req, res){
    User.find({_id: {$in : req.body.ids}}, function(err, users){
        if(err) console.log(err);
        res.send(users);
    });
});
//Add friend
app.post('/addFriend', function(req, res){
    var command = "MATCH (a:User), (b:User) WHERE a._id='" + req.session._id + "' AND b._id='" + req.body.id + "' CREATE (a)-[:FOLLOWS]->(b)"
    neo4jConnection.cypher(command)
    .then(queryRes =>{
        console.log("Added relationship FOLLOWS")
        return res.json({ success: true });
    })
})

//Remove friend
app.post('/removeFriend', function(req, res){
    var command = "MATCH (:User{_id:'" + req.session._id + "'})-[r:FOLLOWS]->(:User{_id:'" + req.body.id + "'}) DELETE r"
    neo4jConnection.cypher(command)
    .then(queryRes =>{
        console.log("Removed relationship FOLLOWS")
        return res.json({ success: true });
    })
})





////////////////////////
//// MYSQL QUERIES
////////////////////////

app.post("/findHistory", (req, res) => {
    var userId = req.body.userId;
    let sql = "select * \
    from progra.personxpurchase t1 \
    inner join progra.productxpurchase t2 on t1.idPurchase= t2.idPurchase \
    where t1.idPerson = ?\
    order by t1.purchaseDate";
    mysqlConnection.query(sql, [userId], function (err, result) {
        if (err) console.log(err)
        res.send(result)
        res.end();
    })
});

app.post("/findHistoryFriend", (req, res) => {
    var userId = req.body.userId;
    var isPublic = req.body.auth;
    let sql = "select * \
    from progra.personxpurchase t1 \
    inner join progra.productxpurchase t2 on t1.idPurchase= t2.idPurchase \
    where t1.idPerson = ? and t1.isPublic = ?\
    order by t1.purchaseDate";
    mysqlConnection.query(sql, [userId, isPublic], function (err, result) {
        if (err) console.log(err)
        res.send(result)
        res.end();
    })
});

app.get("/allCategories",(req,res)=>{
    let sql ="select * from progra.category group by category order by category";
    mysqlConnection.query(sql,function(err,result){
        if(err)console.log(err)
        else{
            res.send(result);
            res.end();
        }
    })
})

app.post("/productComments", (req, res) => {
    productId=req.body.productId;
    var query= mysqlConnection.query('SELECT * FROM comments WHERE product_id= ?',[productId],function (error,result){
        if(error){
            console.log("Something failed with mysql");
            return res.json({ success: false, error: "An error ocurred on mysql" });
        } else {
            console.log("Todo bien todo correcto");
            res.send(result)
            res.end(); 
        }
    })
});

app.post("/getProductRecommendations", (req, res) => {
    productId=req.body.productId;
    let sql="select * from productxpurchase where idPurchase in \
    (select idPurchase from productxpurchase where \
    idProduct=?)"

   var query= mysqlConnection.query(sql,[productId],function (error,result){
    if(error){
        console.log("Something failed with mysql");
        return res.json({ success: false, error: "An error ocurred on mysql"+error });
    } else {
        res.send(result)
        res.end(); 
    }
})
});


app.post("/insertHistory",(req, res)=>{
    var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const {idPerson,isPublic,products}=req.body;//extract the data from requirement body
    let sql="insert into progra.personxpurchase (idPerson,purchaseDate,isPublic) values (?,?,?)"
    mysqlConnection.query(sql,[idPerson,d,isPublic],function(err, result){
        if(err)throw err;
        else{// no error
            console.log(result)
            products.map(h=>{
                let tarea="insert into progra.productxpurchase (idPurchase,idProduct,Quantity) VALUES (?,?,?)"
                mysqlConnection.query(tarea,[result.insertId,h.id,h.quantity],function(error,response){
                    if(error)throw err;
                    console.log("Number of records inserted: " + response.rowsAffected);
                })
                h.category.map( c => {
                    neo4jConnection.cypher('MATCH (c:Category {_id: $categoryName}) RETURN c',{categoryName: c})
                    .then(res => {
                        if(res.records.length === 0){
                            neo4jConnection.create('Category',{
                                _id: c
                            }).then(function(node){
                                neo4jConnection.cypher(
                                    'MATCH (u:User), (c:Category) WHERE u._id= $idUser AND c._id= $nameCategory CREATE(u)-[r:BOUGHT {quantity:$quantity}]->(c)',
                                    {idUser: idPerson, nameCategory: c, quantity: Number(h.quantity)})
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                        }else{
                            neo4jConnection.cypher("MATCH (u:User {_id: $idUser})-[r]-(c:Category {_id: $nameCategory}) RETURN r",
                            {idUser: idPerson, nameCategory: c})
                            .then(res => {
                                if(res.records.length > 0){
                                    neo4jConnection.cypher("MATCH (u:User)-[r]-(c:Category) WHERE u._id= $idUser AND c._id= $nameCategory SET r.quantity = r.quantity + $quantity",
                                    {idUser: idPerson, nameCategory: c,quantity: Number(h.quantity)})
                                }else{
                                    neo4jConnection.cypher(
                                        'MATCH (u:User), (c:Category) WHERE u._id= $idUser AND c._id= $nameCategory CREATE(u)-[r:BOUGHT {quantity:$quantity}]->(c)',
                                        {idUser: idPerson, nameCategory: c, quantity: Number(h.quantity)})
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }
                            })
                        }
                    })
                })
            })
        }
        console.log("Number of records inserted: " + result.rowsAffected);
        return res.json({ success: true });
    })
});

app.post('/getRecomendations', (req, res) => {
    var userId = req.body.userId;
    neo4jConnection.cypher("MATCH (u:User) -[r]-> (c:Category) WHERE u._id = $userId RETURN (r.quantity), (c._id) ORDER BY (r.quantity) DESC LIMIT 3",
    {userId: userId})
    .then(categories => {
        return res.json({success: true, recomendations: categories.records})
    })
})

app.post("/commentProduct", (req, res) => {
    productId=req.body.productId;
    customerUserName=req.body.customerUserName;
    customerFullName=req.body.customerFullName;
    comment=req.body.comment;
    var query= mysqlConnection.query('INSERT INTO comments (product_id,customer_userName,customer_fullName,commentDescription,commentDate) VALUES (?,?,?,?,?)',[productId,customerUserName,customerFullName,comment,new Date().toISOString().slice(0, 19).replace('T', ' ')],function (error,result){
        if(error){
            console.log(error);
            console.log("Something failed with mysql");
            return res.json({ success: false, error: "An error ocurred on mysql" });
        } else {
            return res.json({ success: true });
        }
    })
});

//Saves the user in MongoDB on the users collection
app.route("/putUser")
    .post(upload.single('imageData'), (req, res) => {
        let userToSave = new User(); //Creates the userscheme

        const { userName, password, fullName, email, birthDate, userType, salt } = req.body;
            User.findOne({userName: userName},function(err,user) {
                if (user == null) {
                    User.findOne({email:email},function(err,user) {
                        if (user == null) {
                            userToSave.userName = userName;
                            userToSave.password = password;
                            userToSave.fullName = fullName;
                            userToSave.email = email;
                            userToSave.birthDate = birthDate;
                            userToSave.userType= userType;
                            userToSave.salt = salt;
                    
                            console.log(req.body);
                            userToSave.profilePic.imageName = req.body.imageName;
                            userToSave.profilePic.imageData = req.file.path;                    
                            
                            console.log(userToSave)
                            userToSave.save((err, userSaved) => { //saves the user
                                if(err) {
                                    return res.json({ success: false, error: err});
                                }
                                neo4jConnection.create('User',{
                                    _id: userSaved._id.toString(),
                                    name: userName
                                }).catch(function(err){
                                    console.log(err)
                                })
                                return res.json({ success: true });
                            })
                        } else {
                            return res.json({ success: false, error: "This email is already Taken"});                               
                        }
                    })                
                
                } else {
                    return res.json({ success: false, error: "This userName is already Taken"});                       
                }
            }) 
    });

app.post('/UserLogIn', function (req, res) {
    var pName = req.body.pName;
    var pPassword = req.body.pPassword;
    console.log(pName)
    if (pName && pPassword) {
        User.findOne({ userName: pName }, function (err, user) {
            if (user == null) {
                return res.json({ success: false, error: "Username doesn't exist" });
            }
            else {
                let salt = user.salt;
                if (hashPassword(salt + pPassword) != user.password) {
                    //res.send("Incorrect Username and/or Password!");
                    return res.json({ success: false, error: "Incorrect Username and/or Password" });
                }
                else {
                    console.log(user)
                    req.session.loggedIn = true;
                    req.session._id = user._id;
                    console.log(req.session) 
                    req.session.userName = user.userName;
                    req.session.email=user.email;
                    req.session.fullName=user.fullName;       
                    req.session.imageData = user.profilePic.imageData; 
                    req.session.userType = user.userType;  
                }
                return res.json({ success: true });
            }
        })
    }
    else {
        return res.json({ success: false, error: "Please enter Username and/or Password!" });

    }
});

app.post('/blockProduct', function (req, res) {
    Product.findOne({ _id: req.body.id }, function (err, product) {
        if (!err) {
            product.isAvailable = !product.isAvailable;
            product.save(function (err) {
                if (!err) {
                    return res.json({ success: true })
                } else {
                    return res.json({ success: false, error: err.message })
                }
            })
        } else {
            return res.json({ success: false, error: err.message })
        }
    })
})

app.post('/reduceStock', function (req, res) {
    Product.findOne({ _id: req.body.id }, function (err, product) {
        if (!err) {
            product.stock = Number(product.stock)- Number(req.body.stock);
            if(product.stock <= 0 ){
                product.isAvailable = false;
            }
            product.save(function (err) {
                if (!err) {
                    return res.json({ success: true })
                } else {
                    return res.json({ success: false, error: err.message })
                }
            })
        } else {
            return res.json({ success: false, error: err.message })
        }
    })
})

app.delete('/deleteProduct', function (req, res) {
    Product.findOne({ _id: req.body.id }, function (err, product) {
        if (!err) {
            product.isDeleted = true;
            product.save(function (err) {
                if (!err) {
                    return res.json({ success: true })
                } else {
                    return res.json({ success: false, error: err.message })
                }
            })
        } else {
            return res.json({ success: false, error: err.message })
        }
    })
})

app.post('/updateProduct', function (req, res) {
    Product.findByIdAndUpdate({ _id: req.body.id }, req.body.update, function (err) {
        if (!err) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: err.message });
        }
    })
})

app.post('/deleteImage', function(req, res){
    try {
        fs.unlinkSync(req.body.image)
    } catch (err) {
        console.log(err);
    }
    res.end();
})

app.post('/addImagesProduct',upload.array('imageData'), function(req, res){
    var file = req.files;
    var arrayAux=[];
    for (var i=0;i<file.length;i++){
        arrayAux=arrayAux.concat({'imageName':file[i].originalname,'imageData':file[i].path});
    }
    Product.findByIdAndUpdate({ _id: req.body.id }, {$push: {image: arrayAux}}, function(err){
        if (!err) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: err.message });
        }
    })
})

app.post('/getCart', (req, res) => {
    redisClient.HGETALL(req.body.id, function(err, results){
        if(err){
            return res.json({success: false, error: err})
        }else{
            return res.json({success: true, hash: results })
        }
    })
})

app.post('/deleteFromCart', (req, res) => {
    const {id, productId} = req.body
    redisClient.HDEL(id, productId, function(err){
        if(err){
            return res.json({success: false});
        }else{
            return res.json({success: true});
        }
    })
})

app.post('/addToShoppingCart', (req, res) =>{
    const {id, productId} = req.body
    if(redisClient.HGET(id, productId)){
        redisClient.HINCRBY(id, productId, 1);
        return res.json({success: true})
    }else{
        redisClient.HMSET(id, productId, 1).then(err => {
            if(err){
                return res.json({success: false, error: err})
            }else{
                return res.json({success: true})
            }
        });
    }
})


app.post('/decreaseFromCart', (req, res) =>{
    const {id, productId} = req.body;
    if(redisClient.HINCRBY(id, productId, -1)) return res.json({success: true});
    return res.json({success: false})
})

app.get('/home',function(req,res) {
    if (req.session.loggedIn) {
        res.send(req.session.userName);
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
})

app.get('/allUsers', function(req, res){
    User.find({}, function(err, users){
        if(err)return console.log(err);
        var userMap = [];
        users.forEach(function(user, index){
            if(req.session.loggedIn && user.userName != req.session.userName){
                userMap.push(user);
            }
        });
        res.send(userMap);
        res.end();
    });
})


app.get('/logOut', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return console.log("Error al cerrar sesion");
        } else {
            console.log("Se ha cerrado la sesion correctamente");
            return res.json({ success: true });
        }
    })
})

app.get('/showSession', (req, res) =>{
    res.send(req.session);
    res.end();
    //return res.json({success: true, session: session.userName})
});


/////////////////////////////////////////
/////
/////      PRODUCTS RELATED METHODS
/////
/////////////////////////////////////////

app.post("/putProduct",upload.array("imageData"), function(req, res)  {
    var file=req.files;      
    let product = new Product(); //Creates the userscheme

    const { title, category, description, price, stock, shipmentInfo } = req.body;
    //In case the user didn't fill an input 
    if (!title || !category || !description || !price || !stock || !shipmentInfo) {
        return res.json({
            success: false,
            error: 'Invalid Inputs'
        });
    }
    product.title = title;
    product.category = category;
    product.rate = [{ 'id': 1, 'value': 0 }, { 'id': 2, 'value': 0 }, { 'id': 3, 'value': 0 }, { 'id': 4, 'value': 0 }, { 'id': 5, 'value': 0 }];
    product.totalRate = 0;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.shipmentInfo = shipmentInfo;
    product.isDeleted=false;
    product.isAvailable = true;
    var arrayAux=[];
    for (var i=0;i<file.length;i++){
        arrayAux=arrayAux.concat({'imageName':file[i].originalname,'imageData':file[i].path});
    }
    product.image=arrayAux
    product.save((err) => { //saves the user
        if (err) return res.json({ success: false, error: "Se ha producido un error guardando el producto"+err });
        return res.json({ success: true })
    })
    
});

app.get('/allProducts', (req, res) =>{
    Product.find({isDeleted:false},{},function (err, allProducts){
        if(err)return handleError(err);
        res.send(allProducts)
        res.end();
    })});

app.post('/getProduct', (req, res) => {
    Product.findById(req.body.id, function(err, product){
        if(err) return res.json({success: false, error: err});
        return res.json({success: true, product: product});
    })
})

app.post('/getProductByCategory', (req, res) => {
    const searchCategory = req.body.category;
    Product.find({ category: { $in: [searchCategory] }}, function(err, product){
        if(err) return res.json({success: false, error: err});
        var randomProduct = Math.floor(Math.random() * product.length);
        return res.json({success: true, product: product[randomProduct]});
    })
})

app.post('/productSearch', (req,res)=>{
    var pSearch = req.body.pSearch;
    var pSort = req.body.pSort;
    var pAscendant = req.body.pAscendant;
    Product.find({isDeleted:false,$or:[{title:{$regex:pSearch,$options:"$i"}},{category:{$regex:pSearch,$options:"$i"}},{description:{$regex:pSearch,$options:"$i"}}]}, function(err, products) {
        if (err) {
            return res.json({
                success:false,
                error: err
            }); 
            res.end();
        } else {
            if (products.length === 0) {
                return res.json({
                    success:false,
                    error: 'La busqueda no ha dado resultados'
                });     
                res.end();           
            }else {
                return res.json({
                    success:true,
                    productData: products
                });   
                res.end();
            }
        }
    }).sort({price:pAscendant});
});


app.post('/rateProduct', (req, res)=> {
    var pIdProduct = req.body.pIdProduct;
    var pRate = req.body.pRate;
    var pUsername = req.body.customerUserName;
    var pRateAux,pTotalRateAux;
    var r1,r2,r3,r4,r5,nextTotalRate;
    var query= mysqlConnection.query('SELECT * FROM ratings WHERE product_id= ? AND customer_username= ?',[pIdProduct,pUsername],function (error,result){
        if(error){
            console.log("Something failed with mysql");
            return res.json({ success: false, error: "An error ocurred on mysql" });
        } else {
            if(result.length>0){
                return res.json({ success: false, error: "You have already entered a "+result[0].stars_given+' star rating for this product, you can only vote once' });                        
            } else {
                Product.findOne({_id:pIdProduct},function(err,prod){
                    r1 = prod.rate[0].value;
                    r2 = prod.rate[1].value;
                    r3 = prod.rate[2].value;
                    r4 = prod.rate[3].value;
                    r5 = prod.rate[4].value;
                    switch(pRate){
                        case 1:
                            pRateAux=r1+1;
                            pTotalRateAux=(r2*2+r3*3+r4*4+r5*5+(r1+1)*1);
                            break;
                        case 2:
                            pRateAux=r2+1;
                            pTotalRateAux=(r1*1+r3*3+r4*4+r5*5+(r2+1)*2);
                            break;
                        case 3:
                            pRateAux=r3+1;
                            pTotalRateAux=(r1*1+r2*2+r4*4+r5*5+(r3+1)*3);
                            break;
                        case 4:
                            pRateAux=r4+1;
                            pTotalRateAux=(r1*1+r2*2+r3*3+r5*5+(r4+1)*4);
                            break;
                        case 5:
                            pRateAux=r5+1;
                            pTotalRateAux=(r1*1+r2*2+r3*3+r4*4+(r5+1)*5);
                            break;
                    }
                    if ((r1+r2+r3+r4+r5)!=0) nextTotalRate = parseFloat((pTotalRateAux)/(r1+r2+r3+r4+r5+1)).toFixed(2); 
                    else nextTotalRate=pTotalRateAux;
                    Product.updateOne(
                        { _id:pIdProduct},
                        { $set: { "rate.$[elem].value" : pRateAux,totalRate:nextTotalRate} },
                        { arrayFilters: [ { "elem.id": { $eq: pRate} }]},function(err){
                            if(err) {
                                console.log("Se presento el error: "+err);
                                return res.json({
                                    success:false,
                                    error:err
                                });  
                            }
                            else {
                                var query= mysqlConnection.query('INSERT INTO ratings (product_id,customer_userName,stars_given) VALUES (?,?,?)',[pIdProduct,pUsername,pRate],function (error,result){})
                                return res.json({
                                    success:true,
                                });             
                            }
                        }               
                    )
                })
            } 
        }
    })

});

app.post("/putNewMessage",function(req, res)  {  
    const { idPerson1, idPerson2, message, messageOwner} = req.body;
    console.log("person1"+idPerson1);
    console.log("person2"+idPerson2);

    Conversation.find({$or:[{ idPerson1: idPerson1,idPerson2: idPerson2 },{idPerson1: idPerson2,idPerson2: idPerson1}]},function(err,messages){
        if (err) {
            console.log("Error on conversation search");
        } else {
            if (messages.length == 0) {
                let newConversation = new Conversation(); 
                newConversation.idPerson1 = idPerson1;
                newConversation.idPerson2 = idPerson2;
                newConversation.messages = [{'idPerson':messageOwner,'message':message,'messageDate':new Date()}];
                newConversation.save((err) => { 
                    if (err) {
                        console.log("Error guardando los datos de la nueva conversacion");
                        return res.json({success:false,error:"Error saving new conversation data"});
                        res.end();

                    }
                    else {
                        console.log("Se ha guardado correctamente la nueva conversacion");
                        return res.json({success:true});
                        res.end();
                    }
                })
            }else {
                Conversation.findOne({$or:[{idPerson1: idPerson1,idPerson2: idPerson2},{idPerson1: idPerson2,idPerson2: idPerson1}]}, function(err,conversation){
                    conversation.messages.push({'idPerson':messageOwner,'message':message,'messageDate':new Date()});
                    conversation.save((err) =>{
                        if (err) {
                            console.log("Error agregando mensajes a la conversacion");
                            return res.json({success:false,error:"Error adding new messages to conversation"});
                            res.end();
                        }
                        else {
                            console.log("Se ha guardado correctamente un nuevo mensaje a la conversacion");
                            return res.json({success:true});
                        }
                    });
                })   
            }
        }
    });  
    
});

app.post('/allConversations', (req, res) =>{
    const idPerson=req.body.idPerson;
    console.log("El usuario es: "+idPerson);
    Conversation.find({$or:[{idPerson1:idPerson},{idPerson2:idPerson}]},function(err,messages){
        if (err) {
            console.log("Error on conversations search");
        } else {
            if (messages.length == 0) {
                console.log("No se encontraron conversaciones");
                return res.json({success:false,error:"No conversations yet"});
                res.end();
            }
            else {
                console.log("Se encontraron conversaciones");
                return res.json({
                    success:true,
                    messagesData: messages
                });   
                res.end();                
            }
        }
    });
})









