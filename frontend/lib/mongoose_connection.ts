import mongoose from "mongoose";

const mongodb_uri = process.env.MONGODB_URI;

// ? Connection check for db | output
// console.log(`Connected to ${mongodb_uri}`)

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect_to_database() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(mongodb_uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect_to_database;
