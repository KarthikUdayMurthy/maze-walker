import * as React from 'react';

export interface IControlsProps {
  m: number;
  n: number;
  setM: React.Dispatch<React.SetStateAction<number>>;
  setN: React.Dispatch<React.SetStateAction<number>>;
}

const Controls = React.memo<IControlsProps>(({ m, n, setM, setN }) => {
  return (
    <div className="controls-wrap scrollWrap">
      <label>
        Rows
        <input
          type="number"
          value={m}
          min={1}
          max={9}
          onChange={(e) => {
            setM(Number(e.target.value));
          }}
          tabIndex={0}
        />
      </label>
      <label>
        Cols
        <input
          type="number"
          value={n}
          min={1}
          max={9}
          onChange={(e) => {
            setN(Number(e.target.value));
          }}
          tabIndex={1}
        />
      </label>
    </div>
  );
});

export default Controls;
