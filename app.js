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







const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.json());


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout extractScripts', true);
app.set('layout', 'layouts\\indexLayout.ejs');
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.static(path.join(__dirname, 'node_modules')));



//db settings and initiliaze

const dbUrl = 'mongodb://localhost/misfit-db';
app.use(
  session({
    secret: 'my_keyboard_misfit',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUrl }),
  })
);
global.userIN = null;
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('*', (req, res, next) => {
    userIn = req.session.userID;
    res.locals.userName = req.session.userName;
    res.locals.role = req.session.role;
    next();
});

app.use(methodOverride('_method', {
  methods: ['GET', 'POST']
}));


//CONNECT DB

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}


mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  });

//routes
const pageRoute = require('./routes/pageRoute');
const programRoute = require('./routes/programRoute');
const categoryRoute = require('./routes/categoryRoute'); 
const userRoute = require('./routes/userRoute');


app.use('/', pageRoute);
app.use('/users', userRoute);
app.use('/programs', programRoute);
app.use('/categories', categoryRoute);

//application server is listening
app.listen(port, () => console.info(`Misfit App listening on port ${port}`));
