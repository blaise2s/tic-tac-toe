const express = require('express');
const db = require('../db/models');

const Winners = db.winners;
const authorizedOrigins = ['http://localhost:3000'];
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((request, response, next) => {
  if (request.headers.origin) {
    const origin = request.headers.origin;
    const authorizedOrigin = authorizedOrigins.find((ao) => {
      return ao === origin;
    });
    if (authorizedOrigin) {
      response.setHeader('Access-Control-Allow-Origin', authorizedOrigin);
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,HEAD,OPTIONS'
      );
      response.setHeader(
        'Access-Control-Allow-Headers',
        'authorization,content-type'
      );
    }
    console.log(
      `${authorizedOrigin ? 'Authorized' : 'Unauthorized'} ${request.method} request form origin ${origin} to resource ${request.url}`
    );
  }
  next();
});

db.sequelize.sync();

//////////
app.get('/ping', (_req, res) => res.send('pong'));

app.get('/winners', (_req, res) => {
  Winners.findAll().then(data => res.json(data))
    .catch(() => res.sendStatus(500));
});

app.post('/winners', (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "name can not be empty"
    });
    return;
  }

  if (!req.body.squares) {
    res.status(400).send({
      message: "squares can not be empty"
    });
    return;
  }
  
  if ( req.body.squares.length !== 9) {
    res.status(400).send({
      message: "squares must contain data from all 9 squares"
    });
    return;
  }

  const winner = {
    name: req.body.name, 
    squares: req.body.squares.join(','),
  }
  Winners.create(winner).then(data => res.json(data))
    .catch(() => res.sendStatus(500));

})
//////////

const port = 3001;
app.listen(port, () => console.log(`🚀 server started on port ${port}`));