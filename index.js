const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyparser = require('body-parser');
require('dotenv').config();
const ObjectID= require('mongodb').ObjectID
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ump4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log("error ", err);
  const serviceCollection = client.db("HouseDoctor").collection("services");
  const TempOrderCollection = client.db("HouseDoctor").collection("tempOrder");
  const FinalOrderCollection = client.db("HouseDoctor").collection("FinalOrder");
  const ReviewsCollection= client.db("HouseDoctor").collection("reviews");

  console.log("SUCCESS");

  //DB for addServices
app.post('/addServices', (req, res)=>{
    const newService = req.body;
   console.log("New Event: ",newService);
   serviceCollection.insertOne(newService)
     .then(result=>{
       console.log("Inserted succesfully ", result.insertedCount);
       res.send(result.insertedCount>0);
     })
 })
 
//DB for getting Service
app.get('/addServices', (req, res)=>{

  serviceCollection.find().toArray((err,items)=>{
    console.log("Error ",err)
       res.send(items)
       console.log("database ", items)
  })
})


// DB to show one item on the
app.get('/bookedOrder/:id', (req, res)=>{
  const id=ObjectID(req.params.id);
  serviceCollection.findOne({_id:id},(err,item)=>{
    console.log("Error ",err)
       res.send(item)
       console.log("databaseOneItem ", item)
  })
})


//Db for tempOrderList Service adding

app.post('/addTempOrder', (req, res)=>{
  const newOrder = req.body;
 console.log("New Event: ",newOrder);
 TempOrderCollection.insertOne(newOrder)
   .then(result=>{
     console.log("Inserted succesfully on TempOrder ", result.insertedCount);
     res.send(result.insertedCount>0);
   })
})

//Db for finalOrder Collections

app.post('/addFinalOrder', (req, res)=>{
  const newOrder = req.body;
 console.log("New Event: ",newOrder);
 FinalOrderCollection.insertOne(newOrder)
   .then(result=>{
     console.log("Inserted succesfully on FinalOrder ", result.insertedCount);
     res.send(result.insertedCount>0);
   })
})

//DB post for review
app.post('/addReview', (req, res)=>{
  const newReview = req.body;
 console.log("New Event: ",newReview);
 ReviewsCollection.insertOne(newReview)
   .then(result=>{
     console.log("Inserted succesfully on Review ", result.insertedCount);
     res.send(result.insertedCount>0);
   })
})


//DB for getting PendingOrderService
app.get('/PendingServices', (req, res)=>{

  TempOrderCollection.find().toArray((err,items)=>{
    console.log("Error ",err)
       res.send(items)
       console.log("database ", items)
  })
})


//DB for getting Service For Delete
app.get('/getDelete', (req, res)=>{

  serviceCollection.find().toArray((err,items)=>{
    console.log("Error ",err)
       res.send(items)
       console.log("databaseForDelete ", items)
  })
})


//DB for deleting service
app.delete('/deleteService/:id',(req,res)=>{
  const id=ObjectID(req.params.id);
 //  console.log("dlt ",id);
 serviceCollection.findOneAndDelete({_id: id})
  .then(documents=> res.send(!!documents.value))
})


//DB to get Review
app.get('/getReview', (req, res)=>{
 ReviewsCollection.find().toArray((err,items)=>{
  console.log("Error ",err)
     res.send(items)
     console.log("databaseGEtForReview ", items)
   })
})

//DB for deleting review by admin 
app.delete('/deleteReview/:id',(req,res)=>{
  const id=ObjectID(req.params.id);
 console.log("dlt ",id);
 ReviewsCollection.findOneAndDelete({_id: id})
  .then(documents=> res.send(!!documents.value))
})



//Db for deleting from tempDB
app.delete('/deleteTempItem/:id',(req,res)=>{
  const id=ObjectID(req.params.id);
 //  console.log("dlt ",id);
 TempOrderCollection.findOneAndDelete({_id: id})
  .then(documents=> res.send(!!documents.value))
})

//Db for Final Order show on List 

app.get('/ConfirmedServices', (req, res)=>{

  FinalOrderCollection.find().toArray((err,items)=>{
    console.log("Error ",err)
       res.send(items)
       console.log("database Final Order", items)
  })
})

//Db for Showing history of Any perticular user

app.get('/FinalOrder/:Username', (req, res)=>{
  const name=req.params.Username;
  
  FinalOrderCollection.find({UserName:name}).toArray((err,item)=>{
    console.log("Error ",err)
       res.send(item)
       console.log("databaseOneItem ", item)
  })
})


//Db for Showing Pending Order of Any perticular user

app.get('/PendingOrder/:Username', (req, res)=>{
  const name=req.params.Username;
  
  TempOrderCollection.find({UserName:name}).toArray((err,item)=>{
    console.log("Error ",err)
       res.send(item)
       console.log("databasPending ", item)
  })
})



});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})