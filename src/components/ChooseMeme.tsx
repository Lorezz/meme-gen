import { useEffect, useState } from "react";
import "../styles/gallery.css";

export type MemeResult = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions: number;
};
export type ChooseMemeProps = {
  handleSelect: (item: MemeResult) => void;
  selected?: MemeResult;
};

export default function ChooseMeme({
  handleSelect,
  selected,
}: ChooseMemeProps) {
  const [images, setImages] = useState<MemeResult[]>([]);

  async function fetchMemeSourceImages() {
    const response = await fetch("https://api.imgflip.com/get_memes");
    const json = await response.json();
    setImages(json.data.memes);
  }

  useEffect(() => {
    fetchMemeSourceImages();
  }, []);

  return (
    // <div className='block bg-base-300 m-4 p-5 w-[800px] h-[200px] overflow-hidden'>
    //   <div style={{ overflow: "auto", width: "100%", height: "100%" }}>
    <div className='image-container'>
      <div className='scrollable-images'>
        {images?.map((img) => (
          <img
            key={img.id}
            onClick={() => handleSelect(img)}
            className={`${
              selected?.id === img.id ? "border-2 border-primary" : ""
            }`}
            src={img.url}
            style={{
              display: "inline-block",
              width: 200,
              height: 150,
              objectFit: "cover",
            }}
            alt={img.name}
            title={img.name}
          />
        ))}
      </div>
    </div>
  );
}
