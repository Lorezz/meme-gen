import { useEffect, useState } from "react";

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
};

export default function ChooseMeme({ handleSelect }: ChooseMemeProps) {
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
    <div className='w-[80vw] h-[200px] bg-base-300 overflow-auto'>
      {images?.map((img) => (
        <span
          key={img.id}
          style={{ width: 200, height: 150 }}
          onClick={() => handleSelect(img)}
        >
          <img
            src={img.url}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            alt={img.name}
            title={img.name}
          />
        </span>
      ))}
    </div>
  );
}
