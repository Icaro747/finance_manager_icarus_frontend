import { useState, useRef, useEffect } from "react";

import classNames from "classnames";

import ItensNavigation from "constants/ItensNavigation";

import { useNavegation } from "context/NavigationContext";

import MainMenuItem from "./MainMenuItem";
import SubMenu from "./SubMenu";

import "./styled.scss";

const PanelMenu = () => {
  const { ExpandirMenu } = useNavegation();
  const mainListaRef = useRef(null);

  const [Id, setId] = useState(null);
  const [SubMenuName, setSubMenuName] = useState("");
  const [SubMenuShow, setSubMenuShow] = useState(false);
  const [SubMenuLista, setSubMenuLista] = useState([]);

  const [Altura, setAltura] = useState(0);

  // Função recursiva para filtrar itens com base no nível de acesso
  const filterNavigationItems = (items) =>
    items

      .map((item) => ({
        ...item,
        items: item.items ? filterNavigationItems(item.items) : undefined
      }))
      .filter((item) => item.items?.length > 0 || !item.items); // Remove pais sem filhos acessíveis

  // Filtra os itens de navegação
  const filteredItensNavigation = filterNavigationItems(ItensNavigation);

  useEffect(() => {
    if (mainListaRef.current) {
      setAltura(mainListaRef.current.offsetHeight);
    }
  }, [filteredItensNavigation]);

  return (
    <div className="main-menu h-100">
      <ul
        ref={mainListaRef}
        className={classNames("panel-menu", { "show-sub-menu": SubMenuShow })}
      >
        {filteredItensNavigation.map((item) => (
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
        minHeight={Altura}
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
