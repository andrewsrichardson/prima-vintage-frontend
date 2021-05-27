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

  const style = variant === "primary" ? "textured" : "checked bg-violet";
  const height = variant === "primary" ? 70 : null;

  return (
    <div className={style}>
      <Ticker height={height} offset={80}>
        {() => (
          <div
            className={s.container}
            style={{ minHeight: variant === "secondary" ? "320px" : null }}
          >
            {children}
          </div>
        )}
      </Ticker>
    </div>
  );
};

export default Marquee;
