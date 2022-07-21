import * as React from 'react';
import './style.css';
import Maze from './Components/Maze';
import Controls from './Components/Controls';
import useFindPath from './useFindPath';

export default function App() {
  const [m, setM] = React.useState<number>(2);
  const [n, setN] = React.useState<number>(3);
  const [blockedCells, setBlockedCells] = React.useState<string[]>([]);

  const [currentCell, pathCells, resetPath, findShortPath] = useFindPath(
    m,
    n,
    blockedCells
  );

  const toggleBlock = React.useCallback(
    (cellId: string) => {
      const startCell = '0,0';
      const endCell = `${m - 1},${n - 1}`;
      if (cellId === startCell || cellId === endCell) {
        return;
      }
      setBlockedCells((x) => {
        if (x.indexOf(cellId) === -1) {
          return [...x, cellId];
        } else {
          return x.filter((tempX) => tempX !== cellId);
        }
      });
      resetPath();
    },
    [m, n]
  );

  return (
    <div className="app-wrap">
      <Controls m={m} n={n} setM={setM} setN={setN} />
      <button
        className="btn-wrap"
        disabled={pathCells.length > 0}
        onClick={findShortPath}
      >
        Find Path
      </button>
      <Maze
        m={m}
        n={n}
        blockedCells={blockedCells}
        toggleBlock={toggleBlock}
        currentCell={currentCell}
        pathCells={pathCells}
      />
    </div>
  );
}
