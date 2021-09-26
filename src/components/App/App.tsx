import styles from './App.module.scss';
import Game from '../Game/Game';

const App = () => {
  return (
    <div className={styles.app}>
      <Game />
    </div>
  );
}

export default App;
