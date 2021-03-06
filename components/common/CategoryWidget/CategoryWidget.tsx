import { FC } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import { Motion } from "react-motion";
import useWindowDimensions from "lib/hooks/useWindowDimensions";
import Fade from "react-reveal/Fade";
import Image from "next/image";
import Link from "next/link";

interface Props {
  image: string;
  direction: "left" | "right";
  path: string;
}

const CategoryWidget: FC<Props> = ({ image, direction, path }) => {
  const scrollY: number = useScrollPosition(60);
  const { width, height } = useWindowDimensions();

  let ogFont = 5;
  let scrollW = 0;
  if (width >= 900) {
    ogFont = 9;
    scrollW = -scrollW;
  }
  if (width >= 1250) {
    ogFont = 7;
  }
  if (width >= 1920) {
    ogFont = 8;
    scrollW = 50;
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
              <div className="flex flex-col justify-center">
                <Link href={path}>
                  <a>
                    <h2 className="text-3xl bg-violet">Shop</h2>
                    <h1
                      className={`text-${ogFont}xl bg-violet border uppercase`}
                    >
                      Prima <br /> Collection
                    </h1>
                  </a>
                </Link>
              </div>
            )}
            <div style={{ position: "relative", left: left }}>
              <Link href={path}>
                <div className="cursor-pointer">
                  <div className="w-full h-full absolute opacity-20 pointer-events-none z-10">
                    <Image src="/dc-distressed-bg-1.jpg" layout="fill" />
                  </div>
                  <Image
                    src={image}
                    width="800px"
                    height="529.8px"
                    layout="intrinsic"
                  />
                </div>
              </Link>
            </div>
            {direction === "left" && (
              <div className="flex flex-col justify-center">
                <Link href={path}>
                  <a>
                    <h2 className="text-3xl bg-violet">Shop</h2>
                    <h1
                      className={`text-${ogFont}xl bg-violet border uppercase`}
                    >
                      New &nbsp; In
                    </h1>
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}
      </Motion>
    </Fade>
  );
};

export default CategoryWidget;
