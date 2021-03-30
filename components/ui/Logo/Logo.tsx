import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image src="/globe.png" width="30px" height="30px" alt="globe" />
);

export default Logo;
