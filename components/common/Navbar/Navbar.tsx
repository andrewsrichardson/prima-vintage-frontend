import { FC } from "react";
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
            <nav className={s.linkWrapper + "mr-12 md:ml-0 md:mr-0"}>
              <div className={"hover-link md:inline-block"}>
                <Link href="/search">
                  <a className={s.borderleft + " " + s.link}>ALL</a>
                </Link>
              </div>
              <div className={"hover-link hidden lg:inline-block"}>
                <Link href="/search?sort=latest-desc">
                  <a className={s.link}>NEW IN</a>
                </Link>
              </div>
              <div className="hover-link hidden lg:inline-block">
                <Link href="/search/sale">
                  <a className={s.link}>SALE</a>
                </Link>
              </div>
              <div className="hover-link hidden md:inline-block bg-gray-100">
                <Link href="/search/prima-collection">
                  <a className={s.link}>PRIMA COLLECTION</a>
                </Link>
              </div>
            </nav>
          </div>

          <Title moving={moving} />
          <div className="justify-center lg:flex">
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
