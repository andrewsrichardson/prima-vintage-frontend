import { FC, useEffect } from "react";
import Link from "next/link";
import { Logo, Container } from "@components/ui";
import { Searchbar, UserNav, Title } from "@components/common";
import NavbarRoot from "./NavbarRoot";
import s from "./Navbar.module.css";
import { useRouter } from "next/router";

const Navbar: FC = () => {
  const router = useRouter();
  const moving = router.asPath === "/" ? true : false;
  return (
    <NavbarRoot>
      <Container>
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6 ">
          <div className="flex items-center flex-1">
            <div className="lg:hidden">
              <Link href="/search">
                <a className={s.link + " text-sm max-w-xs underline-dotted"}>
                  PRODUCTS
                </a>
              </Link>
            </div>
            <nav className="hidden ml-6 space-x-8 lg:block">
              <div className={s.linkWrapper}>
                <Link href="/search">
                  <a className={s.link}>ALL</a>
                </Link>
                {/* <div className={s.dropdownWrapper + " textured"}>
                  <h1>test</h1>
                </div> */}
              </div>

              <a className={"hover-link" + " " + s.linkAll}>
                <Link href="/search?sort=latest-desc">
                  <a className="text-link">NEW IN</a>
                </Link>
              </a>
              <a className="hover-link">
                <Link href="/search/sale">
                  <a className="text-link">SALE</a>
                </Link>
              </a>

              <a className="hover-link">
                <Link href="/search/prima-collection">
                  <a className="text-link">PRIMA COLLECTION</a>
                </Link>
              </a>
            </nav>
          </div>

          <Title moving={moving} />
          <div className="justify-center flex-1 lg:flex">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
          </div>

          <div className="flex justify-end flex-1 space-x-8">
            <div className="hidden lg:inline">
              <Searchbar />
            </div>
            <UserNav />
          </div>
        </div>

        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      </Container>
    </NavbarRoot>
  );
};

export default Navbar;
