import { Request, Response } from 'express';
import ImportCSVService from '../services/ImportCSVService';

const importCSV = async (req: Request, res: Response) => {
  try {
    const importCSV = new ImportCSVService(
      '../assets/csv/museum-part1.csv'
    );
    await importCSV.call();
    res.json({ message: 'done' });
  } catch (err) {
    console.log(err);
  }
};

export { importCSV };
