const express = require('express');
const body_parser = require('body-parser');
const userRouter = require('./routers/user.router');
const rewardRouter = require('./routers/reward.router');
const saveRouter = require('./routers/save.router');
const cors = require('cors'); 

const app = express();

app.use(cors());

app.use(body_parser.json());

app.use('/',userRouter);
app.use('/', rewardRouter);
app.use('/', saveRouter);

module.exports = app;