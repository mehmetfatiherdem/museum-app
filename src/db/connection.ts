import mongoose from 'mongoose';

const url = process.env.DB_URL as string;

function connectToMongo() {
  mongoose.connect(url);

  const db = mongoose.connection;

  db.once('open', () => {
    console.log(`Database connected: ${url}`);
  });
  db.on('error', (error) => {
    console.log(`Database connection error: ${error}`);
  });
}

export default connectToMongo;
