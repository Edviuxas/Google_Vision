const fetch = require(`node-fetch`);
const stream = require('stream');
const fs = require('fs');
require("dotenv").config();

const API_KEY = process.env.API_KEY;

module.exports.analyzaFaces = async (url) => {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
        method: 'POST',
        body: `{
            "requests": [
            {
                "image": {
                "source": {
                    "imageUri": "${url}"
                }
                },
                "features": [
                {
                    "maxResults": 1,
                    "type": "FACE_DETECTION"
                },
                ]
            }
            ]
        }`,
        headers: {
        Accept: 'application/json',
        }
    },
    )
    .then(data => data.json());

    if(checkIfResponseContainsError(response)) {
        return "error";
    } else {
        return response.responses[0].faceAnnotations[0];
    }
}

module.exports.drawPolys = async (url, information) => {
    const image = await fetch(url);
    const baseImage = await image.buffer();
    const PImage = require('pureimage');
    
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(baseImage);
    readable.push(null);

    let promise;
    promise = PImage.decodeJPEGFromStream(readable);
    const img = await promise;
    var context = img.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);

    context.strokeStyle = 'rgba(0,255,0,0.8)';
    context.lineWidth = '3'; 
    var vertices = information.boundingPoly.vertices;

    context.beginPath();
    vertices.forEach((bounds, i) => {

        var xCoord, yCoord;
        if(!bounds.hasOwnProperty('x')) {
            xCoord = 0;
            yCoord = bounds.y;
        } else if(!bounds.hasOwnProperty('y')) {
            yCoord = 0;
            xCoord = bounds.x;
        } else {
            yCoord = bounds.y;
            xCoord = bounds.x;
        }

        if (i === 0) {
            origX = xCoord;
            origY = yCoord;
            context.moveTo(xCoord, yCoord);
        } else {
            context.lineTo(xCoord, yCoord);
        }
    });
    context.lineTo(origX, origY);
    context.stroke();

    console.log(`Writing to file`);
    const writeStream = fs.createWriteStream('img.jpg');
    await PImage.encodeJPEGToStream(img, writeStream);

    const base64Image = fs.readFileSync('img.jpg', {encoding: 'base64'});
    fs.unlink('img.jpg', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    return base64Image;
}

module.exports.analyzeText = async (url) => {

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
        method: 'POST',
        body: `{
            "requests": [
            {
                "image": {
                "source": {
                    "imageUri": "${url}"
                }
                },
                "features": [
                {
                    "type": "TEXT_DETECTION"
                },
                ]
            }
            ]
        }`,
        headers: {
        Accept: 'application/json',
        }
    },
    )
    .then(data => data.json());

    if(checkIfResponseContainsError(response)) {
        return "error";
    } else {
        return response.responses[0].fullTextAnnotation.text.toString();
    }
}

module.exports.labelImage = async (url) => {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
        method: 'POST',
        body: `{
            "requests": [
            {
                "image": {
                "source": {
                    "imageUri": "${url}"
                }
                },
                "features": [
                {
                    "maxResults": 5,
                    "type": "LABEL_DETECTION"
                },
                ]
            }
            ]
        }`,
        headers: {
        Accept: 'application/json',
        }
    },
    ).then(data => data.json());

    if(checkIfResponseContainsError(response)) {
        return "error";
    } else {
        return response.responses[0].labelAnnotations;
    }
}

module.exports.getAllLandmarkInformation = async (url) => {

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
        method: 'POST',
        body: `{
            "requests": [
            {
                "image": {
                "source": {
                    "imageUri": "${url}"
                }
                },
                "features": [
                {
                    "maxResults": 1,
                    "type": "LANDMARK_DETECTION"
                },
                ]
            }
            ]
        }`,
        headers: {
        Accept: 'application/json',
        }
    },
    )
    .then(data => data.json());

    if(checkIfResponseContainsError(response)) {
        return "error";
    } else {
        return response.responses[0].landmarkAnnotations[0];
    }
}

function checkIfResponseContainsError(apiResponse) {
    console.log(apiResponse);
    if(apiResponse.responses[0].hasOwnProperty('error'))
        return true;
    return false;
}