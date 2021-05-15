import { FC } from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Page } from "@framework/common/get-all-pages";
import getSlug from "@lib/get-slug";
import { Github } from "@components/icons";
import { Logo, Container } from "@components/ui";
import { I18nWidget } from "@components/common";
import s from "./Footer.module.css";
import useNav from "@commerce/nav/use-nav";

interface Props {
  className?: string;
  children?: any;
  pages?: Page[];
}

const LEGAL_PAGES = ["terms-of-use", "shipping-returns", "privacy-policy"];

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages, legalPages } = usePages(pages);
  const rootClassName = cn(className);
  let navData: any = {};
  const { data } = useNav();
  if (data) navData = data;

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 border-b border-accents-2 py-12 text-primary bg-primary transition-colors duration-150">
          <div className="col-span-2">
            <Link href="/">
              <a className="flex flex-initial items-center font-bold md:mr-24">
                <span
                  className="rounded-full mr-2"
                  style={{ maxHeight: "30px" }}
                >
                  <Logo />
                </span>
                <h2 className="text-6xl">
                  PRIMA <br />
                  VINTAGE
                </h2>
              </a>
            </Link>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg py-3 md:py-0 md:pb-2">Collections</h3>
            <ul className="flex flex-initial flex-col md:flex-1">
              {/* <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:border-dotted transition ease-in-out duration-150">
                  Home
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:underline transition ease-in-out duration-150">
                  Careers
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/blog">
                <a className="text-primary hover:underline transition ease-in-out duration-150">
                  Blog
                </a>
              </Link>
            </li> */}
              <li></li>
              {navData &&
                navData?.collections?.map((page) => (
                  <li
                    key={page.handle}
                    className="py-3 md:py-0 md:pb-2 text-sm"
                  >
                    <Link href={"/" + page.handle}>
                      <a className="text-primary hover:underline transition ease-in-out duration-150 italic">
                        {page.title}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg py-3 md:py-0 md:pb-2">Types</h3>
            <ul className="flex flex-initial flex-col md:flex-1">
              {navData &&
                navData?.types?.map((type) => (
                  <li key={type} className="py-3 md:py-0 md:pb-2 text-sm">
                    <Link href={"/search/type/" + type}>
                      <a className="text-primary hover:underline transition ease-in-out duration-150 italic capitalize">
                        {type}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-lg py-3 md:py-0 md:pb-2">Brands</h3>

            <ul className="flex flex-initial flex-col md:flex-1">
              {navData &&
                navData?.brands?.map((brand) => (
                  <li key={brand} className="py-3 md:py-0 md:pb-2 text-sm">
                    <Link href={"/search/designers/" + brand}>
                      <a className="text-primary hover:underline transition ease-in-out duration-150 italic capitalize">
                        {brand}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
            <div className="col-span-1 lg:col-span-2">
              <ul className="flex flex-initial flex-col md:flex-1">
                {legalPages.map((page) => (
                  <li key={page.url} className="py-3 md:py-0 md:pb-4">
                    <Link href={page.url!}>
                      <a className="text-primary hover:underline transition ease-in-out duration-150">
                        {page.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="col-span-1 lg:col-span-6 flex items-start lg:justify-end text-primary">
          <div className="flex space-x-6 items-center h-10">
            <a
              aria-label="Github Repository"
              href="https://github.com/andrewsrichardson"
              className={s.link}
            >
              <Github />
            </a>
            <I18nWidget />
          </div>
        </div> */}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center py-2">
          <div>
            <span>&copy; 2021 Prima Vintage. All rights reserved.</span>
          </div>
          <div className="flex items-center text-primary">
            <span className="text-primary mr-1">Crafted by </span>
            <a
              rel="noopener"
              href="https://duplank.com"
              aria-label="duplank.com Link"
              target="_blank"
              className="text-primary  underline-dotted"
            >
              duplank
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

function usePages(pages?: Page[]) {
  const { locale } = useRouter();
  const sitePages: Page[] = [];
  const legalPages: Page[] = [];

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url);

      if (!slug) return;
      if (locale && !slug.startsWith(`${locale}/`)) return;

      if (isLegalPage(slug, locale)) {
        legalPages.push(page);
      } else {
        sitePages.push(page);
      }
    });
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
    legalPages: legalPages.sort(bySortOrder),
  };
}

const isLegalPage = (slug: string, locale?: string) =>
  locale
    ? LEGAL_PAGES.some((p) => `${locale}/${p}` === slug)
    : LEGAL_PAGES.includes(slug);

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

export default Footer;
