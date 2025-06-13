const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const accessRoutes = require('./routes/access.routes');

app.use(cors({
    origin: 'http://localhost:3000', // or '*' to allow all origins
    credentials: true
  }));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/access', accessRoutes);

module.exports = app;
