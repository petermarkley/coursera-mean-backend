import * as mongodb from 'mongodb';

export interface MyObject {
	name: string;
	body: string;
	color: 'red' | 'green' | 'blue';
	_id?: mongodb.ObjectId;
}

