import * as React from 'react';

const CELL_DELIMITER = '|';
const PATH_DELIMITER = '::';
const ANIM_DELAY = 300;
const MemoizeResults = true;

let iterations = 0;

const _findAllPathsAsString = (
  m: number,
  n: number,
  bc: string[],
  i: number = 0,
  j: number = 0,
  pathStr: string = '',
  memo = {}
): string => {
  const cId = `${i},${j}`;

  if (i > m - 1 || j > n - 1) return '';

  if (bc.indexOf(cId) !== -1) return '';

  iterations++;

  if (i === m - 1 && j === n - 1) {
    return PATH_DELIMITER + pathStr + cId;
  }

  pathStr = pathStr + cId + CELL_DELIMITER;

  let result = '';
  if (cId in memo && MemoizeResults) {
    result = memo[cId].replace(/::/g, PATH_DELIMITER + pathStr);
  } else {
    result =
      _findAllPathsAsString(m, n, bc, i + 1, j, pathStr, memo) +
      _findAllPathsAsString(m, n, bc, i + 1, j + 1, pathStr, memo) +
      _findAllPathsAsString(m, n, bc, i, j + 1, pathStr, memo);
    if (MemoizeResults) {
      memo[cId] = result.split(pathStr).join('');
    }
  }

  return result;
};

const _findAllPaths = (m: number, n: number, bc: string[]) => {
  return _findAllPathsAsString(m, n, bc)
    .split(PATH_DELIMITER)
    .filter((p) => p !== '')
    .map((pathString) => pathString.split(CELL_DELIMITER));
};

const _findShortPath = (m: number, n: number, bc: string[]): string[] => {
  let shortPath = [],
    shortPathLength = -1;
  const allPaths = _findAllPaths(m, n, bc);
  // console.log(allPaths);
  allPaths.forEach((path) => {
    if (path.length < shortPathLength || shortPathLength === -1) {
      shortPathLength = path.length;
      shortPath = path.slice();
    }
  });
  return shortPath;
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
    const shortPath = _findShortPath(m, n, blockedCells);
    const endTime = window.performance ? window.performance.now() : Date.now();
    console.log(endTime, startTime);
    if (shortPath.length === 0) {
      alert(`No Path Found between [${startCell}] and [${endCell}]!`);
    } else {
      animatePath(shortPath.slice());
    }
    setDataPoints([
      {
        label: 'Memoization',
        value: MemoizeResults ? 'enabled' : 'disabled',
      },
      { label: 'Iterations', value: iterations },
      { label: 'Steps in path', value: shortPath.length },
      {
        label: 'Time',
        // value: (endTime - startTime),
        value: Math.round((endTime - startTime) * 1000) / 1000 + 'ms',
      },
    ]);
  }, [m, n, blockedCells]);

  return [currentCell, pathCells, resetPath, findShortPath, dataPoints];
}
