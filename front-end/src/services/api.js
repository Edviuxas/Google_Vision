exports.detectLandmark = (imageUrl) =>
    fetch(`http://localhost:8080/api/landmark?q=${imageUrl}`, {method:'POST'}).then(response => response.json());

exports.analyzeFaces = (imageUrl) =>
    fetch(`http://localhost:8080/api/face?q=${imageUrl}`, {method:'POST'}).then(response => response.json());

exports.drawPolys = (imageUrl, information) =>
    fetch(`http://localhost:8080/api/polys?q=${imageUrl}`, {method:'POST', headers: {"Content-Type": "application/json",}, body: JSON.stringify(information),}).then(response => response.text());

exports.analyzeText = (imageUrl) =>
    fetch(`http://localhost:8080/api/text?q=${imageUrl}`, {method:'POST'}).then(response => response.text());

exports.labelImage = (imageUrl) =>
    fetch(`http://localhost:8080/api/labels?q=${imageUrl}`, {method:'POST'}).then(response => response.json());