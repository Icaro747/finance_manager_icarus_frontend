import { useState } from "react";

import classNames from "classnames";

import ItensNavigation from "constants/ItensNavigation";

import { useNavegation } from "context/NavigationContext";

import MainMenuItem from "./MainMenuItem";
import SubMenu from "./SubMenu";

import "./styled.scss";

const PanelMenu = () => {
  const { ExpandirMenu } = useNavegation();

  const [Id, setId] = useState(null);
  const [SubMenuName, setSubMenuName] = useState("");
  const [SubMenuShow, setSubMenuShow] = useState(false);
  const [SubMenuLista, setSubMenuLista] = useState([]);

  return (
    <div className="main-menu h-100">
      <ul
        className={classNames("panel-menu", { "show-sub-menu": SubMenuShow })}
      >
        {ItensNavigation.map((item) => (
          <li key={item.id}>
            <MainMenuItem
              item={item}
              expandirMenu={ExpandirMenu}
              id={Id}
              setId={setId}
              setSubMenuShow={setSubMenuShow}
              setSubMenuLista={setSubMenuLista}
              setSubMenuName={setSubMenuName}
            />
          </li>
        ))}
      </ul>
      <SubMenu
        subMenuShow={SubMenuShow}
        subMenuName={SubMenuName}
        subMenuLista={SubMenuLista}
        expandirMenu={ExpandirMenu}
        setSubMenuShow={setSubMenuShow}
        setId={setId}
      />
    </div>
  );
};

export default PanelMenu;
