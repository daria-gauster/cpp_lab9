const express = require('express');
const router = express.Router();
var shortid = require('shortid');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterParticipants = new FileSync('public/lib/participants.json');
var dbParticipants = low(adapterParticipants);
var participants = JSON.parse(fs.readFileSync('public/lib/participants.json','utf-8'));
const adapterPictures = new FileSync('public/lib/pictures.json');
var dbPictures = low(adapterPictures);
var pictures = JSON.parse(fs.readFileSync('public/lib/pictures.json','utf-8'));
const adapterAuction = new FileSync('public/lib/auction.json');
var dbAuction = low(adapterAuction);
var auction = JSON.parse(fs.readFileSync('public/lib/auction.json','utf-8'));

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction' });
});

router.get('/pictures', (req, res, next) => {
    res.render('pictures', {title: 'Paintings', pictures:pictures.arr});
});

router.get('/auction', (req, res, next) => {
    res.render('auction', {title: 'Auction', pictures:pictures.arr, auction: auction.myAuc, participants:participants.arr});
});

router.get('/participants', (req, res, next) => {
    res.render('participants', {title: 'Bidders', participants:participants.arr});
});

router.get('/auctionSettings', (req, res, next) => {
    res.render('auctionSettings', {title: 'Settings', pictures: pictures.arr, auction: auction.myAuc});
  
});

router.get('/participants/:id([a-zA-Z0-9!@#-_]{1,})',(req,res,next) => {
    const id = req.params.id;
    var participant = participants.arr.find(p => p.id == id);
    if (participant) {
         res.render('participant', { title: 'Bidder', participant: participant, pictures:pictures.arr});
    }
  
});

router.get('/pictures/:id([a-zA-Z0-9!@#-_]{1,})',(req,res,next) => {
    const id = req.params.id;
    var picture = pictures.arr.find(p => p.id == id);
    if (picture) {
        res.render('picture', { title: 'Painting', picture: picture});
    }
   
});

router.post('/pictures/addNewPicture', (req, res) => {
    req.body.id = "picId"+shortid.generate();
    req.body.inAuction = false;
    dbPictures.get('arr')
        .push(req.body)
        .write();
    pictures.arr.push(req.body);
    res.send({id:req.body.id});
   
    res.status(200);
});

router.post('/participants/addNewParticipant', (req, res) => {
    req.body.id = "usrId"+shortid.generate();
    dbParticipants.get('arr')
        .push(req.body)
        .write();
    participants.arr.push(req.body);
    res.send({id:req.body.id});
    res.status(200);
});

router.post('/pictures/deletePicture', (req,res) => {
    var pic = req.body;
    var index = -1;
    for(let i = 0; i < pictures.arr.length; i++) {
        if (pictures.arr[i].id === pic.id) {
            index = i;
        }
    }
    dbPictures.get('arr')
        .remove(pictures.arr[index])
        .write();
    if (index !== -1) {
        pictures.arr.splice(index,1)
    }
    res.status(200);
});

router.delete('/participants/deleteParticipant', (req,res) => {
    var par = req.body;
    var index = -1;
    for(let i = 0; i < participants.arr.length; i++) {
        if (participants.arr[i].id === par.id) {
            index = i;
        }
    }
    dbParticipants.get('arr')
        .remove(participants.arr[index])
        .write();
    if (index !== -1) {
        participants.arr.splice(index,1)
    }
    res.status(200);
});

router.put('/participants/addPicToPar', (req,res) => {
    var par = req.body;
    var index = -1;
    for(let i = 0; i < participants.arr.length; i++) {
        if (participants.arr[i].id === par.id) {
            index = i;
        }
    }
    if(participants.arr[index].auction == "")
        participants.arr[index].auction = []
    participants.arr[index].auction.push({picture: par.picture, maxPrice: par.maxPrice});
    dbParticipants.get('arr')
        .find({ id: par.id})
        .assign({ auction: participants.arr[index].auction })
        .write()
    res.status(200);
});

router.put('/participants/changeMoney', (req,res) => {
    var par = req.body;
    var index = -1;
    for(let i = 0; i < participants.arr.length; i++) {
        if (participants.arr[i].id === par.id) {
            index = i;
        }
    }
    participants.arr[index].money = par.money;
    dbParticipants.get('arr')
        .find({ id: par.id})
        .assign({ money: par.money})
        .write()
    res.status(200);
});

router.put('/pictures/renamePicture',(req,res) => {
    var pic = req.body;
    var index = -1;
    for(let i = 0; i < pictures.arr.length; i++) {
        if (pictures.arr[i].id === pic.id) {
            index = i;
        }
    }
    if (pictures.arr[index].inAuction == true) {
        pic.inAuction = true;
        pic.link = pictures.arr[index].link;
        pictures.arr[index] = pic;
        dbPictures.get('arr')
            .find({ id: pic.id})
            .assign(pic)
            .write()
    } else {
        pic.inAuction = false;
        pic.link = pictures.arr[index].link;
        pictures.arr[index] = pic;
        dbPictures.get('arr')
            .find({ id: pic.id})
            .assign(pic)
            .write()
    }
});

router.put("/pictures/removeFromAuction", (req,res) => {
    var pic = req.body;
    var index = -1;
    for(let i = 0; i < pictures.arr.length; i++) {
        if (pictures.arr[i].id === pic.id) {
            index = i;
        }
    }
    pic = pictures.arr[index];
    pic.inAuction = false;
    pic.beginning_price = null;
    pic.min_step = null;
    pic.max_step = null;
    dbPictures.get('arr')
        .find({ id: pic.id})
        .assign(pic)
        .write();
    res.status(200)
});

router.put("/pictures/addInAuction", (req,res) => {
    var pic = req.body;
    var index = -1;
    for(let i = 0; i < pictures.arr.length; i++) {
        if (pictures.arr[i].id === pic.id) {
            index = i;
        }
    }
    pictures.arr[index].inAuction = true;
    pictures.arr[index].beginning_price = pic.beginning_price;
    pictures.arr[index].min_step = pic.min_step;
    pictures.arr[index].max_step = pic.max_step;
    pic = pictures.arr[index];
    dbPictures.get('arr')
        .find({ id: pic.id})
        .assign(pic)
        .write();
    res.status(200);
});

router.put('/auctionSettings/rewrite',(req,res)=> {
    var auc = req.body;
    auc.id="auction";
    dbAuction.set('myAuc', auc)
        .write();
    auction.myAuc = auc;
    console.log(auction.myAuc);
    res.status(200);
});

module.exports = router;
