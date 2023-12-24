const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

const uri =
  "mongodb+srv://<username>:<password>@cluster0.sz2xe62.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const todoCollection = client.db("dndCollection").collection("todoTask");
const ongoingCollection = client.db("dndCollection").collection("ongoingTask");
const completedCollection = client
  .db("dndCollection")
  .collection("completedTask");

app.get("/todo-tasks", async (req, res) => {
  const result = await todoCollection.find().toArray();
  res.send(result);
});
app.get("/ongoing-tasks", async (req, res) => {
  const result = await ongoingCollection.find().toArray();
  res.send(result);
});
app.get("/completed-tasks", async (req, res) => {
  const result = await completedCollection.find().toArray();
  res.send(result);
});

app.post("/update-tasks", async (req, res) => {
  const { todo, ongoingTask, completedTask } = req.body;
  const deleteTodo = await todoCollection.deleteMany({});
  const deleteOngoing = await ongoingCollection.deleteMany({});
  const deleteCompleted = await completedCollection.deleteMany({});
  const insertTodo = await todoCollection.insertMany(todo);
  const insertOngoing = await ongoingCollection.insertMany(ongoingTask);
  const insertCompleted = await completedCollection.insertMany(completedTask);
  res.send({
    delete: { deleteTodo, deleteOngoing, deleteCompleted },
    insert: { insertTodo, insertOngoing, insertCompleted },
  });
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dnd server is running");
});

app.listen(port, () => {
  console.log(`Dnd server running on port : ${port}`);
});
