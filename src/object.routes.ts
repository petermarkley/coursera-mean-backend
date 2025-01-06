import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const myObjectRouter = express.Router();
myObjectRouter.use(express.json());

myObjectRouter.get('/', async (_req, res) => {
	try {
		const myObjects = await collections.objects.find({}).toArray();
		res.status(200).send(myObjects);
	} catch(error) {
		console.error(error.message);
		res.status(500).send(error.message);
	}
});

myObjectRouter.get('/:id', async (req, res) => {
	try {
		
		const id = req?.params?.id;
		const query = {_id: new mongodb.ObjectId(id)};
		const myObject = await collections.objects.findOne(query);
		
		if (myObject) {
			res.status(200).send(myObject);
		} else {
			res.status(404).send(`Failed to find myObject with ID ${id}`);
		}
		
	} catch(error) {
		console.error(error.message);
		res.status(404).send(error.message);
	}
});

myObjectRouter.post('/', async (req, res) => {
	try {
		
		const myObject = req.body;
		const result = await collections.objects.insertOne(myObject);
		
		if (result.acknowledged) {
			res.status(201).send(`Created a new myObject: ID ${result.insertedId}`);
		} else {
			res.status(500).send("Failed to create new myObject");
		}
		
	} catch(error) {
		console.error(error.message);
		res.status(400).send(error.message);
	}
});

myObjectRouter.put('/:id', async (req, res) => {
	try {
		
		const id = req?.params?.id;
		const myObject = req.body;
		const query = {_id: new mongodb.ObjectId(id)};
		const result = await collections.objects.updateOne(query, {$set: myObject});
		
		if (result && result.matchedCount) {
			res.status(200).send(`Updated myObject with ID ${id}`);
		} else if (!result.matchedCount) {
			res.status(404).send(`Failed to find myObject with ID ${id}`);
		} else {
			res.status(304).send(`Failed to update myObject with ID ${id}`);
		}
		
	} catch(error) {
		console.error(error.message);
		res.status(400).send(error.message);
	}
});

myObjectRouter.delete('/:id', async (req, res) => {
	try {
		
		const id = req?.params?.id;
		const query = {_id: new mongodb.ObjectId(id)};
		const result = await collections.objects.deleteOne(query);
		
		if (result && result.deletedCount) {
			res.status(202).send(`Removed myObject with ID ${id}`);
		} else if (!result) {
			res.status(400).send(`Failed to remove myObject with ID ${id}`);
		} else {
			res.status(404).send(`Failed to find myObject with ID ${id}`);
		}
		
	} catch(error) {
		console.error(error.message);
		res.status(400).send(error.message);
	}
});

