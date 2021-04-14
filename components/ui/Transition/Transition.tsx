import {
  TransitionGroup,
  CSSTransition as ReactTransition,
} from "react-transition-group";
import Image from "next/image";

import { ReactChild, useEffect, useState } from "react";

type TransitionKind<RC> = {
  children: RC;
  location: string;
};

let TIMEOUT: number = 200;

const getTransitionStyles = {
  entering: {
    position: `absolute`,
    opacity: 0,
    transform: `translateX(50px)`,
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
    transform: `translateX(0px)`,
    animation: "blink .3s linear 2",
  },
  exiting: {
    transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
    opacity: 0,
    transform: `translateX(-50px)`,
  },
};

const overlayStyle = {
  entering: {
    position: `relative`,
    // backgroundColor: "#edbbd8",
    opacity: 0,
  },
  entered: {
    position: `relative`,
    transition: `opacity 2s ease-in`,
    opacity: 1,
  },
  exiting: {
    position: `relative`,
  },
};
const headerStyle = {
  entering: {
    opacity: 1,
    position: "relative",
  },
  entered: {
    opacity: 0,
    position: "relative",
    transition: `opacity 2s ease-out`,
  },
  exiting: {
    position: `relative`,
  },
};
const blurStyle = {
  entering: {
    position: `absolute`,
    backgroundColor: "#edbbd8",
    width: "100%",
    height: "100%",
    filter: "blur(0)",
  },
  entered: {
    position: `absolute`,
    width: "100%",
    height: "100%",
    backgroundColor: "#edbbd8",
    transition: `filter 0.5s ease-out`,
    filter: "blur(2rem)",
  },
  exiting: {
    position: `absolute`,
    width: "100%",
    height: "100%",
    transition: `background-color 0.5s ease-in-out`,
    backgroundColor: "#edbbd8",
  },
};

const Transition: React.FC<TransitionKind<ReactChild>> = ({
  children,
  location,
}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeoutAmt = location === "/" ? 4000 : TIMEOUT;
    console.log(timeoutAmt);
    setTimeout(() => setShow(true), timeoutAmt);
  }, []);
  console.log(show);
  return (
    <TransitionGroup style={{ position: "relative" }}>
      <ReactTransition key={location} in={show} timeout={TIMEOUT}>
        {(status) => {
          return location === "/" ? (
            //home
            <>
              <div
                style={{ ...blurStyle[status] }}
                className="textured flex justify-center items-center max-h-screen"
              >
                <div style={{ ...headerStyle[status], height: "300px" }}>
                  <Image
                    width="300px"
                    height="300px"
                    src="/globe-transparent.png"
                  />
                </div>
              </div>
              <div style={{ ...overlayStyle[status] }} className="textured">
                {children}
              </div>
            </>
          ) : (
            <div
              //everything else
              style={{
                ...getTransitionStyles[status],
              }}
            >
              {children}
            </div>
          );
        }}
      </ReactTransition>
    </TransitionGroup>
  );
};
export default Transition;
