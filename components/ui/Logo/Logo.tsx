import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image
    src="/globe-transparent.png"
    width="30px"
    height="30px"
    alt="globe"
    className="bg-white rounded-full"
  />
);

export default Logo;
