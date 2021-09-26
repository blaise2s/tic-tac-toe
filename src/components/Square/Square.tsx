import styles from './Square.module.scss';

const Square = (props: { value: string, onSquareClick: () => void }) => {
  return (
    <button 
      className={styles.square} 
      onClick={props.onSquareClick}
      // disabled={Boolean(props.value)}
    >
      {props.value}
    </button>
  );
}

export default Square;