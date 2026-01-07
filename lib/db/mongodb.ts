import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

function getMongoClient(): Promise<MongoClient> {
  // Check at runtime, not at module load time
  // This allows the build to succeed even without MONGODB_URI
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  // Return existing client promise if available
  if (clientPromise) {
    return clientPromise;
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

// Export a function that returns the client promise (lazy-loaded)
// This prevents build-time errors when MONGODB_URI is not set
export default function getClientPromise(): Promise<MongoClient> {
  return getMongoClient();
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB_NAME || 'todoapp');
}

// Helper to check if MongoDB is configured (for build-time checks)
export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI;
}

