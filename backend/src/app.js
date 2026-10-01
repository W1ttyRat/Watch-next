const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express({ limit: '10kb' });

app.use(cors());
app.use(express.json());

module.exports = app;