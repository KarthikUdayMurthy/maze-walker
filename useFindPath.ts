import * as React from 'react';

const CELL_DELIMITER = '|';
const ANIM_DELAY = 300;

let iterations = 0;

const _findShortPathUsingBFS = (m: number, n: number, bc: string[]) => {
  const blocked = new Set(bc);
  const srcCellInd = '0,0';
  const dstCellInd = `${m - 1},${n - 1}`;
  const visited = new Set();

  const queue: Array<[string, string]> = [[srcCellInd, '']];

  while (queue.length > 0) {
    const [currentCellInd, _currentPath] = queue.shift();

    const rPos = parseInt(currentCellInd.split(',')[0]);
    const cPos = parseInt(currentCellInd.split(',')[1]);

    const rowInbounds = 0 <= rPos && rPos < m;
    const colInbounds = 0 <= cPos && cPos < n;

    if (!rowInbounds || !colInbounds) continue;

    if (blocked.has(currentCellInd)) continue;
    if (visited.has(currentCellInd)) continue;

    iterations++;

    visited.add(currentCellInd);
    const currentPath =
      _currentPath + (_currentPath ? CELL_DELIMITER : '') + currentCellInd;

    if (currentCellInd === dstCellInd) return currentPath.split(CELL_DELIMITER);

    const directions = [
      [1, 1], // diagonal down-right
      [1, 0], // down
      [0, 1], // right
      [-1, 1], // diagonal up-right
      [0, -1], // left
      [-1, 0], // up
    ];

    directions.forEach(([rDiff, cDiff]) => {
      queue.push([`${rPos + rDiff},${cPos + cDiff}`, currentPath]);
    });
  }

  return [];
};

export interface IDataPoint {
  label: string;
  value: string | number;
}

export default function useFindPath(
  m: number,
  n: number,
  blockedCells: string[]
): [string, string[], () => void, () => void, IDataPoint[]] {
  const [currentCell, setCurrentCell] = React.useState<string>('');
  const [pathCells, setPathCells] = React.useState<string[]>([]);
  const [dataPoints, setDataPoints] = React.useState<IDataPoint[]>([]);

  const resetPath = React.useCallback(() => {
    setPathCells([]);
    setCurrentCell('');
    setDataPoints([]);
  }, []);

  React.useEffect(() => {
    resetPath();
  }, [m, n]);

  const animatePath = React.useCallback((cells: string[]) => {
    if (cells.length === 0) {
      setCurrentCell('');
      return;
    }
    const currCell = cells.shift();
    setPathCells((pc) => {
      return [...pc, currCell];
    });
    setCurrentCell(currCell);
    setTimeout(animatePath, ANIM_DELAY, cells);
  }, []);

  const findShortPath = React.useCallback(() => {
    const startCell = '0,0';
    const endCell = `${m - 1},${n - 1}`;
    resetPath();
    setCurrentCell(startCell);
    iterations = 0;
    const startTime = window.performance
      ? window.performance.now()
      : Date.now();
    const shortPath = _findShortPathUsingBFS(m, n, blockedCells);
    const endTime = window.performance ? window.performance.now() : Date.now();
    if (shortPath.length === 0) {
      setDataPoints([
        {
          label: 'Error',
          value: `No Path Found between [${startCell}] and [${endCell}]`,
        },
        { label: 'Iterations', value: iterations },
        {
          label: 'Time',
          value: Math.round((endTime - startTime) * 1000) / 1000 + 'ms',
        },
      ]);
    } else {
      animatePath(shortPath.slice());
      setDataPoints([
        { label: 'Iterations', value: iterations },
        { label: 'Steps in path', value: shortPath.length - 1 },
        {
          label: 'Time',
          value: Math.round((endTime - startTime) * 1000) / 1000 + 'ms',
        },
      ]);
    }
  }, [m, n, blockedCells]);

  return [currentCell, pathCells, resetPath, findShortPath, dataPoints];
}
