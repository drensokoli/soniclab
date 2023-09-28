// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri:string = process.env.MONGODB_URI!;
const options = {};

let client;

if(!client){
  client = new MongoClient(uri, options);
}

const clientPromise = client.connect();

export default clientPromise;