import styles from './Game.module.scss';
import Board from '../Board/Board';

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface Winner {
  name: string;
  squares: string[];
}

const Game = () => {
  const resetSquares = () => {
    return Array<string>(9).fill('');
  }

  const [gameInProgress, setGameInProgress] = useState(false);
  const [xTurn, setXTurn] = useState(true);
  const [turnsTaken, setTurnsTaken] = useState(0);
  const [squares, setSquares] = useState(resetSquares());
  const [winningMessage, setWinningMessage] = useState('');
  const [user1Error, setUser1Error] = useState('');
  const [user2Error, setUser2Error] = useState('');
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const userEmptyError = 'Username cannot be empty';

  const newGame = () => {
    setSquares(resetSquares());
    setGameInProgress(false);
    setXTurn(true);
    setWinningMessage('');
    setTurnsTaken(0);
    setUser1Error('');
    setUser2Error('');
  }

  const getWinningMark = (currentSquares: string[]): string | null => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    let winingMark = null;
    winningCombos.forEach((winningCombo) => {
      const [x, y, z] = winningCombo;
      if (currentSquares[x] && currentSquares[x] === currentSquares[y] && currentSquares[x] === currentSquares[z]) {
        winingMark = currentSquares[x];
      } 
    });
    return winingMark;
  }

  const getWinningUser = (currentSquares: string[]) => {
    const gameWinner = getWinningMark(currentSquares);
    if (gameWinner) {
      return gameWinner === 'X' ? user1 : user2;
    }
    return gameWinner; 
  }

  const logWinner = (winningSquares: string[], winningUser: string) => {
    const winner: Winner = {
      name: winningUser,
      squares: winningSquares,
    }
    fetch('http://localhost:3001/winners', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(winner),
    })
      .then(() => console.log('Winner logged to DB'));
  }

  const checkForWinner = (currentSquares: string[], turn: number) => {
    const winningUser = getWinningUser(currentSquares);
    
    if (winningUser) {
      setWinningMessage(`${winningUser} is the winner!`);
      logWinner(currentSquares, winningUser);
      return;
    }

    if (turn === 9) {
      setWinningMessage(`Tie game`);
    }
  }

  const advanceGame = (squareIdx: number) => {
    if (!squares[squareIdx]) {
      setGameInProgress(true);
      const turn = turnsTaken + 1;
      setTurnsTaken(turn);
      const currentSquares = [...squares];
      currentSquares[squareIdx] = xTurn ? 'X' : 'O'
      setXTurn(!xTurn);
      setSquares(currentSquares);
      checkForWinner(currentSquares, turn);
    }
  }

  const handleSquareClick = (squareIdx: number) => {
    if (user1 && user2 && !winningMessage) {
      advanceGame(squareIdx)
      return 
    }

    emptyUserCheck(user1, setUser1Error);
    emptyUserCheck(user2, setUser2Error);      
    
  }

  const usernameChanged = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      setUser: React.Dispatch<React.SetStateAction<string>>, 
      setUserError: React.Dispatch<React.SetStateAction<string>>, 
    ) => {
    const username = event.target.value;
    setUser(username);
    emptyUserCheck(username, setUserError);
  }

  const emptyUserCheck = (username: string, setUserError: React.Dispatch<React.SetStateAction<string>>) => {
    if (!username) {
      setUserError(userEmptyError);
      return
    } 
    setUserError('');
  }

  return (
    <div className={styles.game}>
      <div className={styles.players}>
      <TextField 
        className={styles['players--input']}
        label="Player 1" 
        variant="outlined" 
        onBlur={() => emptyUserCheck(user1, setUser1Error)}
        error={Boolean(user1Error)}
        helperText={user1Error}
        onChange={event => usernameChanged(event, setUser1, setUser1Error)}
        disabled={gameInProgress}
      />
      <TextField
        className={styles['players--input']}
        label="Player 2"
        variant="outlined"
        onBlur={() => emptyUserCheck(user2, setUser2Error)}
        error={Boolean(user2Error)}
        helperText={user2Error} 
        onChange={event => usernameChanged(event, setUser2, setUser2Error)}
        disabled={gameInProgress}
      />
      </div>
      <Board className={styles.board} squares={squares} onSquareClick={squareIdx => handleSquareClick(squareIdx)}/>
      <div className={styles.winner}>
        {winningMessage ? <div>{winningMessage}</div> : <div></div>}
      </div>
      <Button variant="outlined" onClick={newGame}>New Game</Button>
    </div>
  );
}

export default Game;