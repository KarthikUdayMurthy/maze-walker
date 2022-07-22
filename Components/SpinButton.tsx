import * as React from 'react';

export interface ISpinButtonProps {
  label: string;
  val: number;
  seVal: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}

const SpinButton = React.memo<ISpinButtonProps>(
  ({ label, val, seVal, min, max }) => {
    return (
      <label>
        {label}
        <div className="spin-btn-wrap">
          <div
            className="spin-btn"
            onClick={() => {
              seVal((x) => {
                return x === min ? min : x - 1;
              });
            }}
          >
            -
          </div>
          <div className="spin-btn-value">{val}</div>
          <div
            className="spin-btn"
            onClick={() => {
              seVal((x) => {
                return x === max ? max : x + 1;
              });
            }}
          >
            +
          </div>
        </div>
      </label>
    );
  }
);

export default SpinButton;
