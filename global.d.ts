import { MongoClient } from 'mongodb';

// This is required to make TypeScript treat this file as a module.
export {};

declare global {
  // Add the _mongoClientPromise to the global namespace
  var _mongoClientPromise: Promise<MongoClient> | null;

  // Retain the pastes variable you already have
  var pastes: Map<string, { title: string; content: string }>;
}
