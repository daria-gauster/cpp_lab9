const assert = require("assert");
let server = require('./app');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('index', () => {
    describe('/GET auction page', () => {
        it('test GET admin page', (done) => {
            chai.request(server)
                .get('/auction')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET auctionSettings page', () => {
        it('test GET auction settings page', (done) => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET index page', () => {
        it('test GET index page', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET participants page', () => {
        it('test GET participants page', (done) => {
            chai.request(server)
                .get('/participants')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET pictures page', () => {
        it('test GET pictures page', (done) => {
            chai.request(server)
                .get('/pictures')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET participant page', () => {
        it('test GET admin page', (done) => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET first participant page', () => {
        it('test GET first participant page', (done) => {
            chai.request(server)
                .get('/participants/222222222')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET first picture page', () => {
        it('test GET first picture page', (done) => {
            chai.request(server)
                .get('/pictures/picIdNxIkw_sZj')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET user page', () => {
        it('test GET user page', (done) => {
            chai.request(server)
                .get('/user?name=ILYABYKOV&money=1000')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET admin page', () => {
        it('test GET admin page', (done) => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    /*
    describe('/POST new picture', () => {
        it('test POST new picture', (done) => {
            chai.request(server)
                .post('/pictures/addNewPicture')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({id:res.body.id});
                    done();
                });
        });
    });
    describe('/POST new participant', () => {
        it('test POST new participant', (done) => {
            chai.request(server)
                .post('/participants/addNewParticipant')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({id:res.body.id});
                    done();
                });
        });
    });*/
});