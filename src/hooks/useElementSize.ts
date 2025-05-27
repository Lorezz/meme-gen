import { useState, useEffect, useRef } from "react";

export type ReturnType = [
  {
    width: number;
    height: number;
  },
  React.RefObject<HTMLDivElement | null>
];

export default function useElementSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: ref?.current?.offsetWidth ?? 0,
        height: ref?.current?.offsetHeight ?? 0,
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return [size, ref] as ReturnType;
}
