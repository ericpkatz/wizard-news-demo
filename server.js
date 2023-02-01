const db = require('./db');
const { client, createTables, seedData, usersAndStories } = db;
const express = require('express');
const app = express();

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
