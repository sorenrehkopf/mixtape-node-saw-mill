#!/usr/bin/env node
const dotEnv = require('dotenv');
dotEnv.load();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const logger = require('./services/logger.js');

const corsOptions = process.env.NODE_ENV === 'production' ? { 
	origin: 'https://www.myxtape.io',
	optionsSuccessStatus: 200
} : {
	origin: 'https://www.myxtape-dev.io',
	optionsSuccessStatus: 200
};

// apply middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.post('/', (req, res) => {
	try {
		const { queue } = req.body;
		queue.forEach(({ level, payload }) => {
			console.log({level, payload})
			logger[level]('Received client log event.');
		});
		res.status(200).send('success!');
	} catch(exception) {
		res.status(500).send(exception);
	}
});

app.listen(process.env.PORT || 5500, () => {
	console.log(`app listening on port ${process.env.PORT || '5500'}`);
});
