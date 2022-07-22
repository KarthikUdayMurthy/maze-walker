import * as React from 'react';
import './style.css';
import Maze from './Components/Maze';
import Controls from './Components/Controls';
import useFindPath from './useFindPath';

export default function App() {
  const [m, setM] = React.useState<number>(5);
  const [n, setN] = React.useState<number>(5);
  const [blockedCells, setBlockedCells] = React.useState<string[]>([
    '1,1',
    '0,4',
  ]);

  const [currentCell, pathCells, resetPath, findShortPath, dataPoints] =
    useFindPath(m, n, blockedCells);

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
        disabled={currentCell !== ''}
        onClick={findShortPath}
      >
        Find Short Path
      </button>
      <div className="info-wrap">
        Use the above controls to change the below grid size, click on a cell to
        block<div className="maze-cell display blocked"></div> / unblock
        <div className="maze-cell display"></div> it. Click on the 'Find Short
        Path' button to find the shortest path between the start cell
        <div className="maze-cell display start"></div> and end cell
        <div className="maze-cell display end"></div>.
      </div>
      <Maze
        m={m}
        n={n}
        blockedCells={blockedCells}
        toggleBlock={toggleBlock}
        currentCell={currentCell}
        pathCells={pathCells}
      />
      {dataPoints.length !== 0 && (
        <div className="info-wrap">
          {dataPoints.map((dp, ind) => {
            return (
              <div className="data-point-wrap">
                <span className="data-point-label">{dp.label}: </span>
                <span className="data-point-value">{dp.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
