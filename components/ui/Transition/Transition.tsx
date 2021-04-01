import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group";

import { ReactChild } from "react";

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

const getHomeTransition = {
  entering: {
    position: `absolute`,
    opacity: 1,
    transform: `translateX(50px)`,
    backgroundColor: "green",
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
    backgroundColor: "green",
    zIndex: 10,
  },
};

const Transition: React.FC<TransitionKind<ReactChild>> = ({
  children,
  location,
}) => {
  const styles = location === "/" ? getHomeTransition : getTransitionStyles;
  // if (location === "/") TIMEOUT = 1000;
  return (
    <TransitionGroup style={{ position: "relative" }}>
      <ReactTransition
        key={location}
        timeout={{
          enter: TIMEOUT,
          exit: TIMEOUT,
        }}
      >
        {(status) => (
          <div
            style={{
              ...styles[status],
            }}
          >
            {children}
          </div>
        )}
      </ReactTransition>
    </TransitionGroup>
  );
};
export default Transition;
