import { FC, useEffect } from "react";
import Link from "next/link";
import { Logo, Container } from "@components/ui";
import { Searchbar, UserNav, Title } from "@components/common";
import NavbarRoot from "./NavbarRoot";
import s from "./Navbar.module.css";
import { useRouter } from "next/router";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { getConfig } from "@framework/api";
import getSiteInfo from "@framework/common/get-site-info";
import useSWR from "swr";
import getAllCollections from "@framework/product/get-all-collections";

const Navbar: FC = () => {
  const router = useRouter();
  const moving = router.asPath === "/" ? true : false;
  // const config = getConfig()
  // const data = getAllCollections();
  // console.log(data);
  return (
    <NavbarRoot>
      <Container>
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6 ">
          <div className="flex items-center flex-1">
            <nav className="hidden ml-6 space-x-8 lg:block">
              <div className={s.linkWrapper}>
                <Link href="/search">
                  <a className={s.link}>All</a>
                </Link>
                {/* <div className={s.dropdownWrapper + " textured"}>
                  <h1>test</h1>
                </div> */}
              </div>

              <a className={"hover-link" + " " + s.linkAll}>
                <Link href="/search?sort=latest-desc">
                  <a className="text-link">New In</a>
                </Link>
              </a>
              <a className="hover-link">
                <Link href="/search/sale">
                  <a className="text-link">Sale</a>
                </Link>
              </a>

              <a className="hover-link">
                <Link href="/search/prima-collection">
                  <a className="text-link">Prima Collection</a>
                </Link>
              </a>
            </nav>
          </div>

          <Title moving={moving} />
          <div className="justify-center flex-1 hidden lg:flex">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
          </div>

          <div className="flex justify-end flex-1 space-x-8">
            <Searchbar />
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
