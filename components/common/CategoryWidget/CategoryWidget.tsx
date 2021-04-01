import { FC } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import { Motion } from "react-motion";
import useWindowDimensions from "lib/hooks/useWindowDimensions";
import Fade from "react-reveal/Fade";
import Image from "next/image";

interface Props {
  image: string;
  direction: "left" | "right";
}

const CategoryWidget: FC<Props> = ({ image, direction }) => {
  const scrollY: number = useScrollPosition(60);
  const { width, height } = useWindowDimensions();

  let ogFont = 5;
  let scrollW = -10;
  if (width >= 900) {
    ogFont = 10;
  }
  if (width >= 1250) {
    ogFont = 7;
  }
  if (width >= 1920) {
    ogFont = 8;
    scrollW = 100;
  }
  const percent = scrollY / height;
  return (
    <Fade bottom>
      <Motion
        style={{
          left: direction === "left" ? -scrollW * percent : scrollW * percent,
        }}
      >
        {({ left }) => (
          <div className="flex flex-col md:flex-row">
            {direction === "right" && (
              <div className="flex flex-col justify-center cursor-pointer">
                <h1 className="text-3xl bg-violet">Shop</h1>
                <h1 className={`text-${ogFont}xl bg-violet border`}>Womens</h1>
              </div>
            )}
            <div style={{ position: "relative", left: left }}>
              <Image src={image} width="400px" height="600px" />
            </div>
            {direction === "left" && (
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl bg-violet">Shop</h1>
                <h1 className={`text-${ogFont}xl bg-violet border`}>Mens</h1>
              </div>
            )}
          </div>
        )}
      </Motion>
    </Fade>
  );
};

export default CategoryWidget;
