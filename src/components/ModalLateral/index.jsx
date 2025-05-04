import React from "react";

import PropTypes from "prop-types";

import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

const ModalLateral = ({
  visible,
  onHide,
  body,
  footer = null,
  style = {},
  header = <div />
}) => (
  <Sidebar
    visible={visible}
    onHide={onHide}
    style={style}
    position="right"
    content={({ closeIconRef, hide }) => (
      <div className="p-3 pt-4 pb-4">
        <div className="d-flex justify-content-between align-items-center">
          {header}
          <Button
            icon="pi pi-times"
            text
            severity="secondary"
            ref={closeIconRef}
            onClick={(e) => {
              hide(e);
            }}
          />
        </div>
        <hr />
        <section className="h-100 d-flex flex-column justify-content-between gap-3">
          <article>{body}</article>
          <div className="modal-footer">{footer}</div>
        </section>
      </div>
    )}
  />
);

ModalLateral.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  body: PropTypes.node.isRequired,
  footer: PropTypes.node,
  style: PropTypes.object,
  header: PropTypes.node
};

export default ModalLateral;
