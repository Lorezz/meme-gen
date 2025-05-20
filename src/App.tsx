import React from "react";
import Canvas from "./components/Canvas.tsx";
function App() {
  const [uploadedImage, setUploadedImage] =
    React.useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = React.useState<string>("");
  const [bottomText, setBottomText] = React.useState<string>("");
  const [width, setWidth] = React.useState<number>(300);
  const [height, setHeight] = React.useState<number>(300);
  const [downloadTrigger, setDownloadTrigger] = React.useState<string>("");

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

  // Draw image and text on canvas

  function draw(ctx: CanvasRenderingContext2D) {
    // Clear canvas and set canvas dimensions to fit the image
    ctx.clearRect(0, 0, width, height);
    if (uploadedImage) ctx.drawImage(uploadedImage, 0, 0, width, height);

    // Set text styles
    ctx.font = "30px Impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    if (topText) {
      // Draw top text
      ctx.fillText(topText, width / 2, 50);
      ctx.strokeText(topText, width / 2, 50);
    }
    if (bottomText) {
      // Draw bottom text
      ctx.fillText(bottomText, width / 2, height - 20);
      ctx.strokeText(bottomText, width / 2, height - 20);
    }
  }

  function downloadMeme() {
    setDownloadTrigger(`meme-${Date.now()}.png`);
  }

  return (
    <div
      className='p-10 flex gap-4s flex-col justify-center
      items-center'
    >
      <div className='flex gap-4 flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center'>
          <label className='label'>Upload image</label>
          <input
            className='file-input'
            type='file'
            accept='image/jpg,image/png,image/webp'
            onChange={(e) => handleUpload(e)}
          />
        </div>
        {uploadedImage && (
          <>
            <div>
              <label className='label'>Top Text</label>
              <input
                className='input'
                type='text'
                onChange={(e) => setTopText(e.target.value)}
              />
            </div>
            <div>
              <label className='label'>Bottom Text</label>
              <input
                className='input'
                type='text'
                onChange={(e) => setBottomText(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      <div className='py-10'>
        <p>
          pic size:{width}x{height}
        </p>
        <Canvas
          draw={draw}
          width={width}
          height={height}
          downloadTrigger={downloadTrigger}
        />
      </div>
      <div>
        {uploadedImage && (
          <div>
            <button
              className='btn btn-primary uppercase'
              onClick={() => downloadMeme()}
            >
              download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
