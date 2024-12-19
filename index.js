const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9h20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db('paintingDB')
        const paintingCollection = database.collection('paintings')

        app.post('/paintings', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await paintingCollection.insertOne(body);
            res.send(result);
        })


        app.delete('/paintings/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await paintingCollection.deleteOne(quary);
            res.send(result)
        })

        app.get('/paintings', async (req, res) => {
            const cursor = paintingCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/email/:email', async (req, res) => {
            const email = req.params.email;
            const quary = { userEmail: email };
            const cursor = paintingCollection.find(quary);
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/paintings/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await paintingCollection.findOne(quary);
            res.send(result);
            console.log('result is ', result)
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
    res.send('Alhamdulillah')
});

app.listen(port, () => {
    console.log(`port is running in ${port}`);

})
