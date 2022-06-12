import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Dot from './images/dot.png';

import {
  Page
} from './components';

const App = () => {

  //Constants
  const DOTS_LENGTH = 11;
  const DOTS_SQUARED = DOTS_LENGTH * DOTS_LENGTH;

  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [playerOneColor, setPlayerOneColor] = useState({"background-color":"#FF0000"});
  const [playerTwoColor, setPlayerTwoColor] = useState({"background-color":"#0000FF"})
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [cellList, setCellList] = useState(null);
  const [cellListObject, setCellListObject] = useState({});
  const [sourceDot, setSourceDot] = useState(null);

  //async set functions
  const asyncSetSourceDot = async (value) => {
    setSourceDot(value);
  }
  const asyncSetCellList = async (value) => {
    setCellList(value);
  }
  const asyncSetCellListObject = async (value) => {
    setCellListObject(value);
  }
  const asyncTogglePlayerTurn = async () => {
    if (isPlayerOneTurn) {
      setIsPlayerOneTurn(false);
    } else {
      setIsPlayerOneTurn(true);
    }
  }

  //onClick functions

  const onClickDot = async (e) => {
    const x = e.target.getAttribute("x");
    const y = e.target.getAttribute("y");
    let isHorizontal;
    console.log('clicked on dot: ', x, y);

    if (sourceDot !== null && x == sourceDot[0] && y == sourceDot[1]) {
      await asyncSetSourceDot(null);
    } else if (sourceDot === null) {
      await asyncSetSourceDot([x, y]);
    } else {
      //drawing lines
      console.log('DRAWING NEW LINE');
      let dotA = [];
      let dotB = [];
      if (sourceDot[0] == x) {
        //check if line already exist

        isHorizontal = false;
        if (sourceDot[1] < y) {
          dotA = [...sourceDot];
          dotB = [x, y];
        } else {
          dotB = [...sourceDot];
          dotA = [x, y];
        }
      } else if (sourceDot[1] == y) {
        isHorizontal = true;
        if (sourceDot[0] < x) {
          dotA = [...sourceDot];
          dotB = [x, y];
        } else {
          dotB = [...sourceDot];
          dotA = [x, y];
        }
      } else {
        asyncSetSourceDot(null);
        return;
      }
      console.log('dotA , dotB: ', dotA, dotB);
      if (doesLineExist(isHorizontal, dotA[0], dotA[1])) {
        // asyncSetSourceDot(null);
        return;
      }
      //we have our line; it least x or y to most x or y

      const tempObject = { ...cellListObject };
      console.log('tempObject', tempObject);
      if (tempObject !== {}) {

        //adding line to cellListObject
        if (isHorizontal === true) {
          //horiztonal line
          tempObject[dotA[0]][dotA[1]]['top'] = true;
          //below handles limit case
          if (dotA[1] - 1 > 0) {
            tempObject[dotA[0]][(dotA[1] - 1)]['bottom'] = true;
          }

        } else {
          //Vertical Line
          //tempObject[x][y][direction][value 0-2 //player]
          tempObject[dotA[0]][dotA[1]]['left'] = true;
          //below handles limit case
          //inser function?
          if (dotA[0] - 1 > 0) {
            tempObject[(dotA[0] - 1)][(dotA[1])]['right'] = true;
          }
        }
      }

      //DRAW LINE END FOR PLAYER

      await asyncSetCellListObject(tempObject);
      await asyncSetSourceDot(null);
      await asyncTogglePlayerTurn();
      await checkAnySquares(isHorizontal, dotA[0], dotA[1]);
    }

  }
  //ON CLICK ENDS

  //Validators
  const doesLineExist = (isHorizontal, x, y) => {
    if (isHorizontal === true) {
      if (cellListObject[x][y]['top'] === true) {
        return true;
      } else { return false; }
    } else {
      if (cellListObject[x][y]['left'] === true) {
        return true;
      } else { return false; }
    }
  }
  const isCellSquare = (x, y) => {
    console.log('checking isCellSquare: ', x, y)
    if (cellListObject[x][y]["top"] === true &&
      cellListObject[x][y]["right"] === true &&
      cellListObject[x][y]["bottom"] === true &&
      cellListObject[x][y]["left"] === true) {
      console.log('PASS, cell is square');
      return true;
    } else {
      console.log("FAIL, Cell is no square");
      return false;
    }
  };
  //Action Definition Functions 
  const displayPlayerTurn = (player) => {

    if((isPlayerOneTurn===true && player===1) || (isPlayerOneTurn===false && player===2)) {
      return "It's your turn!"
    } else {return "It is not your turn."}

  };

  const completeSquare = async (x, y) => {
    console.log('running completeSquare(x, y)', x, y)
    const tempObject = { ...cellListObject };
    if (isPlayerOneTurn) {
      tempObject[x][y]["string"] = "1";
    } else {
      tempObject[x][y]["string"] = "2";
    }
    console.log('completed square: cellListObject', tempObject)
    await asyncSetCellListObject(tempObject);

  };
  const checkAnySquares = async (isHorizontal, x, y) => {
    //assuming the x y given is the top/left point for line being drawn
    console.log("CheckAnySqures")
    if (isHorizontal === true) {
      console.log('horizontal line, is square bottom?');
      if (isCellSquare(x, y) === true) {
        await completeSquare(x, y);
        console.log('completed square in checkanysquares');
      }
      if (y - 1 > 0 && isCellSquare(x, (Number(y) - 1).toString()) === true) {
        await completeSquare(x, (Number(y) - 1).toString());
        console.log('completed square in checkanysquares');
      }
    } else {
      if (isCellSquare(x, y) === true) {
        await completeSquare(x, y);
        console.log('completed square in checkanysquares');
      }
      if (x - 1 > 0 && isCellSquare((Number(x) - 1).toString(), y) === true) {
        await completeSquare((Number(x) - 1).toString(), y);
        console.log('completed square in checkanysquares');
      }
    }
    return;
  }
  const generateCells = async () => {
    const tempList = [];
    console.log('cellListObject', cellListObject);
    for (let i = 0; i < DOTS_SQUARED; i++) {
      //setting x and y of the i cell
      let x;
      if (((i + 1) + DOTS_LENGTH) % DOTS_LENGTH === 0) {
        x = DOTS_LENGTH;
      } else {
        x = ((i + 1) + DOTS_LENGTH) % DOTS_LENGTH;
      }
      const y = Math.floor((i + DOTS_LENGTH) / DOTS_LENGTH);

      //setting class for dot
      let dotClassName = "dot";
      if (sourceDot !== null && sourceDot[0] == x && sourceDot[1] == y) {
        dotClassName = "dot active";
      };
      //setting class for cell
      let cellClassName = "cell";
      if (cellListObject !== undefined && cellListObject[x] !== undefined && cellListObject[x][y] !== undefined) {

        if (cellListObject[x][y]["top"] !== false) { cellClassName = cellClassName + " top" }
        if (cellListObject[x][y]["bottom"] !== false) { cellClassName = cellClassName + " bottom" }
        if (cellListObject[x][y]["left"] !== false) { cellClassName = cellClassName + " left" }
        if (cellListObject[x][y]["right"] !== false) { cellClassName = cellClassName + " right" }
      };
      //setting cell string
      const printCellString = () => {
        if (!!cellListObject[x] && !!cellListObject[x][y] && !!cellListObject[x][y]['string']) {
          const cellString = cellListObject[x][y]['string'];
          return <span>
            {cellString}
          </span>
        } else {
          return <></>
        }
      }

      tempList.push(<div key={i + 1} className={cellClassName} > <img onClick={onClickDot} x={x} y={y} className={dotClassName} alt="dot" src={Dot} /> {printCellString()} </div>);
    } //end of for loop


    // console.log('tempList', tempList);

    await asyncSetCellList(tempList);

  }

  const generateCellListObject = async () => {
    const tempObject = {};
    for (let i = 0; i < DOTS_LENGTH; i++) {
      tempObject[(i + 1).toString()] = {};
      for (let j = 0; j < DOTS_LENGTH; j++) {
        tempObject[(i + 1).toString()][(j + 1).toString()] = {
          top: false, right: false, bottom: false, left: false, string: ""
        };
      }
    }
    console.log('set cellListObject: ', tempObject)
    await asyncSetCellListObject(tempObject);
  }
  const asyncGenerateCellListObject = async () => {
    await generateCellListObject();
  }

  const printPlayerTurn = () => {
    if (isPlayerOneTurn) {
      return <>1</>
    } else {
      return <>2</>
    }
  };

  //pre-hook actions
  useEffect(() => {
    asyncGenerateCellListObject();
  }, [])


  //this is our hook

  useEffect(() => {
    generateCells();
  }, [sourceDot, cellListObject]);

  const populateCells = () => {
    if (cellList === null) { return <></> }
    return <>
      {cellList.map(item => {
        return item
      })}
    </>
  }


  return (
    <>
    <div id="console">
        <div className="player-window">
          <div>Player 1 <button>Edit Name</button></div>
          <div>Color: <div className="color-box" style={playerTwoColor}> </div> <button>Edit Color</button></div>
          <div>Score: <span className="score">{playerOneScore}</span></div>
          <div>{displayPlayerTurn(1)}</div>
        </div>
        <div className="player-window">
          <div>Player 2 <button>Edit Name</button></div>
          <div>Color: <div className="color-box" style={playerOneColor}> </div> <button>Edit Color</button></div>
          <div>Score: <span className="score">{playerTwoScore}</span></div>
          <div>{displayPlayerTurn(2)}</div>
        </div>
      </div>
    <div id="dots">
      
      {populateCells()}
    </div>
    </>
  )

}


ReactDOM.render(
  <App />,
  document.getElementById('app'));