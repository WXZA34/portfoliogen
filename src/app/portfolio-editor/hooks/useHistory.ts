import { useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useHistory<T>(initialState: T) {
  const [state, setHistoryState] = useState({
    history: [initialState],
    index: 0
  });

  const currentState = state.history[state.index];

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistoryState(prev => {
      const resolved = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.history[prev.index])
        : newState;
        
      const newHistory = prev.history.slice(0, prev.index + 1);
      newHistory.push(resolved);
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return { history: newHistory, index: newHistory.length - 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setHistoryState(prev => ({ ...prev, index: Math.max(0, prev.index - 1) }));
  }, []);

  const redo = useCallback(() => {
    setHistoryState(prev => ({ ...prev, index: Math.min(prev.history.length - 1, prev.index + 1) }));
  }, []);

  const canUndo = state.index > 0;
  const canRedo = state.index < state.history.length - 1;

  return { state: currentState, setState, undo, redo, canUndo, canRedo };
}
