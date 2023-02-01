const db = require('./db');
const { client, createTables, seedData, getUsers } = db;
const express = require('express');
const app = express();

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send( await getUsers());
  }
  catch(ex){
    next(ex);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try {
    await client.connect();
    await createTables();
    await seedData();
    console.log(`listening on port ${port}`);
  }
  catch(ex){
    console.log(ex);
  }
});
