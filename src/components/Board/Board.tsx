import styles from './Board.module.scss';
import Square from '../Square/Square';

const Board = (props: { squares: string[], onSquareClick: (squareIdx: number) => void, className?: string }) => {
  const renderSquare = (position: number) => {
    return (
      <Square value={props.squares[position]} onSquareClick={() => props.onSquareClick(position)} key={position}/>
    )
  }

  return (
    <div className={props.className}>
      {[[0,1,2], [3,4,5], [6,7,8]].map((row, rowIdx) => (
        <div className={styles['board--row']} key={rowIdx}>{row.map(squareIdx => renderSquare(squareIdx))}</div>
      ))}
    </div>
  )
}

export default Board;