var express = require('express');
const { sequelize } = require('../database/db');
var router = express.Router();

sequelize.sync({ force: false }).then((result) => {
  console.log("connected db");
})

module.exports = router;
