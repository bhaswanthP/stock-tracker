require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const apiRoutes = require('./routes/api');
require('./jobs/stockMonitor');

const cors = require("cors");

const CLIENT_PORT = process.env.CLIENT_PORT;
app.use(cors({ origin: `http://34.235.157.206` }));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.use(express.json());
app.use('/api', apiRoutes);

const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
