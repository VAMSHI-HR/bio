import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { PredictionModel, IPredictionResult } from "./models";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/multi-disease-prediction";
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "history.json");

let isMongoConnected = false;

// Initialize the local JSON file database with some mock records if it doesn't exist
function initLocalJsonDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2));
    console.log("Local JSON database initialized at:", LOCAL_DB_PATH);
  }
}

// Connect to MongoDB with graceful fallback
export async function initDb() {
  initLocalJsonDb();
  
  try {
    console.log(`Attempting connection to MongoDB at: ${MONGODB_URI}...`);
    // Set connection timeout to 4 seconds to fail fast and fallback
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    isMongoConnected = true;
    console.log("Database Status: Connected to MongoDB successfully.");
  } catch (error) {
    console.warn("Database Status: MongoDB connection failed. Falling back to local file-based JSON storage.");
    console.warn(`Error details: ${(error as Error).message}`);
    isMongoConnected = false;
  }
}

// Helper: Check if using Mongo
export function usingMongo() {
  return isMongoConnected;
}

// Helper: Read JSON database
function readJsonDb(): IPredictionResult[] {
  try {
    initLocalJsonDb();
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local JSON database:", error);
    return [];
  }
}

// Helper: Write JSON database
function writeJsonDb(data: IPredictionResult[]) {
  try {
    initLocalJsonDb();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing local JSON database:", error);
  }
}

// Save a new prediction record
export async function savePrediction(record: IPredictionResult): Promise<IPredictionResult> {
  if (isMongoConnected) {
    try {
      const doc = new PredictionModel(record);
      await doc.save();
      return doc.toObject() as IPredictionResult;
    } catch (error) {
      console.error("MongoDB save failed, attempting JSON file write instead:", error);
    }
  }

  // Fallback to Local JSON DB
  const history = readJsonDb();
  history.unshift(record); // Prepend so latest shows first
  writeJsonDb(history);
  return record;
}

// Retrieve prediction history
export async function getHistory(): Promise<IPredictionResult[]> {
  if (isMongoConnected) {
    try {
      const docs = await PredictionModel.find().sort({ date: -1 }).exec();
      return docs.map(doc => doc.toObject() as IPredictionResult);
    } catch (error) {
      console.error("MongoDB fetch failed, reading from local JSON file instead:", error);
    }
  }

  // Fallback to Local JSON DB
  return readJsonDb();
}

// Delete a prediction record by ID
export async function deletePrediction(id: string): Promise<boolean> {
  if (isMongoConnected) {
    try {
      const result = await PredictionModel.deleteOne({ id } as any).exec();
      if (result.deletedCount && result.deletedCount > 0) {
        return true;
      }
    } catch (error) {
      console.error("MongoDB delete failed, modifying local JSON file instead:", error);
    }
  }

  // Fallback to Local JSON DB
  const history = readJsonDb();
  const index = history.findIndex(item => item.id === id);
  if (index !== -1) {
    history.splice(index, 1);
    writeJsonDb(history);
    return true;
  }
  return false;
}

// Find a single record by ID
export async function getPredictionById(id: string): Promise<IPredictionResult | null> {
  if (isMongoConnected) {
    try {
      const doc = await PredictionModel.findOne({ id } as any).exec();
      if (doc) {
        return doc.toObject() as IPredictionResult;
      }
    } catch (error) {
      console.error("MongoDB query failed, looking up in local JSON file instead:", error);
    }
  }

  // Fallback to Local JSON DB
  const history = readJsonDb();
  const match = history.find(item => item.id === id);
  return match || null;
}

// Clear all records
export async function clearHistory(): Promise<void> {
  if (isMongoConnected) {
    try {
      await PredictionModel.deleteMany({}).exec();
      return;
    } catch (error) {
      console.error("MongoDB clear failed, resetting local JSON file instead:", error);
    }
  }

  // Fallback to Local JSON DB
  writeJsonDb([]);
}
