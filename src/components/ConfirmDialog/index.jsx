import React from "react";

import PropTypes from "prop-types";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";

const ConfirmDialog = ({
  visible,
  onHide,
  message,
  onConfirm,
  confirmText,
  cancelText
}) => (
  <Dialog
    visible={visible}
    onHide={onHide}
    style={{ minWidth: "300px", maxWidth: "25vw" }}
  >
    <div className="d-flex flex-column align-items-center m-2 gap-3">
      <i className="ak ak-info-box ak-cor-cinza-4 fs-3" />
      <p className="text-center fs-5">{message}</p>
      <Divider className="m-0" />
      <div className="w-100 d-flex flex-row gap-3">
        <button
          type="button"
          className="w-100 btn btn-preto btn-grande"
          onClick={onHide}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="w-100 btn btn-vermelho btn-grande"
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </Dialog>
);

ConfirmDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  message: PropTypes.element.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired
};

export default ConfirmDialog;
