import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image
    src="/globe-transparent.png"
    width={props.width ? props.width : "30px"}
    height={props.height ? props.height : "30px"}
    alt="globe"
    className="bg-white rounded-full"
  />
);

export default Logo;
