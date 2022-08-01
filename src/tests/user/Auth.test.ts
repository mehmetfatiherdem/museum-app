import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import DBConnection from '../../db/Connection';

chai.use(chaiHttp);

before(() => {
  DBConnection.getInstance();
});

after(async () => {
  await DBConnection.closeDatabase(true);
});

describe('User Auth Tests', function () {
  after(async () => {
    await DBConnection.clearDatabase();
  });

  describe('Sign Up', function () {
    it('missing info should return 422 error', function (done) {
      chai
        .request(app)
        .post('/api/users/signup')
        .send({
          name: 'anakin',
          email: 'askywalker@gmail.com',
          password: '987654321!As',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.deep.equal({
            message: 'There are missing fields in the body!',
          });
          done();
        });
    });

    it('successful signup should return serialized user information', function (done) {
      chai
        .request(app)
        .post('/api/users/signup')
        .send({
          name: 'anakin',
          lastName: 'skywalker',
          email: 'askywalker@gmail.com',
          password: '987654321!As',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.deep.include({
            message: 'Welcome to the museum app anakin',
            data: {
              name: 'anakin',
              lastName: 'skywalker',
              favMuseums: [],
              email: 'askywalker@gmail.com',
            },
          });
          done();
        });
    });
  });
  describe('Sign In', function () {
    it('should sign in the user', function (done) {
      chai
        .request(app)
        .post('/api/users/signin')
        .send({
          email: 'askywalker@gmail.com',
          password: '987654321!As',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.cookie('token');
          expect(res.body).to.deep.include({
            message: 'Welcome to the museum app anakin',
            data: {
              name: 'anakin',
              lastName: 'skywalker',
              favMuseums: [],
              email: 'askywalker@gmail.com',
            },
          });
          done();
        });
    });

    it('should throw no user found exception', function (done) {
      chai
        .request(app)
        .post('/api/users/signin')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'nonexistingPassword123!',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.deep.equal({
            message: 'No user found with the specified email',
          });

          done();
        });
    });

    it('missing info should return 422 error', function (done) {
      chai
        .request(app)
        .post('/api/users/signin')
        .send({
          password: '987654321!As',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.deep.equal({
            message: 'There are missing fields in the body!',
          });
          done();
        });
    });

    it('should return 422 error for wrong password', function (done) {
      chai
        .request(app)
        .post('/api/users/signin')
        .send({
          email: 'askywalker@gmail.com',
          password: 'wrongPassword123!',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.deep.equal({
            message: 'Wrong password',
          });
          done();
        });
    });
  });

  describe('Signout', function () {
    it('should sign out user', function (done) {
      chai
        .request(app)
        .get('/api/users/signout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.not.have.cookie('token');
          expect(res.body).to.deep.equal({ message: 'signed out' });
          done();
        });
    });
  });
});
