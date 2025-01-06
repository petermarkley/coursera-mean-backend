import * as mongodb from 'mongodb';
import { MyObject } from './object';

export const collections: {
	objects?: mongodb.Collection<MyObject>;
} = {}

export async function connectToDatabase (uri: string){
	const client = new mongodb.MongoClient(uri);
	await client.connect();
	
	const db = client.db("test");
	await applySchemaValidation(db);
	
	const objectsConnection = db.collection<MyObject>('objects');
	collections.objects = objectsConnection
}

async function applySchemaValidation(db: mongodb.Db){
	const jsonSchema = {
		$jsonSchema: {
			bsonType: "object",
			required: ["name", "color"],
			additionalProperties: false,
			properties: {
				_id: {},
				name: {
					bsonType: "string",
					description: "'name' is required and is a string",
				},
				body: {
					bsonType: "string",
					description: "'body' is optional and is a string"
				},
				color: {
					bsonType: "string",
					description: "'color' is required and is one of 'red', 'green', or 'blue'",
					enum: ["red", "green", "blue"],
				},
			},
		},
	};

	await db.command({
		collMod: 'objects',
		validator: jsonSchema
	}).catch(async (error: mongodb.MongoServerError) => {
		if(error.codeName === 'NamesapaceNotFound'){
			await db.createCollection('objects', {validator: jsonSchema})
		}
	})
}

