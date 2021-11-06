const http = require('http');
const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const urlRegex = require('url-regex');
const app = express();
const googleVision = require('../data/GoogleVision');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/api/landmark', async (req, res) => {
    if(!req.query.q || !urlRegex().test(req.query.q) || !(/\.(jpe?g|png)$/i).test(req.query.q)) {
        res.status(400).send({ message: "Invalid query" });
        return;
    }
    resp = await googleVision.getAllLandmarkInformation(req.query.q);
    if(resp === "error") {
        res.status(500).send();
    } else {
        res.send(resp);
    }
});

app.post('/api/polys', async (req, res) => {
    if(!req.query.q || !urlRegex().test(req.query.q) || !(/\.(jpe?g|png)$/i).test(req.query.q)) {
        res.status(400).send({ message: "Invalid query" });
        return;
    }
    res.send(await googleVision.drawPolys(req.query.q, req.body));
});

app.post('/api/face', async (req, res) => {
    if(!req.query.q || !urlRegex().test(req.query.q) || !(/\.(jpe?g|png)$/i).test(req.query.q)) {
        res.status(400).send({ message: "Invalid query" });
        return;
    }
    resp = await googleVision.analyzaFaces(req.query.q);
    if(resp === "error") {
        res.status(500).send();
    } else {
        res.send(resp);
    }
});

app.post('/api/text', async (req, res) => {
    if(!req.query.q || !urlRegex().test(req.query.q) || !(/\.(jpe?g|png)$/i).test(req.query.q)) {
        res.status(400).send({ message: "Invalid query" });
        return;
    }
    resp = await googleVision.analyzeText(req.query.q);
    if(resp === "error") {
        res.status(500).send();
    } else {
        res.send(resp);
    }
});

app.post('/api/labels', async (req, res) => {
    if(!req.query.q || !urlRegex().test(req.query.q) || !(/\.(jpe?g|png)$/i).test(req.query.q)) {
        res.status(400).send({ message: "Invalid query" });
        return;
    }
    resp = await googleVision.labelImage(req.query.q);
    if(resp === "error") {
        res.status(500).send();
    } else {
        res.send(resp);
    }
});

module.exports.listen = (port = '12345') => new Promise((resolve) => {
    console.log(`Starting Google Vision API server on port ${port}`);
    server = http.createServer(app);
    server.listen(port);
    resolve();
});

module.exports.close = () => new Promise((resolve) => server.close(resolve));