const path = require('path')
const fs = require('fs')

const express = require('express');
const router = express.Router();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});