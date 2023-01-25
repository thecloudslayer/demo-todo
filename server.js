const express = require('express');
const Aerospike = require("aerospike"); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5001; //Line 3
const bodyParser = require("body-parser");

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/todos', (req, res) => { //Line 9


  let client = Aerospike.client({
    hosts: [
      {addr: "localhost", port: 3000},

    ],
    log: {
      level: Aerospike.log.INFO
    }
  })

  async function test () {
    let client
    try {
      client = await Aerospike.connect()
      let key = new Aerospike.Key('test', 'todos', 'taylorgraham')


      ///await client.put(key, bins)
      let record = await client.get(key)
      console.info(record)

      res.send({express: JSON.stringify(record.bins.json.todos)}); //Line 10
      return record
      //await client.remove(key)
    } catch (error) {
      console.error('Error:', error)
      process.exit(1)
    } finally {
      if (client) client.close()
    }




  }

  test();


})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create a POST route
app.post('/addtodo', (req, res) => {

  let load = req.body
  console.log("load",load)

  let client = Aerospike.client({
    hosts: [
      { addr: "localhost", port:3000 },


    ],
    log: {
      level: Aerospike.log.INFO
    }
  })


  client.connect(async function (error) {
    if (error) {
      // handle failure
      console.log('Connection to Aerospike cluster failed!')
    } else {
      // handle success

      const key = new Aerospike.Key('test', 'todos', 'taylorgraham')


      let record = await client.get(key)
      let makeready = JSON.stringify(load);
      console.log("makeready",makeready)

      let y = record.bins.json["todos"].push(load);

      client.put(key,record.bins, function (error) {
        if (error) {
          console.log('error: %s', error.message)
        } else {
          console.log('Record written to database successfully.')

        }
        client.close()
      })
    }

  })






});

app.put('/updatetodo', (req, res) => {

  let load = req.body
  console.log("load",load)
  let newIndex = load.index
  let newLoad = load.data
  let client = Aerospike.client({
    hosts: [
      { addr: "localhost", port:3000 },


    ],
    log: {
      level: Aerospike.log.INFO
    }
  })


  client.connect(async function (error) {
    if (error) {
      // handle failure
      console.log('Connection to Aerospike cluster failed!')
    } else {
      // handle success

      const key = new Aerospike.Key('test', 'todos', 'taylorgraham')
      let record = await client.get(key)

      record.bins.json.todos[newIndex] = newLoad



      client.put(key,record.bins, function (error) {
        if (error) {
          console.log('error: %s', error.message)
        } else {
          console.log('Record written to database successfully.')

        }
        client.close()
      } )
    }

  })






});

app.put('/deletetodo', (req, res) => {

  let load = req.body
  console.log("load",load)
  let newIndex = load.index
  let newLoad = load.data
  let client = Aerospike.client({
    hosts: [
      { addr: "localhost", port:3000 },


    ],
    log: {
      level: Aerospike.log.INFO
    }
  })


  client.connect(async function (error) {
    if (error) {
      // handle failure
      console.log('Connection to Aerospike cluster failed!')
    } else {
      // handle success

      const key = new Aerospike.Key('test', 'todos', 'taylorgraham')
      let record = await client.get(key)

      record.bins.json.todos.splice(newIndex,1)




      client.put(key,record.bins, function (error) {
        if (error) {
          console.log('error: %s', error.message)
        } else {
          console.log('Record written to database successfully.')

        }
        client.close()
      } )
    }

  })






});