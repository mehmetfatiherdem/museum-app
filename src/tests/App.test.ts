import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('App Test', function () {
  it('Returns Home Page', function (done) {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Home Page');
        done();
      });
  });
});
