const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.3y9ux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
     serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
     }
});

async function run() {
     try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();

          const coffeeCollection = client.db('coffeeDB').collection('coffee');
          const userCollection = client.db('coffeeDB').collection('user');

          app.post('/coffee', async (req, res) => {
               const newCoffee = req.body;
               console.log(newCoffee)
               const result = await coffeeCollection.insertOne(newCoffee);
               res.send(result);
          });

          app.get('/coffee', async (req, res) => {
               const cursor = coffeeCollection.find();
               const result = await cursor.toArray();
               res.send(result);
          });
          app.get('/coffee/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await coffeeCollection.findOne(query);
               res.send(result)
          })

          app.delete('/coffee/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await coffeeCollection.deleteOne(query);
               res.send(result)
          });
          app.put('/coffee/:id', async (req, res) => {
               const id = req.params.id;
               const filter = { _id: new ObjectId(id) };
               const options = { upsert: true };

               const updateCoffee = req.body;
               const coffee = {
                    $set: {
                         name: updateCoffee.name,
                         chef: updateCoffee.chef,
                         supplier: updateCoffee.supplier,
                         taste: updateCoffee.taste,
                         category: updateCoffee.category,
                         details: updateCoffee.details,
                         photo: updateCoffee.photo,
                         price: updateCoffee.price,

                    }
               };
               const result = await coffeeCollection.updateOne(filter, coffee, options);
               res.send(result);
          });

          // user Api
          app.get('/user', async (req, res) => {
               const cursor = userCollection.find();
               const users = await cursor.toArray();
               res.send(users)
          })
          app.post('/user', async (req, res) => {
               const user = req.body;
               console.log(user)
               const result = await userCollection.insertOne(user);
               res.send(result)
          });
          app.patch('/user', async (req, res) => {
               const user = req.body;
               const filter = { email: user.email };
               const updateDoc = {
                    $set: {
                         lastSignInTime: user.lastSignInTime
                    }
               }
               const result = await userCollection.updateOne(filter, updateDoc);
               res.send(result)
          })
          app.delete('/user/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await userCollection.deleteOne(query);
               res.send(result);
          })




          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
     } finally {
          // Ensures that the client will close when you finish/error
          // await client.close();
     }
}
run().catch(console.dir);


app.get('/', (req, res) => {
     res.send('Coffee making server is running');
});


app.listen(port, () => {
     console.log(`coffee server running on port : ${port}`);
})