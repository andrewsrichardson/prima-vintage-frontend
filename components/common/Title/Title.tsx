import { FC } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import { Motion } from "react-motion";
import useWindowDimensions from "lib/hooks/useWindowDimensions";

interface Props {
  moving: boolean;
}

const Title: FC<Props> = ({ moving }) => {
  const scrollY: number = useScrollPosition(60);
  const { width } = useWindowDimensions();

  let ogFont = 5;
  let topGoal = -280;
  let baseTop = 200;

  const scrollMax = 250;
  let scaleTo = 0.2;
  if (width >= 900) {
    ogFont = 10;
    topGoal = -400;
    scaleTo = 0.13;
  }
  if (width >= 1250) {
    topGoal = -340;
    ogFont = 15;
    scaleTo = 0.1;
    baseTop = 20;
  }
  if (width >= 1920) {
    ogFont = 20;
    topGoal = -440;
    scaleTo = 0.1;
    baseTop = 5;
  }
  const percent = scrollY / scrollMax;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        textAlign: "center",
        top: baseTop,
        pointerEvents: "none",
      }}
    >
      <Motion
        defaultStyle={{ y: 0, x1: 0, scale: 1 }}
        style={{
          top: scrollY < scrollMax && moving ? topGoal * percent : topGoal,
          scale:
            scrollY < scrollMax && moving ? 1 - percent + scaleTo : scaleTo,
        }}
      >
        {({
          top,
          x2,
          scale,
          y1,
        }: {
          top: number;
          x2: number;
          y1: number;
          scale: number;
        }) => {
          return (
            <h1
              style={{
                position: "relative",
                top: top,
                fontSize: `${ogFont}rem`,
                transform: `scale(${scale})`,
              }}
            >
              <span
                style={{
                  display: "block",
                }}
              >
                PRIMA
              </span>
              <span
                style={{
                  display: "block",
                }}
              >
                VINTAGE
              </span>
            </h1>
          );
        }}
      </Motion>
    </div>
  );
};

export default Title;
