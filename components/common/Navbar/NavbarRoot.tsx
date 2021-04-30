import { FC, useState, useEffect } from "react";
import throttle from "lodash.throttle";
import cn from "classnames";
import s from "./Navbar.module.css";
import { useRouter } from "next/router";

const NavbarRoot: FC = ({ children }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const offset = 0;
      const { scrollTop } = document.documentElement;
      const scrolled = scrollTop > offset;

      if (hasScrolled !== scrolled) {
        setHasScrolled(scrolled);
      }
    }, 200);

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolled]);
  const router = useRouter();
  const colour = "bg-violet";

  return (
    <div
      className={cn(s.root, colour, "textured", {
        "shadow-magical": hasScrolled,
      })}
      style={{ borderBottom: "2px solid #38559c" }}
    >
      {children}
    </div>
  );
};

export default NavbarRoot;
