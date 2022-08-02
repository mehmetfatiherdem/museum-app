import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import DBConnection from '../../db/Connection';
import Museum from '../../models/Museum';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

chai.use(chaiHttp);

describe('Global Museum Endpoints', function () {
  let firstMuseum;
  let secondMuseum;

  before(async () => {
    try {
      firstMuseum = new Museum({
        name: faker.random.word(),
        information: faker.lorem.paragraphs(3, '\n'),
        photo: faker.image.imageUrl(400, 300),
        builtYear: Math.floor(Math.random() * 1000 + 1000),
        city: faker.address.cityName(),
        entranceFee: faker.finance.amount(5, 150),
        workingHours: {
          monday: { opening: '09.00', closing: '18.00' },
          tuesday: { opening: '09.00', closing: '18.00' },
          wednesday: { opening: '', closing: '' },
          thursday: { opening: '09.00', closing: '18.00' },
          friday: { opening: '09.00', closing: '18.00' },
          saturday: { opening: '09.00', closing: '18.00' },
          sunday: { opening: '09.00', closing: '18.00' },
        },
      });

      secondMuseum = new Museum({
        name: faker.random.word(),
        information: faker.lorem.paragraphs(3, '\n'),
        photo: faker.image.imageUrl(400, 300),
        builtYear: Math.floor(Math.random() * 1000 + 1000),
        city: faker.address.cityName(),
        entranceFee: faker.finance.amount(5, 150),
        workingHours: {
          monday: { opening: '09.00', closing: '18.00' },
          tuesday: { opening: '09.00', closing: '18.00' },
          wednesday: { opening: '', closing: '' },
          thursday: { opening: '09.00', closing: '18.00' },
          friday: { opening: '09.00', closing: '18.00' },
          saturday: { opening: '09.00', closing: '18.00' },
          sunday: { opening: '09.00', closing: '18.00' },
        },
      });

      await firstMuseum.save();
      await secondMuseum.save();
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  });

  after(async () => {
    await DBConnection.clearDatabase();
  });

  it('should return the museums in the DB', function (done) {
    chai
      .request(app)
      .get('/api/museums')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal([
          {
            message: `Museum info for ${firstMuseum.name} retrieved successfully`,
            data: {
              name: firstMuseum.name,
              information: firstMuseum.information,
              photo: firstMuseum.photo,
              builtYear: firstMuseum.builtYear,
              city: firstMuseum.city,
              entranceFee: firstMuseum.entranceFee,
              workingHours: firstMuseum.workingHours,
              comments: firstMuseum.comments,
            },
          },
          {
            message: `Museum info for ${secondMuseum.name} retrieved successfully`,
            data: {
              name: secondMuseum.name,
              information: secondMuseum.information,
              photo: secondMuseum.photo,
              builtYear: secondMuseum.builtYear,
              city: secondMuseum.city,
              entranceFee: secondMuseum.entranceFee,
              workingHours: secondMuseum.workingHours,
              comments: secondMuseum.comments,
            },
          },
        ]);
        done();
      });
  });

  it('should return the museum with the specified ID', function (done) {
    chai
      .request(app)
      .get(`/api/museums/${secondMuseum.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          message: `Museum info for ${secondMuseum.name} retrieved successfully`,
          data: {
            name: secondMuseum.name,
            information: secondMuseum.information,
            photo: secondMuseum.photo,
            builtYear: secondMuseum.builtYear,
            city: secondMuseum.city,
            entranceFee: secondMuseum.entranceFee,
            workingHours: secondMuseum.workingHours,
            comments: secondMuseum.comments,
          },
        });
        done();
      });
  });

  it('should throw an error if there is no museum with the specified ID', function (done) {
    const id = new mongoose.Types.ObjectId();
    chai
      .request(app)
      .get(`/api/museums/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.equal({
          message: 'No museum found with the specified ID',
        });
        done();
      });
  });

  it('should return the museums that are located in the specified city', function (done) {
    chai
      .request(app)
      .get(`/api/museums/filter?city=${secondMuseum.city}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal([
          {
            message: `Museum info for ${secondMuseum.name} retrieved successfully`,
            data: {
              name: secondMuseum.name,
              information: secondMuseum.information,
              photo: secondMuseum.photo,
              builtYear: secondMuseum.builtYear,
              city: secondMuseum.city,
              entranceFee: secondMuseum.entranceFee,
              workingHours: secondMuseum.workingHours,
              comments: secondMuseum.comments,
            },
          },
        ]);
        done();
      });
  });

  it('should throw an error if there is no museum in the specified city', function (done) {
    chai
      .request(app)
      .get(`/api/museums/filter?city=${faker.name.firstName()}`)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.equal({
          message: 'No museum found in the DB',
        });
        done();
      });
  });

  it('should return the museum with the specified ID', function (done) {
    chai
      .request(app)
      .get(`/api/museums/${secondMuseum.id}/comments`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          data: {
            comments: secondMuseum.comments, // TODO: add comments in the before section
          },
        });
        done();
      });
  });

  it('should throw an error if there is no museum with the specified ID', function (done) {
    const id = new mongoose.Types.ObjectId();
    chai
      .request(app)
      .get(`/api/museums/${id}/comments`)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.equal({
          message: 'No museum found with the specified ID',
        });
        done();
      });
  });

  it('should throw error when there are no museums', function (done) {
    firstMuseum.delete();
    secondMuseum.delete();
    chai
      .request(app)
      .get('/api/museums')
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.equal({
          message: 'No museum found in the DB',
        });
        done();
      });
  });
});
