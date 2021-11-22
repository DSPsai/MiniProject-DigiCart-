const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use(cors());
app.get('/api/todos', (req, res) => {
	return res.json(
		req.user
	);
});
app.get('/api/locs', (req, res) => {
	return res.json(
		[
			{id:'1',name:'Shop_name1',category:'cat1',location:{latitude:'17.454940992863282', longitude:'78.52905563335251'}},
			{id:'2',name:'Shop_name2',category:'cat1',location:{latitude:'17.45420397651908', longitude:'78.53017139792266'}},
			{id:'3',name:'Shop_name3',category:'cat1',location:{latitude:'17.446930006178953', longitude:'78.52680959620963'}},
		]
	);
});
const merchantRouter=require('./routes/merchant');
app.use('/api/merchant',merchantRouter);
const User=require('./routes/User');
app.use('/api/User',User);
app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});

exports.app = functions.https.onRequest(app);