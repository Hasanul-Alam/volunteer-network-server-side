const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const objectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Username: volunteerUser
// Password: o7SVQvKF2E4ZqqWI

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db("Volunteer-Network");
        const volunteerProgrammes = database.collection("volunteer-programmes");
        const registeredVolunteers = database.collection("registered-events");
        const blogs = database.collection("blogs");

        // Get all API
        app.get('/volunteer-programmes', async (req, res) => {
            const cursor = volunteerProgrammes.find({});
            const programmes = await cursor.toArray();
            res.send(programmes);
        })

        // Get single API From All Programmes
        app.get('/volunteer-programmes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new objectId(id) };
            const singleProgramme = await volunteerProgrammes.findOne(query);
            res.send(singleProgramme);
        })

        // Delete a Single Document From All Events
        app.delete('/events/:id/:email', async(req,res) => {
            const id = req.params.id;
            const email = req.params.email;
            const query = { _id: new objectId(id), email: email};
            const result = await registeredVolunteers.deleteOne(query);
            res.json(result);
        })

        // POST Registered Volunteers Data
        app.post('/registered-volunteers', async(req, res) => {
            const data = req.body;
            const result = await registeredVolunteers.insertOne(data);
            res.json(result);
        })

        // Get Registered Volunteers Data
        app.get('/events', async(req, res) => {
            let query = {};
            if(req.query?.email){
                query= {email: req.query.email}
            }
            const result = await registeredVolunteers.find(query).toArray();
            res.send(result);
        });

        // Get All Blogs
        app.get('/blogs', async(req, res) => {
            const allBlogs = await blogs.find({}).toArray();
            res.json(allBlogs);
        });

        // Delete API
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Alhamdulillah server is runnig.');
})

app.listen(port, () => {
    console.log('Server is running on port ', port);
});