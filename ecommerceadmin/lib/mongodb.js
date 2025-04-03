import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URL"');
}

const uri = process.env.MONGODB_URL;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to persist client across module reloads
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  // In production mode, create a new MongoClient on every request
  client = new MongoClient(uri, options);
}

export default client;
