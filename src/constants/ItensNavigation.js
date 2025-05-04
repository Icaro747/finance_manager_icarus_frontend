const ItensNavigation = [
  {
    id: 'home',
    label: 'Home',
    icon: 'ak ak-home',
    to: '/app/',
  },
  {
    id: 'inprotacao',
    label: "Inprotar dados",
    icon: "ak ak-database",
    to: "/app/base",
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'ak ak-lightbulb-fill',
    to: '/app/graficos',
  },
  {
    id: "contas",
    label: "Contas",
    icon: 'ak ak-gear-six',
    items: [
      {
        id: 'conta',
        to: '/app/conta/banco',
        label: 'Banco',
        icon: 'pi pi-bars',
      },
    ]
  },
  {
    id: "gereciamento",
    label: "Gereciamento",
    icon: 'ak ak-gear-six',
    items: [
      {
        id: 'movimentacao',
        to: '/app/gereciamento/movimentacao',
        label: 'Movimentaçoes',
        icon: 'pi pi-bars',
      },
      {
        id: 'nome-movimentacao',
        to: '/app/gereciamento/movimentacao/nome',
        label: 'Nomes Movimentaçoes',
        icon: 'pi pi-bars',
      },
    ]
  },
];

export default ItensNavigation;