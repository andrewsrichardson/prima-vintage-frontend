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

  let ogFont = 4;
  let topGoal = -400;
  let baseTop = 190;

  const scrollMax = 250;
  let scaleTo = 0.2;
  if (width >= 768) {
    ogFont = 9;
    topGoal = -390;
    scaleTo = 0.15;
  }
  if (width >= 1250) {
    topGoal = -250;
    ogFont = 10;
    scaleTo = 0.2;
    baseTop = 50;
  }
  if (width >= 1920) {
    ogFont = 15;
    topGoal = -300;
    scaleTo = 0.15;
    baseTop = 100;
  }
  const percent = scrollY / scrollMax;
  return (
    <div
      className="faded"
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
        {({ top, scale }: { top: number; scale: number }) => {
          return (
            <h1
              style={{
                position: "relative",
                top: top,
                fontSize: `${ogFont}rem`,
                transform: `scale(${scale})`,
                fontFamily: "--var(font-heading)",
                textShadow: "3px 2px 20px #D4D4D4",
                lineHeight: "15rem",
                overflow: "hidden",
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
