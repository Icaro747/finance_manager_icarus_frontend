const LinksMenuUsuario = [
  {
    id: "gestao-perfil",
    titulo: "Gestão de Perfil",
    links: [
      {
        to: "/app/sua-conta#meus-dados",
        icon: "pi pi-id-card",
        nome: "Meus dados"
      },

      {
        to: "/app/sua-conta#termos-politicas",
        icon: "pi pi-info-circle",
        nome: "Termos e Condições"
      }
    ]
  },
  {
    id: "configuraoces-plataforma",
    titulo: "Configurações da plataforma",
    links: [
      {
        to: "/app/acesso-rapido",
        icon: "pi pi-forward",
        nome: "Acelerar rapido"
      },
      {
        to: "/app/sua-conta#configuracao",
        icon: "pi pi-cog",
        nome: "Configuração das Notificações"
      },
    ]
  },
  {
    id: "gestao-plano",
    titulo: "Gestão de Plano",
    links: [
      {
        to: "/app/sua-conta#metodo-pagamento",
        icon: "pi pi-credit-card",
        nome: "Método de Pagamento"
      },
      {
        to: "/app/sua-conta#meu-plano",
        icon: "pi pi-cog",
        nome: "Meu Plano"
      }
    ]
  }
];

export default LinksMenuUsuario;