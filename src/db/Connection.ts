import mongoose from 'mongoose';

class DBConnection {
  private static instance: DBConnection;
  private readonly url: string =
    process.env.NODE_ENV == 'test'
      ? process.env.TEST_DB_URL
      : process.env.DB_URL;

  constructor() {
    mongoose.connect(this.url);

    const { connection } = mongoose;

    connection
      .once('open', () => {
        console.log(`Database connected: ${this.url}`);
      })
      .on('error', (error) => {
        console.log(`Database connection error: ${error}`);
      });
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DBConnection();
    }

    return this.instance;
  }

  public static async closeDatabase(drop = false) {
    if (drop) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoose.connection.close();
  }

  public static async clearDatabase() {
    const { collections } = mongoose.connection;
    const results = [];

    for (const key in collections) {
      results.push(collections[key].deleteMany({}));
    }
    await Promise.all(results);
  }
}

export default DBConnection;
