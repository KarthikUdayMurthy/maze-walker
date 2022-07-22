import * as React from 'react';
import SpinButton from './SpinButton';

export interface IControlsProps {
  m: number;
  n: number;
  setM: React.Dispatch<React.SetStateAction<number>>;
  setN: React.Dispatch<React.SetStateAction<number>>;
}

const Controls = React.memo<IControlsProps>(({ m, n, setM, setN }) => {
  return (
    <div className="controls-wrap scrollWrap">
      <SpinButton label="Rows" val={m} seVal={setM} min={1} max={9} />
      <SpinButton label="Cols" val={n} seVal={setN} min={1} max={9} />
    </div>
  );
});

export default Controls;
