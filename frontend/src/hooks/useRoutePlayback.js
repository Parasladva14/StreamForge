import { useEffect } from "react";

export default function useRoutePlayback(
  playing,
  route,
  index,
  setIndex,
  setPlaying
) {
  useEffect(() => {
    if (!playing || !route || route.length === 0) return;

    const timer = setInterval(() => {
      setIndex((previous) => {
        if (previous >= route.length - 1) {
          if (setPlaying) setPlaying(false);
          return previous;
        }
        return previous + 1;
      });
    }, 750);

    return () => clearInterval(timer);
  }, [playing, route, setIndex, setPlaying]);
}