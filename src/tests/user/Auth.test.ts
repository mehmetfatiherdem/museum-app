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
  await DBConnection.clearDatabase();
  await DBConnection.closeDatabase(true);
});

describe('User Auth Tests', function () {
  describe('signup', function () {
    it('successful signup should return serialized user information', function (done) {
      chai
        .request(app)
        .post('/api/user/signup')
        .send({
          name: 'anakin',
          lastName: 'skywalker',
          email: 'askywalker@gmail.com',
          password: '987654321!As',
        })
        .end((err, res) => {
          expect(res.status).equal(200);
          expect(res.body).to.deep.include({
            message: 'Welcome to the museum app anakin',
            data: {
              name: 'anakin',
              lastName: 'skywalker',
              email: 'askywalker@gmail.com',
            },
          });
          done();
        });
    });
  });
});
