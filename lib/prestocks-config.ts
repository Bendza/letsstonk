// PreStocks configuration data
// PreStocks are tokens that track the valuation of pre-IPO companies
// Fully backed by SPV exposure, and freely tradable 24/7

export interface PreStock {
  symbol: string;
  name: string;
  address: string;
  logoURI?: string;
  sector: string;
}

export const preStocksConfig: PreStock[] = [
  {
    symbol: 'ADEPAR',
    name: 'Addepar PreStocks',
    address: 'PreDmU41w1LZaDqiEQdd75ffWaDndMMN8bJPfNno4AM',
    logoURI: 'https://prestocks.com/assets/product-logos/addepar.webp',
    sector: 'FinTech'
  },
  {
    symbol: 'ANDURL',
    name: 'Anduril PreStocks', 
    address: 'Prep57BLk9uKWRzKigtQBbrYFxcDXtHuCjxFRM5UXAS',
    logoURI: 'https://prestocks.com/assets/product-logos/anduril.webp',
    sector: 'Defense Technology'
  },
  {
    symbol: 'ANTHRP',
    name: 'Anthropic PreStocks',
    address: 'PreGERrFuZAJqTxJ5oC3DeQmfdrniNzJgqKGFb2ZLE6',
    logoURI: 'https://prestocks.com/assets/product-logos/anthropic.webp',
    sector: 'AI'
  },
  {
    symbol: 'APTRNK',
    name: 'Apptronik PreStocks',
    address: 'PreZsfo4N5J16vpJWvaTubLpNHrBe1fNgvoFuqZ21xK',
    logoURI: 'https://prestocks.com/assets/product-logos/apptronik.webp',
    sector: 'Robotics'
  },
  {
    symbol: 'BLABLA',
    name: 'BlaBlaCar PreStocks',
    address: 'PreQ1REpwo4v5d8QMF58h3jpqKww9k5NMbvBXMVo7A5',
    logoURI: 'https://prestocks.com/assets/product-logos/blablacar.webp',
    sector: 'Transportation'
  },
  {
    symbol: 'CHAOS',
    name: 'CHAOS Industries PreStocks',
    address: 'PrejfFQH6y6aQBfR43zuBqnPXvQrDU5EugwVEBQZVK3',
    logoURI: 'https://prestocks.com/assets/product-logos/chaos-industries.webp',
    sector: 'Industrial'
  },
  {
    symbol: 'DATABR',
    name: 'Databricks PreStocks',
    address: 'PregdTtARmfoDGB7XsbyyZc4RmKbKdmiPFXvinBpjTa',
    logoURI: 'https://prestocks.com/assets/product-logos/databricks.webp',
    sector: 'Data Analytics'
  },
  {
    symbol: 'DISCRD',
    name: 'Discord PreStocks',
    address: 'PrekBgzytydXoDTrH5NW9ABP68c96twxML8oV1NnV8d',
    logoURI: 'https://prestocks.com/assets/product-logos/discord.webp',
    sector: 'Communication'
  },
  {
    symbol: 'EPIC',
    name: 'Epic Games PreStocks',
    address: 'PreGJxNkwFp8KmtA5rnvgv2z3zAa8c2UQMfN4FjPh4Z',
    logoURI: 'https://prestocks.com/assets/product-logos/epic-games.webp',
    sector: 'Gaming'
  },
  {
    symbol: 'FIGURE',
    name: 'Figure AI PreStocks',
    address: 'PreAYsissANcRXg5uTniKqdCrrUSGdvtrKDVPHS1ib6',
    logoURI: 'https://prestocks.com/assets/product-logos/figure.webp',
    sector: 'AI Robotics'
  },
  {
    symbol: 'GLEAN',
    name: 'Glean PreStocks',
    address: 'PreZdBV5d4XDUa7diCGZmyZXQSpbAdrTEzmgvUWY5Dd',
    logoURI: 'https://prestocks.com/assets/product-logos/glean.webp',
    sector: 'Enterprise Software'
  },
  {
    symbol: 'GROQ',
    name: 'Groq PreStocks',
    address: 'Pre8wtN7sLADKn8qekjQipcSiYTGg5tafWqeH49s1wQ',
    logoURI: 'https://prestocks.com/assets/product-logos/groq.webp',
    sector: 'AI Hardware'
  },
  {
    symbol: 'HARVEY',
    name: 'Harvey PreStocks',
    address: 'PrevLYRs2HreKvo2bEQsAo839m38ws5TH2WHYFzqsWt',
    logoURI: 'https://prestocks.com/assets/product-logos/harvey.webp',
    sector: 'Legal Tech'
  },
  {
    symbol: 'IMFOOD',
    name: 'Impossible Foods PreStocks',
    address: 'PreQhJLE9YMSVtJpVLJ3bAWE2BQ5AqBniG7aA2bGRRz',
    logoURI: 'https://prestocks.com/assets/product-logos/impossible-foods.webp',
    sector: 'Food Tech'
  },
  {
    symbol: 'KRAKEN',
    name: 'Kraken PreStocks',
    address: 'Pres43hQWdY6HaHWckmgzqyQgVwYCXen3VPrXMoKWeY',
    logoURI: 'https://prestocks.com/assets/product-logos/kraken.webp',
    sector: 'Cryptocurrency'
  },
  {
    symbol: 'NEURAL',
    name: 'Neuralink PreStocks',
    address: 'Pre5X98d9ZvgGirEcWqeCVDK6wQ52stKkmU3HsH6bfE',
    logoURI: 'https://prestocks.com/assets/product-logos/neuralink.webp',
    sector: 'Neurotechnology'
  },
  {
    symbol: 'OPENAI',
    name: 'OpenAI PreStocks',
    address: 'PreYKD2kJ5xGgoZ644VPfbEN7sW8bWCUREHr5S3ebV9',
    logoURI: 'https://prestocks.com/assets/product-logos/openai.webp',
    sector: 'AI'
  },
  {
    symbol: 'PPLXTY',
    name: 'Perplexity PreStocks',
    address: 'PreG98Hxr4GNswTNTQfBVqRQe6DNCjJ9Rg5jqFzmiXA',
    logoURI: 'https://prestocks.com/assets/product-logos/perplexity.webp',
    sector: 'AI Search'
  },
  {
    symbol: 'SSI',
    name: 'Safe Superintelligence PreStocks',
    address: 'Pre2Y4gaf97C4T8ckygDpYbja3w6mH6zmCEs3SA8ALH',
    logoURI: 'https://prestocks.com/assets/product-logos/ssi.webp',
    sector: 'AI Safety'
  },
  {
    symbol: 'SARONC',
    name: 'Saronic PreStocks',
    address: 'PreJuqZjkL2QFkx78MkEGv8P6Zk8qqpTx9GSjLtfvXW',
    logoURI: 'https://prestocks.com/assets/product-logos/saronic.webp',
    sector: 'Maritime Defense'
  },
  {
    symbol: 'SPACEX',
    name: 'SpaceX PreStocks',
    address: 'Preb5VKsmKgMGhMKUhDpe7A2AhMDmrZtMMZmvFEhLbU',
    logoURI: 'https://prestocks.com/assets/product-logos/spacex.webp',
    sector: 'Aerospace'
  },
  {
    symbol: 'XAI',
    name: 'xAI PreStocks',
    address: 'PreYPq1LdVBhKsYC3nRmZW5Y9yJXwSuDYmUSikFCwGS',
    logoURI: 'https://prestocks.com/assets/product-logos/xai.webp',
    sector: 'AI'
  }
];

export const getPreStockBySymbol = (symbol: string): PreStock | undefined => {
  return preStocksConfig.find(stock => stock.symbol === symbol);
};

export const getPreStockByAddress = (address: string): PreStock | undefined => {
  return preStocksConfig.find(stock => stock.address === address);
};

export const getPreStocksByCategory = (sector: string): PreStock[] => {
  if (sector === 'all') return preStocksConfig;
  return preStocksConfig.filter(stock => stock.sector === sector);
};

export const preStocksSectors = Array.from(new Set(preStocksConfig.map(stock => stock.sector))).sort();