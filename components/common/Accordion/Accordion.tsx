import { useEffect, useState } from "react";
import s from "./accordion.module.css";

const Panel = ({ label, content, activeTab, index, activateTab }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    window.setTimeout(() => {
      setHeight(100);
    }, 333);
  }, []);

  const isActive = activeTab === index;
  const innerStyle = {
    height: `${isActive ? height : 0}px`,
  };

  return (
    <div className={s.panel} role="tabpanel" aria-expanded={isActive}>
      <button className={s.panel__label} role="tab" onClick={activateTab}>
        {label}
      </button>
      <div
        className={s.panel__inner}
        style={innerStyle}
        aria-hidden={!isActive}
      >
        <p className={s.panel__content}>{content}</p>
      </div>
    </div>
  );
};

const Accordion = ({ panels }) => {
  const [activeTab, setActiveTab] = useState(0);

  const activateTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className={s.accordion} role="tablist">
      {panels.map((panel, index) => (
        <Panel
          key={index}
          activeTab={activeTab}
          index={index}
          {...panel}
          activateTab={() => activateTab(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
