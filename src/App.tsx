import './App.css'
import React, {useRef, useState} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import '@tensorflow/tfjs-backend-webgl';
import Webcam from "react-webcam";
import {drawHand} from "./utilities";
import * as fp from 'fingerpose';
import victory from './assets/victory.png';
import thumbs_up from './assets/thumb.png';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory};

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log('Handpose model loaded');
    setInterval(() => {
      detect(net)
    }, 100);
  }

  const detect = async (net) => {
    if(typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video?.videoWidth;
      const videoHeight = webcamRef.current.video?.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current!.width = videoWidth;
      canvasRef.current!.height = videoHeight;

      const hand = await net.estimateHands(video);
      console.log(hand);

      if(hand.length) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ])

        const gesture = await GE.estimate(hand[0].landmarks, 8);

        if(gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map((prediction) => prediction.score);
          const maxConfidence = confidence.indexOf(Math.max(...confidence));
          setEmoji(gesture.gestures[maxConfidence]?.name);
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      drawHand(hand, ctx);
    }
  }

  runHandpose();

  return (
    <div className="App">
        <Webcam ref={webcamRef} className="centeredCanvas" />
          <canvas ref={canvasRef} className="centeredCanvas" />
      <div className="emoji">
        {emoji !== null ? <img src={images[emoji]} style={{height: "100%", width: "auto"}} /> : null}
      </div>
    </div>
  )
}

export default App
