import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group";

import { ReactChild, useEffect, useState } from "react";

type TransitionKind<RC> = {
  children: RC;
  location: string;
  loadedImages: number[];
};

let TIMEOUT: number = 2000;

const defaultTransitionStyle = {
  transition: `transform 200ms ease-in-out`,
};

const getTransitionStyles = {
  entered: {
    transform: `translateX(-50px)`,
  },
  exiting: {
    transform: `translateX(50px)`,
  },
  exited: { transform: `translateX(50px)` },
};

const defaultOverlayStyle = {
  position: `absolute`,
  backgroundColor: "#edbbd8",
  transition: `max-height 0.2s ease-in-out`,
  zIndex: 100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  height: "100vh",
  maxHeight: "100vh",
  width: "100%",
};

const overlayStyle = {
  entered: {
    height: "100vh",
  },
  exiting: {
    maxHeight: "0px",
  },
  exited: {
    maxHeight: "0px",
  },
};

const defaultImgStyle = {
  transition: `scale 0.2s ease-in-out`,
  height: "300px",
  width: "300px",
  scale: "1",
};
const imgStyle = {
  entered: {
    scale: "1",
  },
  exiting: {
    scale: "0.1",
  },
  exited: {
    scale: "0.1",
  },
};

const Transition: React.FC<TransitionKind<ReactChild>> = ({
  children,
  location,
  loadedImages,
}) => {
  const home = location === "/";
  let homeHidden = true;
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    homeHidden = true;
    !home && setMinTimePassed(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      home && setMinTimePassed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [location]);

  if (home && loadedImages.length >= 3 && minTimePassed) homeHidden = false;

  return (
    <ReactTransition
      key={location}
      in={home ? homeHidden : false}
      timeout={TIMEOUT}
    >
      {(status) => {
        return home ? (
          //home
          <>
            <div
              style={{ ...defaultOverlayStyle, ...overlayStyle[status] }}
              className="textured bg-violet"
            >
              <img
                style={{ ...defaultImgStyle, ...imgStyle[status] }}
                src="/globe-transparent.png"
              />
            </div>
            <div className="textured bg-violet">{children}</div>
          </>
        ) : (
          <>
            <div
              //everything else
              style={{
                ...defaultTransitionStyle,
                ...getTransitionStyles[status],
              }}
            >
              {children}
            </div>
          </>
        );
      }}
    </ReactTransition>
  );
};
export default Transition;
