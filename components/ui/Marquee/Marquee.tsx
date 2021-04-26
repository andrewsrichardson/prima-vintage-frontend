import cn from "classnames";
import s from "./Marquee.module.css";
import { FC, ReactNode, Component } from "react";
import Ticker from "react-ticker";

interface Props {
  className?: string;
  children?: ReactNode[] | Component[] | any[];
  variant?: "primary" | "secondary";
}

const Marquee: FC<Props> = ({
  className = "",
  children,
  variant = "primary",
}) => {
  const rootClassName = cn(
    s.root,
    {
      [s.primary]: variant === "primary",
      [s.secondary]: variant === "secondary",
    },
    className
  );

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(45deg, #38559C 25%, transparent 25%), linear-gradient(-45deg, #38559C 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #38559C 75%), linear-gradient(-45deg, transparent 75%, #38559C 75%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      }}
      className="bg-violet"
    >
      <Ticker offset={80}>
        {() => <div className={s.container}>{children}</div>}
      </Ticker>
    </div>
  );
};

export default Marquee;
