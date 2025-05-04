import PropTypes from "prop-types";

import { Avatar } from "primereact/avatar";

const LogoAvatar = ({ name = "" }) => (
  <Avatar label={name[0]} size="large" shape="circle" />
);

LogoAvatar.propTypes = {
  name: PropTypes.string
};

export default LogoAvatar;
