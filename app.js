// your main app
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const session = require('express-session');
const cors = require('cors');

// env 
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(
  session({
    secret: 'lol',
    resave: false,
    saveUninitialized: true,
  })
);

// cors 
app.use(cors());

const routes = require('./routes/routes');

app.use('/api', routes);


// models
const User = require('./models/user');
const AmbulanceRequest = require('./models/AmbulanceRequest');
const Notification = require('./models/notification');

// relation 
AmbulanceRequest.belongsTo(User);
User.hasMany(AmbulanceRequest);

Notification.belongsTo(User);
User.hasMany(Notification);



const PORT = 3000|| process.env.PORT;

sequelize.sync()
.then(result => {
    app.listen(PORT);
    console.log("CAD lessss go ?! ");
  })
.catch(err => {
    console.log(err);
});
