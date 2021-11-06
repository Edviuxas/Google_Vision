import React, { useState } from 'react';
import './App.css';
import { Button, Row, InputGroup, FormControl, Tabs, Tab } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  detectLandmark,
  analyzeFaces,
  analyzeText,
  labelImage,
  drawPolys,
} from "../services/api";

function App() {

  const [urlLandmarksValue, setUrlLandmarksValue] = useState('');
  const [urlFacesValue, setUrlFacesValue] = useState('');
  const [urlText, setUrlText] = useState('');
  const [urlLabels, setUrlLabels] = useState('');
  const [labelInfo, setLabelInfo] = useState([{}]);
  const [landmarkInfo, setLandmarkInfo] = useState({});
  const [faceInfo, setFaceInfo] = useState({});
  const [polyImage, setPolyImage] = useState('');
  const [text, setText] = useState('');

  const onDetectLandmarkButtonClick = () => {
    detectLandmark(urlLandmarksValue).then(data => setLandmarkInfo(data));
  };

  const onAnalyzeFacesButtonClick = () => {
    analyzeFaces(urlFacesValue).then(data => setFaceInfo(data));
  };

  const onLocateLandmarkButtonClick = () => {
    drawPolys(urlLandmarksValue, landmarkInfo).then(data => setPolyImage(data));
  };

  const onLocateFaceButtonClick = () => {
    drawPolys(urlFacesValue, faceInfo).then(data => setPolyImage(data));
  };

  const onAnalyzeTextClick = () => {
    analyzeText(urlText).then(data => setText(data));
  }

  const onLabelButtonClick = () => {
    labelImage(urlLabels).then(data => setLabelInfo(data));
  }

  const resetImage = () => {
    setPolyImage('');
  }

  return (
    <Tabs onSelect={resetImage} defaultActiveKey="home" id="uncontrolled-tab-example" style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
      <Tab eventKey="home" title="Landmark detection">
        <Row>
          <InputGroup className="mb-3" style={{width: 1000, paddingTop: 20, paddingLeft: 20, paddingRight:20}}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                Image URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={e => setUrlLandmarksValue(e.target.value)}/>
            <InputGroup.Append>
              <Button variant="outline-primary" onClick={onDetectLandmarkButtonClick}>Detect the landmark!</Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
        <Row>
          <ul>
            <li>Name of the landmark: <b>{landmarkInfo.description}</b></li>
            <li>Confidence in the answer: <b>{landmarkInfo.score}%</b></li>
          </ul>
        </Row>
        <Row style={{paddingLeft:20, paddingTop:10}}>
          <Button onClick={onLocateLandmarkButtonClick}>Locate the landmark in the image</Button>
        </Row>
        <Row>
          <img src={`data:image/jpg;base64,${polyImage}`} height="600" style={{paddingLeft:20, paddingTop:10}}/>
        </Row>
      </Tab>
      <Tab eventKey="profile" title="Face analysis">
        <Row>
          <InputGroup className="mb-3" style={{width: 1000, paddingTop: 20, paddingLeft: 20, paddingRight:20}}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                Image URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={e => setUrlFacesValue(e.target.value)}/>
            <InputGroup.Append>
              <Button variant="outline-primary" onClick={onAnalyzeFacesButtonClick}>Analyze the face!</Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
        <Row>
          <ul>
            <li>Likelihood of joy in this image: <b>{faceInfo.joyLikelihood}</b></li>
            <li>Likelihood of sorrow in this image: <b>{faceInfo.sorrowLikelihood}</b></li>
            <li>Likelihood of anger in this image: <b>{faceInfo.angerLikelihood}</b></li>
            <li>Likelihood of surprise in this image: <b>{faceInfo.surpriseLikelihood}</b></li>
          </ul>
        </Row>
        <Row style={{paddingLeft:20, paddingTop:10}}>
          <Button onClick={onLocateFaceButtonClick}>Locate the face in the image</Button>
        </Row>
        <Row>
          <img src={`data:image/jpg;base64,${polyImage}`} height="600" style={{paddingLeft:20, paddingTop:10}}/>
        </Row>
      </Tab>
      <Tab eventKey="text" title="Text detection">
        <Row>
          <InputGroup className="mb-3" style={{width: 1000, paddingTop: 20, paddingLeft: 20, paddingRight:20}}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                Image URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={e => setUrlText(e.target.value)}/>
            <InputGroup.Append>
              <Button variant="outline-primary" onClick={onAnalyzeTextClick}>Detect text!</Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
        <Row style={{paddingLeft:20}}>
          <label>Text: <b>{text}</b></label>
        </Row>
      </Tab>
      <Tab eventKey="label" title="Label image">
        <Row>
          <InputGroup className="mb-3" style={{width: 1000, paddingTop: 20, paddingLeft: 20, paddingRight:20}}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                Image URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={e => setUrlLabels(e.target.value)}/>
            <InputGroup.Append>
              <Button variant="outline-primary" onClick={onLabelButtonClick}>Label this image!</Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
        <Row>
          <ul>
            {labelInfo.map(label => (
              <li key={label.description}>
                Label: <b>{label.description}</b>, score: <b>{label.score}</b>
              </li>
            ))}
          </ul>
        </Row>
      </Tab>
    </Tabs>
  );
}

export default App;
