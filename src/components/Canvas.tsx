import React, { useEffect } from "react";

type CanvasProps = {
  draw: (context: CanvasRenderingContext2D) => void;
  height: number;
  width: number;
  downloadTrigger: string;
};
export default function Canvas({
  draw,
  height,
  width,
  downloadTrigger,
}: CanvasProps) {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (downloadTrigger) {
      const link = document.createElement("a");
      link.download = downloadTrigger;
      link.href = canvas.current!.toDataURL("image/png");
      link.click();
    }
  }, [downloadTrigger]);

  function resizeCanvas(c: HTMLCanvasElement) {
    const { width, height } = c.getBoundingClientRect();

    if (c.width !== width || c.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      const context = c.getContext("2d");
      c.width = width * ratio;
      c.height = height * ratio;
      context!.scale(ratio, ratio);
      return true;
    }

    return false;
  }

  React.useEffect(() => {
    if (!canvas.current) return;
    const context = canvas.current!.getContext("2d");
    resizeCanvas(canvas.current);
    draw(context!);
  });

  return (
    <canvas
      className='bg-base-300'
      ref={canvas}
      height={height}
      width={width}
    />
  );
}
