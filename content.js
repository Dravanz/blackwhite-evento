/*
 * CONTEÚDO DO SITE — edite só este arquivo para atualizar o portfólio.
 * Campos vazios ("") aparecem como "em breve" automaticamente.
 */
window.BW = {
  evento: {
    data: "2026-11-08T09:00:00-03:00", // usado na contagem regressiva
    dataExtenso: "08 de novembro",
    horario: "Manhã e tarde",
    local: "Rampa Hub Quartier",
    cidade: "Pelotas - RS",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Rampa+Hub+Quartier+Pelotas+RS",
  },

  contato: {
    // botões "Participar" / "Quero estar lá" / "Garanta sua vaga"
    participarUrl: "https://api.whatsapp.com/send?phone=5553981188074&text=Ol%C3%A1%2C+eu+gostaria+de+participar+deste+networking+do+evento+black+white!",
    // botões "Patrocinar"
    patrocinarUrl: "https://api.whatsapp.com/send?phone=5553981188074&text=Ol%C3%A1%2C+eu+gostaria+de+patrocinar+este+evento+black+white+e+receber+visibilidade+no+meu+neg%C3%B3cio!",
  },

  // Os idealizadores. instagram: sem @ (ex.: "robertblackwhite") — vazio = não aparece
  palestrantes: [
    { nome: "Robert BlackWhite", titulo: "Idealizadores do evento", foto: "assets/robert.jpg", instagram: "robertcamargobw" },
    { nome: "Douglas", titulo: "Idealizadores do evento", foto: "assets/douglas.jpg", instagram: "douglaas_peereira" },
    { nome: "Belo Barber", titulo: "Idealizadores do evento", foto: "assets/belo.jpg", instagram: "belo.barber" },
    { nome: "Max Soares", titulo: "Idealizadores do evento", foto: "assets/max.jpg", instagram: "maxsoares71" },
  ],

  // Carrossel pequeno de fotos (bastidores). legenda é opcional
  bastidores: [
    { foto: "assets/douglas-dalessandro.jpg", legenda: "D'Alessandro" },
    { foto: "assets/belo-suarez.jpg", legenda: "Suárez" },
    { foto: "assets/robert-garotada.jpg", legenda: "Projetos" },
    { foto: "assets/douglas-alanpatrick.jpg", legenda: "Alan Patrick" },
    { foto: "assets/belo-renato.jpg", legenda: "Renato Gaúcho" },
  ],

  // Frases que giram na tela
  frases: [
    "O evento do ano. Você não vai querer ficar de fora.",
    "Não perca a oportunidade de alavancar o seu negócio.",
    "10 mentes brilhantes pensam melhor do que apenas 1.",
    "Ideia guardada não cresce. Ideia compartilhada vira negócio.",
    "Ninguém chega longe sozinho. Quem chega longe, chega junto.",
    "Uma boa conversa pode valer mais que um ano de tentativas.",
    "Seu próximo sócio pode estar a um aperto de mão de distância.",
    "Conhecimento dividido é conhecimento multiplicado.",
    "Oportunidades não batem à porta. Elas sentam ao seu lado.",
    "Sua rede de contatos é o patrimônio que ninguém tira de você.",
    "Um dia que pode mudar o rumo da sua empresa.",
    "Quem está no lugar certo, com as pessoas certas, cresce mais rápido.",
    "As vagas são limitadas. As oportunidades, não.",
  ],

  // Fotos/vídeos do evento. Ex.: { src: "assets/foto1.jpg" } ou { src: "assets/video.mp4", video: true }
  galeria: [],

  // Patrocinadores confirmados. Ex.: { nome: "Empresa X", logo: "assets/x.png", url: "https://..." }
  patrocinadores: [],
};
