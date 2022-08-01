import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import DBConnection from '../../db/Connection';
import User from '../../models/User';

chai.use(chaiHttp);

describe('Get User Tests', function () {
  let firstUser;
  let secondUser;

  before(async () => {
    firstUser = new User({
      name: 'first',
      lastName: 'testUser',
      email: 'firstTestUser@domain.com',
      password: 'firstTestUser123!',
      favoriteMuseums: [],
    });

    secondUser = new User({
      name: 'second',
      lastName: 'testUser',
      email: 'secondTestUser@domain.com',
      password: 'secondTestUser123!',
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
            message: 'User info for first retrieved successfully',
            data: {
              name: 'first',
              lastName: 'testUser',
              email: 'firstTestUser@domain.com',
              role: 'normal',
              comments: [],
              favMuseums: [],
            },
          },
          {
            message: 'User info for second retrieved successfully',
            data: {
              name: 'second',
              lastName: 'testUser',
              email: 'secondTestUser@domain.com',
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
