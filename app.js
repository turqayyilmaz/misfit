const mongoose = require('mongoose');
const express = require('express');
const bycrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require('ejs');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require('path');
const flash = require('connect-flash');

const frontEndRoutes = require('./routes/frontEndRouters');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout extractScripts', true);
app.set('layout', 'layouts\\indexLayout.ejs');
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(fileUpload());

//db settings and initiliaze

const dbUrl = 'mongodb://localhost/misfit-db';
app.use(
  session({
    secret: 'qewrewqrewqrıuqoweqwyreoqewroıu', // Buradaki texti değiştireceğiz.
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUrl }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

global.userIN = null;
//Routes
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  res.locals.userName = req.session.userName;
  res.locals.role = req.session.role;

  next();
});

//CONNECT DB
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  });

//routes
app.use('/', frontEndRoutes);
app.use('/user', userRoutes);

//application server is listening
app.listen(port, () => console.info(`Misfit App listening on port ${port}`));
