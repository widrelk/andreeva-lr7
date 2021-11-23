import logo from './logo.svg';
import './App.css';
import {React, useEffect, useState} from 'react';

const jpeg = require('jpeg-js');

function App() {
  const [picDimensions, setPicDimensions] = useState({width: 1, height: 1});
  const [coeff, setCoeff] = useState(1);
  const [pixelsData, setPixelsData] = useState(null);

  const loadImageToCanvas = (canvas, imageData, width, height) => {
    const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        // create imageData object
        var idata = ctx.createImageData(width, height);
        // set our buffer as source
        idata.data.set(imageData);
        // update canvas with new data
        ctx.putImageData(idata, 0, 0);
  };

  useEffect(() => {
    fetch('pic.jpg').then(response => {
      const reader = response.body.getReader();
      reader.read().then(({done, value}) => {
        if (done) {
          reader.close();
          return; 
        }
        const rawImageData = jpeg.decode(value);
        console.log(`Image dimensions are ${rawImageData.width} by ${rawImageData.height}`);
        setPicDimensions({width: rawImageData.width, height: rawImageData.height})
        let pixels = [];
        for (let i = 0; i < rawImageData.data.length; i = i + 4) {
          pixels.push([rawImageData.data[i], rawImageData.data[i + 1], rawImageData.data[i + 2], rawImageData.data[i + 3]]);
        }
        setPixelsData(pixels);
        console.log(rawImageData.data)
        const canvas = document.getElementById('app__given-image-canvas');
        loadImageToCanvas(canvas, rawImageData.data, rawImageData.width, rawImageData.height);
      })
    })
  }, []);

  useEffect(() => {
    if (!pixelsData) {
      return;
    }
    console.log(`original size: ${picDimensions.width}x${picDimensions.height}`)
    
    const newWidth = Math.round(picDimensions.width * coeff);
    const newHeiht = Math.round(picDimensions.height * coeff);

    console.log(`new size: ${newWidth}x${newHeiht}`)

    let mod = [];
    for (let h = 0; h < newHeiht; h++) {
      let y = Math.round(h / coeff);
      for(let w = 0; w < newWidth; w++) {
        let x = Math.round(w / coeff);
        mod.push(pixelsData[y * picDimensions.width + x])
      }
    }

    const canvas = document.getElementById('app__mod-image-canvas');
    loadImageToCanvas(canvas, mod.flat(), newWidth, newHeiht);
  }, [coeff]);

  useEffect(() => {
    if (!pixelsData) {
      return;
    }
    
    const newWidth = Math.round(picDimensions.width * coeff);
    const newHeiht = Math.round(picDimensions.height * coeff);

    console.log(`new size: ${newWidth}x${newHeiht}`)

    let mod = [];
    for (let h = 0; h < newHeiht; h++) {
      let y = Math.round(h / coeff);
      for(let w = 0; w < newWidth; w++) {
        let x = Math.round(w / coeff);
        mod.push(pixelsData[y * picDimensions.width + x])
        
      }
    }

    const canvas = document.getElementById('app__mod-image-canvas');
    loadImageToCanvas(canvas, mod.flat(), newWidth, newHeiht);
  }, [coeff]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <label>
          Коэффициент масштаба
          <input type="number" step="0.1" min="0.1" value={coeff} onChange={e => setCoeff(e.target.value)}></input>
        </label>
      </div>
      <div style={{display: 'inline-block'}}>
        <h3>Оригинальное изображение</h3>
        <canvas id="app__given-image-canvas"/>
      </div>
      <div style={{display: 'inline-block'}}>
        <h3>метод ближайшео соседа</h3>
        <canvas id="app__mod-image-canvas"/>
      </div>
      <div/>
      
    </div>
  );
}

export default App;
