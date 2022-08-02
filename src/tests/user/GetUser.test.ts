import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import DBConnection from '../../db/Connection';
import User from '../../models/User';
import { faker } from '@faker-js/faker';

chai.use(chaiHttp);

describe('Get User Tests', function () {
  let firstUser;
  let secondUser;

  before(async () => {
    firstUser = new User({
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(10, false, /[a-z]/, 'A123!'),
      favoriteMuseums: [],
    });

    secondUser = new User({
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(10, false, /[a-z]/, 'A123!'),
      favoriteMuseums: [],
    });

    await firstUser.save();
    await secondUser.save();
  });

  after(async () => {
    await DBConnection.clearDatabase();
  });

  it('should return all the users in the DB', function (done) {
    chai
      .request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal([
          {
            message: `User info for ${firstUser.name} retrieved successfully`,
            data: {
              name: firstUser.name,
              lastName: firstUser.lastName,
              email: firstUser.email,
              role: 'normal',
              comments: [],
              favMuseums: [],
            },
          },
          {
            message: `User info for ${secondUser.name} retrieved successfully`,
            data: {
              name: secondUser.name,
              lastName: secondUser.lastName,
              email: secondUser.email,
              role: 'normal',
              comments: [],
              favMuseums: [],
            },
          },
        ]);
        done();
      });
  });

  it('should return the user with the specified ID', function (done) {
    chai
      .request(app)
      .get(`/api/users/${secondUser?.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          message: `User info for ${secondUser?.name} retrieved successfully`,
          data: {
            name: secondUser?.name,
            lastName: secondUser?.lastName,
            email: secondUser?.email,
            role: secondUser?.role,
            comments: secondUser?.comments,
            favMuseums: secondUser?.favoriteMuseums,
          },
        });
        done();
      });
  });

  it('should throw error for an not-existing user', function (done) {
    const nonExistingUserId = firstUser?.id;
    firstUser.delete();

    chai
      .request(app)
      .get(`/api/users/${nonExistingUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.equal({
          message: 'No user found with the specified ID',
        });
        done();
      });
  });
});
