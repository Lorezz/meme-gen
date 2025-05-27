import React, { useEffect } from "react";
import Canvas from "./components/Canvas.tsx";
import ChooseMeme, { type MemeResult } from "./components/ChooseMeme.tsx";
import useElementSize, { type ReturnType } from "./hooks/useElementSize.ts";

function App() {
  const [uploadedImage, setUploadedImage] =
    React.useState<HTMLImageElement | null>(null);
  const [text, setText] = React.useState<string>("");
  const [newText, setNewText] = React.useState<string>("");

  const [fontSize, setFontsize] = React.useState<number>(30);
  const [width, setWidth] = React.useState<number>(800);
  const [height, setHeight] = React.useState<number>(600);
  const [downloadTrigger, setDownloadTrigger] = React.useState<string>("");
  const [resetTrigger, setResetTrigger] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<MemeResult | undefined>(
    undefined
  );
  const [size, ref]: ReturnType = useElementSize();

  function getRatio(imgWidth: number, imgHeight: number) {
    const ctxWidth = size.width,
      ctxHeight = size.height;

    const ratioWidth = imgWidth / ctxWidth,
      ratioHeight = imgHeight / ctxHeight;

    const ratioAspect = ratioHeight < ratioWidth ? ratioWidth : ratioHeight;

    const newWidth = imgWidth / ratioAspect,
      newHeight = imgHeight / ratioAspect;

    setWidth(newWidth);
    setHeight(newHeight);

    return [newWidth, newHeight];
  }

  // Load the image onto the canvas
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e?.target?.result as string;
      const img = new Image(size.width, size.height);
      img.src = dataUrl;
      img.onload = () => {
        const [w, h] = getRatio(img.width, img.height);
        const pic = new Image(w, h);
        pic.src = dataUrl;
        setUploadedImage(pic);
        setResetTrigger((p) => p + 1);
      };
    };
    reader.readAsDataURL(file!);
    setSelected(undefined);
  }

  useEffect(() => {
    setWidth(size.width);
    setHeight(size.height);
  }, [size.width, size.height]);

  async function chooseImage(item: MemeResult) {
    const response = await fetch(item.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    const [w, h] = getRatio(item.width, item.height);
    const img = new Image(w, h);
    img.src = imageObjectURL;
    img.onload = () => {
      setUploadedImage(img);
    };
    setSelected(item);
    setResetTrigger((p) => p + 1);
  }

  function addNewText() {
    setNewText(text);
    setText("");
  }

  function downloadMeme() {
    setDownloadTrigger(`meme-${Date.now()}.png`);
  }

  return (
    <div className='p-10'>
      <div className=''>
        <ChooseMeme
          handleSelect={(item) => chooseImage(item)}
          selected={selected}
        />
      </div>
      <div className='flex gap-4 flex-col  justify-center items-center '>
        <div className='flex  gap-4  flex-row justify-center items-center'>
          <label className='label'>Upload image</label>
          <input
            className='file-input'
            type='file'
            accept='image/jpg,image/png,image/webp'
            onChange={(e) => handleUpload(e)}
          />
        </div>
        <div className='flex gap-4 flex-row justify-center items-center'>
          <label className='label'>Font Size</label>
          <input
            type='range'
            min={15}
            max={100}
            value={fontSize}
            className='range'
            onChange={(e) => setFontsize(parseInt(e.target.value))}
          />
          {fontSize}
        </div>
        <div className='flex gap-4 flex-row justify-center items-center'>
          <label className='label'>Text</label>
          <input
            className='input'
            value={text}
            type='text'
            onChange={(e) => setText(e.target.value)}
          />

          <button className='btn btn-sm uppercase' onClick={() => addNewText()}>
            add text
          </button>
        </div>
      </div>
      <div className='py-5'>
        <div className='flex gap-4 justify-center items-center'>
          <button
            className='btn  uppercase'
            onClick={() => setResetTrigger((c) => c + 1)}
          >
            reset
          </button>
          <button
            className='btn btn-primary uppercase'
            onClick={() => downloadMeme()}
          >
            download
          </button>
        </div>
      </div>

      <div className='  flex w-full items-center justify-center'>
        <div
          ref={ref}
          className='bg-base-100'
          style={{
            width: 800,
            height: 600,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <center>
            <Canvas
              fontSize={fontSize}
              image={uploadedImage}
              newText={newText}
              width={width}
              height={height}
              resetTrigger={resetTrigger}
              downloadTrigger={downloadTrigger}
            />
          </center>
        </div>
      </div>
    </div>
  );
}

export default App;
