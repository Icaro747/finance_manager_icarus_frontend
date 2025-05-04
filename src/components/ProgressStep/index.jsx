import React from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import "./style.scss";

const ProgressBar = ({ progress }) => (
  <div className="box-progress">
    <div className="progress" style={{ width: `${progress}%` }} />
  </div>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

const ProgressStep = ({ steps, activeStep }) => {
  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <div className="box-progress-step">
      <div className="posicao-progress-bar">
        <ProgressBar progress={progress} />
      </div>
      <div className="posicao-itens">
        {steps.map((step, index) => (
          <div key={step.name} className="box-etapa">
            <div
              className={classNames(
                "box-number",
                {
                  "box-number-ative": activeStep >= index
                },
                { "min-box-number": step.min === true }
              )}
            >
              <i className={`fs-6 ${step.icon}`} />
            </div>
            {step.name && (
              <p className="text-nowrap">
                <b>{step.name}</b>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ProgressStep.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
      min: PropTypes.bool
    })
  ).isRequired,
  activeStep: PropTypes.number.isRequired
};

export default ProgressStep;
