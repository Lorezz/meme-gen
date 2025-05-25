import React from "react";
import Canvas from "./components/Canvas.tsx";
import ChooseMeme from "./components/ChooseMeme.tsx";
function App() {
  const [uploadedImage, setUploadedImage] =
    React.useState<HTMLImageElement | null>(null);
  const [text, setText] = React.useState<string>("");
  const [newText, setNewText] = React.useState<string>("");

  const [width, setWidth] = React.useState<number>(300);
  const [height, setHeight] = React.useState<number>(300);
  const [downloadTrigger, setDownloadTrigger] = React.useState<string>("");
  const [resetTrigger, setResetTrigger] = React.useState<number>(0);

  // Load the image onto the canvas
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e?.target?.result as string;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setUploadedImage(img);
      };
    };
    reader.readAsDataURL(file!);
  }
  function addNewText() {
    setNewText(text);
    setText("");
  }
  function downloadMeme() {
    setDownloadTrigger(`meme-${Date.now()}.png`);
  }

  return (
    <div
      className='p-10 flex gap-4 flex-col justify-center
      items-center'
    >
      <div className='flex gap-4 flex-col  justify-center items-center'>
        <div className='flex  gap-4  flex-row justify-center items-center'>
          <label className='label'>Upload image</label>
          <input
            className='file-input'
            type='file'
            accept='image/jpg,image/png,image/webp'
            onChange={(e) => handleUpload(e)}
          />
        </div>
        <div>
          <ChooseMeme handleSelect={(item) => console.log(item)} />
        </div>
        {uploadedImage && (
          <div className='pt-5 flex gap-4  flex-row justify-center items-center'>
            <label className='label'>Text</label>
            <input
              className='input'
              value={text}
              type='text'
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className='btn btn-sm uppercase'
              onClick={() => addNewText()}
            >
              add text
            </button>
          </div>
        )}
      </div>
      <div className='pt-5'>
        {uploadedImage && (
          <div className='flex gap-4'>
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
        )}
      </div>
      <div className='pt-5'>
        <p>
          pic size:{width}x{height}
        </p>
        <Canvas
          image={uploadedImage}
          newText={newText}
          width={width}
          height={height}
          resetTrigger={resetTrigger}
          downloadTrigger={downloadTrigger}
        />
      </div>
    </div>
  );
}

export default App;
