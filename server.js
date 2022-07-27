// import express tool into application
const express = require('express')

// use the variable app as a shortcut to calling express()
// also a standard commonly used
const app = express()

// sets variable MongoClient as shortcut for mongo tool import
// what does .MongoClient do? creates the actual instance of mongo so that we can connect to it later
const MongoClient = require('mongodb').MongoClient

// sets port for our server to run on 2121. so localhost:2121
const PORT = 2121

// lets us use .env to store environment variables securely
require('dotenv').config()

// declares database variable, tells it to use process.env.DB_STRING as database connection string, then specifies to use database named 'todo' as the database for this app
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Use mongo to connect to database, input is our dbConnectionStr. If successful, will console log the connected message. useUnifiedTopology pings database to see if it's up every X seconds.. 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// sets our app's view engine to use ejs
app.set('view engine', 'ejs')

// tells app to use our 'public' folder to serve images, CSS, and JS files
app.use(express.static('public'))

// lets app interpret incoming requests as strings or arrays
app.use(express.urlencoded({ extended: true }))

// lets app interpret incoming requests as JSON object
app.use(express.json())

// Create = post
// Read = get
// Update = put
// Delete = deletay

// takes us to our homepage, index.ejs
app.get('/',async (request, response)=>{
    // look into db collection named 'todos', points to everything, makes an array out of everything it finds in the collection. How does it work? -> makes an array around objects https://www.w3resource.com/mongodb/shell-methods/cursor/cursor-toArray.php
    const todoItems = await db.collection('todos').find().toArray()

    // tells how many items in the to-do list are left by counting which ones have the property of completed: false
    https://www.geeksforgeeks.org/mongodb-countdocuments-method/
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // now respond with rendering index.ejs with the objects that we found in the previous line
    // response must be the remaining items if there are some items.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// creating something - because it's a post request
// url is in the form of http://localhost:2121/addToDo
// This is the add to the to-list code using the insertOne method which creates object with the properties of thing and completed. Then tells us that the object is added and takes us to home page. And if something goes wrong, console logs error.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Updates if a task is completed

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // turns completed property to true
        $set: {
            completed: true
          }
    },{
        // sorts todos database in descending order
        sort: {_id: -1},
        // upsert = update + insert
        // what is this updating and inserting? ***ask this in the help channels***
        // what's the point of upsert: false? If we aren't inserting anything
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Updates if a task is not completed
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // uses $set method to change completed property to false.
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // should say "Marked Incomplete"
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

// deletes a todo object from 'todos' database using the deleteOne method from mongodb
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// tells server to listen to connections on process.env.PORT variable OR PORT as defined at the beginning of the document
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})