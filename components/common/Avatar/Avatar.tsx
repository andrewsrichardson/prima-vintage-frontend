import { FC, useRef, useEffect } from "react";
import { useUserAvatar } from "@lib/hooks/useUserAvatar";
import Image from "next/image";

interface Props {
  className?: string;
  children?: any;
}

const Avatar: FC<Props> = ({}) => {
  let ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  let { userAvatar } = useUserAvatar();

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: "/nextimg/male.svg/48/75?url=male.svg&w=48&q=75",
      }}
      className="inline-block h-8 w-8 rounded-full border-2 border-accents-7 hover:border-accents-2 focus:border-secondary transition linear-out duration-150 flex justify-center items-center"
    >
      <Image
        src="/nextimg/male.svg/48/75?url=male.svg&w=48&q=75"
        width="20px"
        height="20px"
      />
    </div>
  );
};

export default Avatar;
