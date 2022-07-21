import * as React from 'react';

let iterations = 0;

const _findAllPaths = (
  m: number,
  n: number,
  bc: string[],
  i: number = 0,
  j: number = 0,
  pathStr: string = '',
  pathArr: string[][] = []
) => {
  const cId = `${i},${j}`;

  if (i > m - 1 || j > n - 1) return [];

  iterations++;

  if (i === m - 1 && j === n - 1) {
    pathStr = pathStr + cId;
    pathArr.push(pathStr.split('|'));
    return pathArr;
  }

  pathStr = pathStr + cId + '|';

  _findAllPaths(m, n, bc, i + 1, j, pathStr, pathArr);
  _findAllPaths(m, n, bc, i + 1, j + 1, pathStr, pathArr);
  _findAllPaths(m, n, bc, i, j + 1, pathStr, pathArr);

  return pathArr;
};

export default function useFindPath(
  m: number,
  n: number,
  blockedCells: string[]
): [string, string[], () => void, () => void] {
  const [currentCell, setCurrentCell] = React.useState<string>('');
  const [pathCells, setPathCells] = React.useState<string[]>([]);

  const resetPath = React.useCallback(() => {
    setPathCells([]);
    setCurrentCell('');
  }, []);

  React.useEffect(() => {
    resetPath();
  }, [m, n]);

  const findShortPath = React.useCallback(() => {
    const startCell = '0,0';
    const endCell = `${m - 1},${n - 1}`;
    resetPath();
    setCurrentCell(startCell);
    iterations = 0;
    console.log(_findAllPaths(m, n, blockedCells), iterations);
  }, [m, n, blockedCells]);

  return [currentCell, pathCells, resetPath, findShortPath];
}
