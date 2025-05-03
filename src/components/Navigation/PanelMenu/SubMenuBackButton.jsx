import React from "react";

import PropTypes from "prop-types";

const SubMenuBackButton = ({ onClick, subMenuName }) => (
  <button type="button" className="btn-none title-submenu" onClick={onClick}>
    <p className="fs-5 truncate-text m-0">
      <i className="bi bi-chevron-left" /> {subMenuName}
    </p>
  </button>
);

SubMenuBackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  subMenuName: PropTypes.string.isRequired
};

export default SubMenuBackButton;
