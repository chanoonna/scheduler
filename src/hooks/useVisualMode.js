import { useState } from 'react';

export default function useVisualMode(initial, replace) {
  const [ mode, setMode ] = useState(initial);
  const [ history, setHistory ] = useState([initial]);

  const transition = function(mode, replace = false) {
    let popped = history;
    replace && (popped = history.slice(0, -1));

    setMode(mode);
    setHistory([...popped, mode]);
  };

  const back = function() {
    if (history.length <= 1) {
      return;
    }
    const popped = history.slice(0, -1);
    setHistory([...popped]);
    setMode(popped.slice(-1)[0]);
  };

  return { mode, transition, back };
};