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
  const colour = hasScrolled
    ? "bg-white"
    : router.asPath === "/"
    ? "bg-violet"
    : "bg-white";

  return (
    <div
      // style={{ backgroundColor: hasScrolled ? "white" : "--violet" }}
      className={cn(s.root, colour, "textured", {
        "shadow-magical": hasScrolled,
      })}
    >
      {children}
    </div>
  );
};

export default NavbarRoot;
