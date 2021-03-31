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
  const { height } = useWindowDimensions();

  // let ogFont = 5;
  // let topGoal = -280;
  // let baseTop = 200;

  // const scrollMax = 250;
  // let scaleTo = 0.2;
  // if (width >= 900) {
  //   ogFont = 10;
  //   topGoal = -400;
  //   scaleTo = 0.13;
  // }
  // if (width >= 1250) {
  //   topGoal = -340;
  //   ogFont = 15;
  //   scaleTo = 0.1;
  //   baseTop = 20;
  // }
  // if (width >= 1920) {
  //   ogFont = 20;
  //   topGoal = -440;
  //   scaleTo = 0.1;
  //   baseTop = 5;
  // }
  const percent = scrollY / height;
  return (
    <Fade bottom>
      <Motion
        style={{
          left: direction === "left" ? -100 * percent : 100 * percent,
        }}
      >
        {({ left }) => (
          <div
            style={{
              display: "flex",
            }}
          >
            {direction === "right" && (
              <div className="flex flex-col justify-center cursor-pointer">
                <h1 className="text-3xl bg-violet">Shop</h1>
                <h1 className="text-8xl bg-violet border">Womens</h1>
              </div>
            )}
            <div style={{ position: "relative", left: left }}>
              <Image src={image} width="400px" height="600px" />
            </div>
            {direction === "left" && (
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl bg-violet">Shop</h1>
                <h1 className="text-8xl bg-violet border">Mens</h1>
              </div>
            )}
          </div>
        )}
      </Motion>
    </Fade>
  );
};

export default CategoryWidget;
