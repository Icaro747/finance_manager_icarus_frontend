import React from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import SubMenuBackButton from "./SubMenuBackButton";
import SubMenuItem from "./SubMenuItem";

const SubMenu = ({
  minHeight,
  subMenuShow,
  subMenuName,
  subMenuLista,
  expandirMenu,
  setSubMenuShow,
  setId
}) => (
  <div
    className={classNames(
      "sub-menu p-3",
      { "sub-menu-enter": subMenuShow },
      { "sub-menu-exit": !subMenuShow },
      { "not-show": !expandirMenu }
    )}
    style={{ minHeight: `${minHeight}px` }}
  >
    <SubMenuBackButton
      onClick={() => {
        setSubMenuShow(false);
        setId(null);
      }}
      subMenuName={subMenuName}
    />
    <ul className="list-submenu">
      {subMenuLista.map((item) => (
        <li key={item.id}>
          <SubMenuItem item={item} expandirMenu={expandirMenu} />
        </li>
      ))}
    </ul>
  </div>
);

SubMenu.propTypes = {
  subMenuName: PropTypes.string.isRequired,
  subMenuShow: PropTypes.bool.isRequired,
  subMenuLista: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      to: PropTypes.string
    })
  ).isRequired,
  expandirMenu: PropTypes.bool.isRequired,
  setSubMenuShow: PropTypes.func.isRequired,
  setId: PropTypes.func.isRequired,
  minHeight: PropTypes.number.isRequired
};

export default SubMenu;
