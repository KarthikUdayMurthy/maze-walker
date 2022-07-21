import * as React from 'react';

export interface IMazeProps {
  m: number;
  n: number;
  blockedCells: string[];
  toggleBlock: (cellId: string) => void;
  currentCell?: string;
  pathCells?: string[];
}

const Maze = React.memo<IMazeProps>(
  ({ m, n, blockedCells, toggleBlock, currentCell = '', pathCells = [] }) => {
    if (m < 1 || n < 1) {
      return null;
    }

    const mazeArr: Array<Array<number>> = Array(m).fill(Array(n).fill(''));

    return (
      <div className="maze-wrap scrollWrap">
        <div className="maze">
          {mazeArr.map((cols, i) => (
            <div key={i} className="maze-row">
              {cols.map((c, j) => {
                const cellId = `${i},${j}`;
                const isBlocked = blockedCells.indexOf(cellId) !== -1;
                const isCurrentCell = cellId === currentCell;
                const isPathCell = pathCells.indexOf(cellId) !== -1;
                return (
                  <div
                    key={cellId}
                    className={
                      'maze-cell ' +
                      (isCurrentCell ? ' current ' : '') +
                      (isPathCell ? ' path ' : '') +
                      (isBlocked ? ' blocked ' : '')
                    }
                    title={`[${cellId}] ${
                      isBlocked ? 'Click to un-block' : 'Click to block'
                    }`}
                    onClick={() => {
                      toggleBlock(cellId);
                    }}
                  >
                    <span className="text-wrap">
                      {i},{j}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default Maze;
