import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';

class ImportCSVService {
  private readonly csvFilePath: string;
  
  constructor(csvFilePath: string) {
    this.csvFilePath = `${__dirname}/${csvFilePath}`;
  }

  public async call() {
    csv()
      .fromStream(
        fs.createReadStream(this.csvFilePath, {
          encoding: 'utf-8',
        })
      )
      .subscribe((json) => {
        console.log(json);
      });
  }
}

export default ImportCSVService;
