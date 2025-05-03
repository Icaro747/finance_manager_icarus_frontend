import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { Button } from "primereact/button";

import { useNavegation } from "context/NavigationContext";

/**
 * Verifica se o usuário tem acesso ao item de navegação
 * @param {Array<number>} allowedLevels - Níveis de acesso permitidos
 * @param {number} userLevel - Nível de acesso do usuário
 * @returns {boolean} Se o usuário tem acesso
 */
export const HasAccessPermission = (allowedLevels, userLevel) => {
  if (!allowedLevels || !userLevel) return false;
  return allowedLevels.includes(Number(userLevel));
};

export const ItemTopico = ({ label, icon, items = [], to = "/" }) => {
  const navigate = useNavigate();
  const { ExpandirMenu } = useNavegation();

  return (
    <div className="d-flex align-items-center justify-content-center}">
      {items ? (
        <div className={`not-btn item-menu ${!ExpandirMenu ? "not-show" : ""}`}>
          <i className={icon} />{" "}
          <p className={ExpandirMenu ? "show-text" : ""}>{label}</p>
          {ExpandirMenu && <i className="pi pi-chevron-right fs-6" />}
        </div>
      ) : (
        <Button
          className={`not-btn item-menu ${!ExpandirMenu ? "not-show" : ""}`}
          onClick={() => {
            navigate(to);
          }}
        >
          <i className={icon} />
          <p className={ExpandirMenu ? "show-text" : ""}>{label}</p>
        </Button>
      )}
    </div>
  );
};

ItemTopico.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  to: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  )
};

export const ItemRenderer = ({ to, label, icon }) => {
  const { ExpandirMenu } = useNavegation();

  return (
    <Link to={to}>
      <i className={icon} />
      {ExpandirMenu && label}
    </Link>
  );
};

ItemRenderer.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

/**
 * Aplica o template para um item de navegação
 * @param {string} templateName - Nome do componente de template
 * @returns {Component} Componente de template
 */
export const GetTemplateComponent = (templateName) => {
  switch (templateName) {
    case "Item_Topico":
      return ItemTopico;
    case "Item_Renderer":
      return ItemRenderer;
    default:
      console.warn(`Template não encontrado: ${templateName}`);
      return null;
  }
};

/**
 * Processa de forma recursiva os itens de navegação
 * @param {Array} items - Itens de navegação
 * @param {number} userAccessLevel - Nível de acesso do usuário
 * @param {number} depth - Profundidade atual (para debug)
 * @returns {Array} Itens processados e filtrados
 */
export const ProcessNavigationItems = (items, userAccessLevel, depth = 0) => {
  console.log("🚀 ~ ProcessNavigationItems ~ items:", items);
  if (!items || !Array.isArray(items)) return [];
  if (userAccessLevel === null || userAccessLevel === undefined) return [];

  return items
    .map((item) => {
      // Processa itens filhos recursivamente (se existirem)
      const processedItems = item.items
        ? ProcessNavigationItems(
            item.items.map((subItem) => ({
              ...subItem,
              // Herdar nível de acesso do pai se não especificado
              accessLevelAllowed:
                subItem.accessLevelAllowed || item.accessLevelAllowed
            })),
            userAccessLevel,
            depth + 1
          )
        : undefined;
      console.log("🚀 ~ .map ~ processedItems:", processedItems);

      // Retorna o item com template e itens processados
      return {
        ...item,
        template: GetTemplateComponent(item.template),
        items: processedItems
      };
    })
    .filter(
      (item) =>
        // Remove itens nulos (que não têm mais filhos válidos)
        item !== null &&
        // Filtra pelo nível de acesso
        HasAccessPermission(item.accessLevelAllowed, userAccessLevel)
    );
};
