import mongoose from 'mongoose';

class DBConnection {
  private static instance: DBConnection;
  private static count: number;
  private readonly url: string = process.env.DB_URL;

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
      this.count = 0;
    }

    this.count++;
    console.info(`DB connection requested ${this.count} times`);

    return this.instance;
  }
}

export default DBConnection;
