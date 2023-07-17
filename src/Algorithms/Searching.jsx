import React, { useState } from 'react';
import "../Styles/SearchSort.css"

function Searching() {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [searching, setSearching] = useState(false);

  // Generate a new sorted array
 // Generate a new sorted array with random values
const generateArray = () => {
    const newArray = [];
    for (let i = 1; i <= 50; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setTarget('');
  };
  

  // Handle target value input change
  const handleTargetChange = (event) => {
    setTarget(Number(event.target.value));
  };

  // Binary search algorithm
  const binarySearch = async () => {
    setSearching(true);
    let low = 0;
    let high = array.length - 1;
    let found = false;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midValue = array[mid];

      const arrayBars = document.getElementsByClassName('array-bar');
      for (let i = 0; i < arrayBars.length; i++) {
        const barStyle = arrayBars[i].style;
        if (i === low || i === high) {
          barStyle.backgroundColor = 'yellow';
        } else if (i === mid) {
          barStyle.backgroundColor = 'purple';
        } else {
          barStyle.backgroundColor = 'blue';
        }
      }

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );

      if (midValue === target) {
        found = true;
        break;
      } else if (midValue < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const arrayBars = document.getElementsByClassName('array-bar');

    if (found) {
      alert(`Target found at index ${low}!`);
      arrayBars[low].style.backgroundColor = 'green';
    } else {
      alert('Target not found!');
    }

    setSearching(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Binary Search Algorithm Visualizer</h1>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className={`array-bar ${value === target ? 'target' : ''}`}
              key={idx}
              style={{ height: `${value}px` }}
            >{value}</div>
          ))}
        </div>
        <div className="search-container">
          <label htmlFor="target">Target Value:</label>
          <input
            type="number"
            id="target"
            value={target}
            onChange={handleTargetChange}
            disabled={searching}
          />
          <button onClick={binarySearch} disabled={searching}>
            Search
          </button>
        </div>
        <div className="button-container">
          <button onClick={generateArray} disabled={searching}>
            Generate New Array
          </button>
        </div>
      </header>
    </div>
  );
}

export default Searching;
