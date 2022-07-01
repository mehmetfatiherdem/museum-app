import csv from 'csvtojson';

class ImportCSVService {
  constructor(private readonly csvFilePath: string) {}

  public async call() {
    const jsonArray = await csv().fromFile(this.csvFilePath);
  }
}

export default ImportCSVService;
