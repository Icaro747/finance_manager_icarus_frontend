import React from "react";
import { Link } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";

const MainMenuItem = ({
  item,
  expandirMenu,
  id,
  setId,
  setSubMenuShow,
  setSubMenuLista,
  setSubMenuName
}) =>
  item?.to ? (
    <Link
      to={item.to}
      className={classNames(
        "item-primeira",
        { active: id === item.id },
        { "not-show": !expandirMenu }
      )}
      onClick={() => {
        setId(item.id);
        setSubMenuShow(false);
      }}
    >
      <div className="icon-box">
        <i className={`${item.icon} ak-cor-2`} />
      </div>
      <p className={classNames({ "not-show": !expandirMenu })}>{item.label}</p>
    </Link>
  ) : (
    <button
      type="button"
      className={classNames(
        "btn-none item-primeira",
        { active: id === item.id },
        { "not-show": !expandirMenu }
      )}
      onClick={() => {
        setSubMenuLista(item.items);
        setSubMenuName(item.label);
        if (id === item.id) {
          setSubMenuShow(false);
          setId(null);
        } else {
          setId(item.id);
          setSubMenuShow(true);
        }
      }}
    >
      <div className="icon-box">
        <i className={`${item.icon} ak-cor-2`} />
      </div>
      <p className={classNames({ "not-show": !expandirMenu })}>{item.label}</p>
    </button>
  );

MainMenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    to: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  expandirMenu: PropTypes.bool.isRequired,
  id: PropTypes.string,
  setId: PropTypes.func.isRequired,
  setSubMenuShow: PropTypes.func.isRequired,
  setSubMenuLista: PropTypes.func.isRequired,
  setSubMenuName: PropTypes.func.isRequired
};

export default MainMenuItem;
