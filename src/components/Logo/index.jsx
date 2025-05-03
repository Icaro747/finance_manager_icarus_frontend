import React from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import "./styleds.scss";

const Logo = ({ show }) => (
  <div className={classNames("box-01", { show }, { "not-show": !show })}>
    <div className="contro">
      <div className="box-a1">
        <div className="box-icon ak-01">
          <div className="icon-ak ak-01" />
        </div>
        <div className="box-icon ak-02">
          <div className="icon-ak ak-02" />
        </div>
      </div>
      <div className="box-k1">
        <div className="box-icon ak-03">
          <div className="icon-ak ak-03" />
        </div>
        <div className="box-icon ak-04">
          <div className="icon-ak ak-04" />
        </div>
        <div className="box-icon ak-05">
          <div className="icon-ak ak-05" />
        </div>
      </div>
    </div>
  </div>
);

Logo.propTypes = {
  show: PropTypes.bool.isRequired
};

export default Logo;
