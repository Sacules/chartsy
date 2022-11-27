import { useState, useEffect } from "react";

export const useMountTransition = (
  isMounted: boolean,
  unmountDelay: number
) => {
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isMounted && !hasTransitionedIn) {
      setHasTransitionedIn(true);
    } else if (!isMounted && hasTransitionedIn) {
      timeoutId = window.setTimeout(
        () => setHasTransitionedIn(false),
        unmountDelay
      );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmountDelay, isMounted, hasTransitionedIn]);

  return hasTransitionedIn;
};
