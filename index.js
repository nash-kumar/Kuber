
// const app = express();
require('dotenv').config();
const app = require('express')(),
cors = require('cors'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
passport = require('passport'),
mongoose = require('mongoose');
colors = require('colours')

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
require('./config/passport')(passport);

const Auth = require('./routes/authentication.routes');
const User = require('./routes/user.routes');
const Admin = require('./routes/admin.routes');
const charityDetails = require('./routes/charity');

let user = require('./routes/route');
let card = require('./routes/card');

app.use('/userDetails', user);
app.use('/card',card);
app.use('/charities', charityDetails);

app.use('/v1/authenticate', Auth);
app.use('/v1/user', passport.authenticate('jwt', { session: false }), User);
app.use('/v1/admin', passport.authenticate('jwt', {session: false}), Admin);

app.get('/', (req, res) => { res.send("welcome"); });
app.listen(port = 3001, () => console.log(`Server is running on port number ${port}`));
