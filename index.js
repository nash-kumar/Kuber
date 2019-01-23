
// const app = express();
require('dotenv').config();
const express = require('express'),
  app = express();
path = require('path')
cors = require('cors'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  colors = require('colours');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err) {
  if (err) console.log('Error While connecting to DB:'.red, err);
  else console.log("DB Connected Successfully".rainbow);
});

app.use(cors());
morgan.format('combined', '[:date[clf]] :- method :url HTTP/:http-version" :status :res[content-length] :response-time ms');
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/images', express.static(path.join(__dirname, 'images')));
require('./config/passport')(passport);

const Auth = require('./routes/authentication.routes');
const User = require('./routes/user.routes');
const Admin = require('./routes/admin.routes');
const charityDetails = require('./routes/charity');

let user = require('./routes/route');
let card = require('./routes/card');
let gift = require('./routes/pastgift')
app.use('/userDetails', user);
app.use('/card', passport.authenticate('jwt', { session: false }), card);
app.use('/gift', passport.authenticate('jwt', { session: false }), gift);
app.use('/charities', charityDetails);

app.use('/v1/authenticate', Auth);
app.use('/v1/user', passport.authenticate('jwt', { session: false }), User);
app.use('/v1/admin', passport.authenticate('jwt', { session: false }), Admin);

app.get('/', (req, res) => { res.send("welcome"); });
var port = 3001;
process.env.PORT;
app.listen(port, () => console.log(`Server is running on port number ${port}`));
