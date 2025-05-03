import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";

const SubMenuItem = ({ item }) => {
  const [ShowThisList, setShowThisList] = useState(null);
  const [SubmenuHeight, setSubmenuHeight] = useState(0);
  const submenuRef = useRef(null);

  useEffect(() => {
    if (ShowThisList === item.id && submenuRef.current) {
      setSubmenuHeight(submenuRef.current.offsetHeight);
    }
  }, [ShowThisList]);

  return item?.to ? (
    <Link to={item.to} className={classNames("item-submenu")}>
      <div className="icon-box">
        <i className={`${item.icon} ak-cor-2`} />
      </div>
      <p>{item.label}</p>
    </Link>
  ) : (
    <div className="main-top-submenu">
      <button
        type="button"
        className={classNames("btn-none sub-top-submenu", {
          active: ShowThisList === item.id
        })}
        style={{
          marginBottom: ShowThisList === item.id ? `${SubmenuHeight + 10}px` : 0
        }}
        onClick={() => {
          if (ShowThisList !== item.id) {
            setShowThisList(item.id);
          } else setShowThisList(null);
        }}
      >
        <div className="d-flex flex-row align-items-center gap-3">
          <div className="icon-box">
            <i className={`${item.icon} ak-cor-2`} />
          </div>
          <p>{item.label}</p>
        </div>
        <i className="bi bi-chevron-down" />
      </button>
      <div
        className="box-sub-submenu"
        style={{
          height: ShowThisList === item.id ? `${SubmenuHeight + 10}px` : 0
        }}
      >
        <div ref={submenuRef} className="list-sub-submenu">
          <div className="list-linha" />
          <ul className="">
            {item.items.map((subItem) => (
              <li key={subItem.id}>
                <Link to={subItem.to} className={classNames("item-submenu")}>
                  <div className="icon-box">
                    <i className={`${subItem.icon} ak-cor-2`} />
                  </div>
                  <p>{subItem.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

SubMenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    to: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

export default SubMenuItem;
