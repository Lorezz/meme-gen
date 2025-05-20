import { useEffect, useState, useRef } from "react";

type CanvasProps = {
  image: CanvasImageSource | null;
  height: number;
  width: number;
  downloadTrigger: string;
  resetTrigger: number;
  newText: string;
};

type TextProps = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function Canvas({
  image,
  height,
  width,
  downloadTrigger,
  resetTrigger,
  newText,
}: CanvasProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [texts, setTexts] = useState<TextProps[]>([]);
  const [selectedText, setSelectedText] = useState(-1);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!canvas.current) return;
    resizeCanvas(canvas.current);
    checkOffsets(canvas.current);
    draw();
  });

  useEffect(() => {
    if (!ctx && canvas.current) {
      const context = canvas.current!.getContext("2d");
      setCtx(context);
    }
  }, [ctx, canvas]);

  useEffect(() => {
    if (downloadTrigger) {
      const link = document.createElement("a");
      link.download = downloadTrigger;
      link.href = canvas.current!.toDataURL("image/png");
      link.click();
    }
  }, [downloadTrigger]);

  useEffect(() => {
    setTexts([]);
  }, [resetTrigger, image]);

  useEffect(() => {
    if (!newText || !canvas.current) return;

    // const ctx = canvas.current!.getContext("2d");
    ctx!.font = "50px Impact";
    ctx!.fillStyle = "white";
    ctx!.strokeStyle = "black";
    ctx!.lineWidth = 2;
    ctx!.textAlign = "center";
    const width = ctx!.measureText(newText).width * 2;
    const height = 50;
    const text = {
      text: newText,
      x: 100,
      y: texts.length * 50 + 50,
      width,
      height,
    };
    setTexts((prev) => {
      return [...prev, text];
    });
  }, [newText]);

  function checkOffsets(c: HTMLCanvasElement) {
    if (c.offsetLeft - offset.x != 0 || c.offsetTop - offset.y != 0) {
      setOffset({
        x: c.offsetLeft,
        y: c.offsetTop,
      });
    }
  }

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

  function draw() {
    // Clear canvas and set canvas dimensions to fit the image
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (image) ctx.drawImage(image, 0, 0, width, height);

    // Set text styles
    // ctx.font = "30px Impact";
    // ctx.fillStyle = "white";
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.textAlign = "center";

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      ctx.fillText(text.text, text.x, text.y);
      ctx.strokeText(text.text, text.x, text.y);
    }
  }

  // test if x,y is inside the bounding box of texts[textIndex]
  function textHittest(x: number, y: number, textIndex: number) {
    const text = texts[textIndex];
    return (
      x >= text.x &&
      x <= text.x + text.width &&
      y >= text.y - text.height &&
      y <= text.y
    );
  }

  // handle mousedown events
  // iterate through texts[] and see if the user
  // mousedown'ed on one of them
  // If yes, set the selectedText to the index of that text
  function handleMouseDown(e) {
    e.preventDefault();
    const startValue = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    setStart(startValue);
    // Put your mousedown stuff here
    for (let i = 0; i < texts.length; i++) {
      if (textHittest(startValue.x, startValue.y, i)) {
        setSelectedText(i);
      }
    }
  }

  // done dragging
  function handleMouseUp(e) {
    e.preventDefault();
    setSelectedText(-1);
  }

  // also done dragging
  function handleMouseOut(e) {
    e.preventDefault();
    setSelectedText(-1);
  }

  // handle mousemove events
  // calc how far the mouse has been dragged since
  // the last mousemove event and move the selected text
  // by that distance
  function handleMouseMove(e) {
    if (selectedText < 0) {
      return;
    }
    e.preventDefault();
    const mouseX = e.clientX - offset.x;
    const mouseY = e.clientY - offset.y;

    // Put your mousemove stuff here
    const dx = mouseX - start.x;
    const dy = mouseY - start.y;
    setStart({ x: mouseX, y: mouseY });
    const text = texts[selectedText];
    text.x += dx;
    text.y += dy;
    // draw();
  }

  return (
    <canvas
      className='bg-base-300'
      ref={canvas}
      height={height}
      width={width}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseOut={(e) => handleMouseOut(e)}
      onMouseMove={(e) => handleMouseMove(e)}
    />
  );
}
