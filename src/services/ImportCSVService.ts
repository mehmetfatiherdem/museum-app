import csv from 'csvtojson';
import fs from 'fs';
import { DAY_NAMES, WorkingTimes } from '../helpers/type';
import Museum from '../models/Museum';
import UploadImageService from './UploadImageService';

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
      .subscribe(async (museum) => {
        const name = museum.Name;
        const information = museum.Information;
        const photoUrl = museum.Photo;
        const builtYear = museum.BuiltYear;
        const city = museum.City;
        const entranceFee = museum.EntranceFee;
        const hours = museum.WorkingHours;
        const [opening, closing] = hours.split('-');
        const closedDays = museum.ClosedDays;

        const workingHours: WorkingTimes = {
          monday: {
            opening: '',
            closing: '',
          },
          tuesday: {
            opening: '',
            closing: '',
          },
          wednesday: {
            opening: '',
            closing: '',
          },
          thursday: {
            opening: '',
            closing: '',
          },
          friday: {
            opening: '',
            closing: '',
          },
          saturday: {
            opening: '',
            closing: '',
          },
          sunday: {
            opening: '',
            closing: '',
          },
        };

        DAY_NAMES.forEach((day) => {
          if (day !== closedDays.toLowerCase())
            workingHours[day] = { opening, closing };
        });

        const uploadImage = new UploadImageService(photoUrl);
        const imageUploaded = await uploadImage.call();
        const photo = await uploadImage.getImageInfo(imageUploaded.public_id);

        //FIXME: some lines fail
        await Museum.create({
          name,
          information,
          photo,
          builtYear,
          city,
          entranceFee,
          workingHours,
        });
      });
  }
}

export default ImportCSVService;
