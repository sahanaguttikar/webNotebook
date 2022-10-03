const connectToMongo=require('./db');
const express = require('express');
var cors = require('cors');
const bodyparser=require('body-parser');

connectToMongo();
const app = express();

app.use(cors({
}));
const port = 5000
app.use(express.json());

app.use(bodyparser.json());
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`web-notebook app listening at http://localhost:${port}`);
})