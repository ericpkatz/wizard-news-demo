const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/wiz_news_db');


const getUsers = async()=> {
  const SQL = `
    SELECT users.id, users.name, stories.id as "storyId", stories.name as "storyName"
    FROM stories
    RIGHT JOIN users
    ON stories."userId" = users.id
  `;
  const response = await client.query(SQL);
  const data = {
  };
  response.rows.forEach( row => {
    if(!data[row.id]){
      data[row.id] = { id: row.id, name: row.name, stories: []};
    }
    if(row.storyId){
      data[row.id].stories.push({
        id: row.storyId,
        name: row.storyName
      });
    }
  });
  return Object.values(data);
};
const createUser = async({ name })=> {
  const SQL = `
INSERT INTO users(name)
VALUES($1)
RETURNING *
  `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

const createStory = async({ name, userId })=> {
  const SQL = `
INSERT INTO stories(name, "userId")
VALUES($1, $2)
RETURNING *
  `;
  const response = await client.query(SQL, [name, userId]);
  return response.rows[0];
};

const createTables = async()=> {
  const SQL = `
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(10)
);
CREATE TABLE stories(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  "userId" INTEGER REFERENCES users(id)
);
  `;
  await client.query(SQL);
};

const seedData = async()=> {
  const moe = await createUser({ name: 'moe'});
  const larry = await createUser({ name: 'larry'});
  const story = await createStory({ userId: moe.id, name: 'I love SQL'});
  const story2 = await createStory({ userId: moe.id, name: 'I love SQL!'});
  const users = await getUsers();
  console.log(users);
};

module.exports = {
  client,
  createTables,
  seedData,
  getUsers
};
