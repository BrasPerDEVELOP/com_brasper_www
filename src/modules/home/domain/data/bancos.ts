export interface Banco {
  nombre: string
  img1: string
  enlace: string
}

export const databancos: Banco[] = [
  {
    nombre: 'BCP',
    img1: '/assets/images/bancos/bcp.png',
    enlace: 'https://www.viabcp.com/'
  },
  {
    nombre: 'Banco do Brasil',
    img1: '/assets/images/bancos/banco-do-brasil.png',
    enlace: 'https://www.bb.com.br/'
  },
  {
    nombre: 'NuBank',
    img1: '/assets/images/bancos/nubank.png',
    enlace: 'https://nubank.com.br/'
  },
  {
    nombre: 'C6 Bank',
    img1: '/assets/images/bancos/c6bank.png',
    enlace: 'https://www.c6bank.com.br/'
  },
  {
    nombre: 'C6 Bank',
    img1: "/assets/images/bancos/yapeplin.png",
    enlace: "https://www.yape.com.pe/",
  },
  {
    nombre: 'BBVA Banco Continental',
    img1: '/assets/images/bancos/bbva.png',
    enlace: 'https://www.bbva.pe/'
  }
]
