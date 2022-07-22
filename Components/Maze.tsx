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
    const [showLabels, setShowLabels] = React.useState<boolean>(true);

    if (m < 1 || n < 1) {
      return null;
    }

    const mazeArr: Array<Array<number>> = Array(m).fill(Array(n).fill(''));

    const pathCellsEmpty = pathCells.length === 0;

    return (
      <div className="maze-wrap scrollWrap">
        <button
          className="btn-wrap"
          onClick={() => {
            setShowLabels(!showLabels);
          }}
        >{`${showLabels ? 'Hide' : 'Show'} labels`}</button>
        <div className="maze">
          {mazeArr.map((cols, i) => (
            <div key={i} className="maze-row">
              {cols.map((c, j) => {
                const cellId = `${i},${j}`;
                const isBlocked = blockedCells.indexOf(cellId) !== -1;
                const isCurrentCell = cellId === currentCell;
                const isPathCell = pathCells.indexOf(cellId) !== -1;
                const isStartCell = i === 0 && j === 0;
                const isEndCell = i === m - 1 && j === n - 1;
                return (
                  <div
                    key={cellId}
                    className={
                      'maze-cell ' +
                      (isCurrentCell ? ' current ' : '') +
                      (isPathCell ? ' path ' : '') +
                      (isBlocked ? ' blocked ' : '') +
                      (isStartCell ? ' start ' : '') +
                      (isEndCell ? ' end ' : '')
                    }
                    title={`[${cellId}] ${
                      isStartCell
                        ? 'start cell'
                        : isEndCell
                        ? 'end cell'
                        : isBlocked
                        ? 'Click to un-block'
                        : 'Click to block'
                    }`}
                    onClick={() => {
                      toggleBlock(cellId);
                    }}
                    style={{
                      opacity: isPathCell || pathCellsEmpty ? '1' : '0.66',
                    }}
                  >
                    {showLabels && (
                      <span className="text-wrap">
                        {i},{j}
                      </span>
                    )}
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
