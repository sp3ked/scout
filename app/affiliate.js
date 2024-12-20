const full = {
  Amazon: {
    url: "https://www.amazon.",
    affiliate: (url) => {
      return `${new URL(url).origin}/dp/${url.split("/dp/")[1].split("/")[0]}/ref=nosim?tag=OUR_AFF_CODE`;
    },
  },
  Target: {
    url: "https://www.target.",
    affiliate: (url) => url,
  },
  Wayfair: {
    url: "https://www.wayfair.",
    affiliate: (url) => url,
  },
  Walmart: {
    url: "https://www.walmart.",
    affiliate: (url) => url,
  },
  AliExpress: {
    url: "https://www.aliexpress.",
    affiliate: (url) => url,
  },
  Ebay: {
    url: "https://www.ebay.",
    affiliate: (url) => url,
  },
  Etsy: {
    url: "https://www.etsy.",
    affiliate: (url) => url,
  },
  "Home Depot": {
    url: "https://www.homedepot.com",
    affiliate: (url) => url,
  },
  Shein: {
    url: ".shein.com",
    affiliate: (url) => url,
  },
  "West Elm": {
    url: "https://www.westelm.com",
    affiliate: (url) => url,
  },
  REI: {
    url: "https://www.rei.com",
    affiliate: (url) => url,
  },
  CVS: {
    url: "https://www.cvs.com",
    affiliate: (url) => url,
  },
  RiteAid: {
    url: "https://www.riteaid.com",
    affiliate: (url) => url,
  },
  "Piggly Wiggly": {
    url: "https://www.shopthepig.com",
    affiliate: (url) => url,
  },
  "Best Buy": {
    url: "https://www.bestbuy.com",
    affiliate: (url) => url,
  },
  Overstock: {
    url: "https://www.overstock.com",
    affiliate: (url) => url,
  },
  Zappos: {
    url: "https://www.zappos.com",
    affiliate: (url) => url,
  },
  Newegg: {
    url: "https://www.newegg.com",
    affiliate: (url) => url,
  },
  Sephora: {
    url: "https://www.sephora.com",
    affiliate: (url) => url,
  },
  "Macy's": {
    url: "https://www.macys.com",
    affiliate: (url) => url,
  },
  Nordstrom: {
    url: "https://www.nordstrom.com",
    affiliate: (url) => url,
  },
  "Bed Bath & Beyond": {
    url: "https://www.bedbathandbeyond.com",
    affiliate: (url) => url,
  },
  "Lowe's": {
    url: "https://www.lowes.com",
    affiliate: (url) => url,
  },
  "Kohl's": {
    url: "https://www.kohls.com",
    affiliate: (url) => url,
  },
  "J.C. Penney": {
    url: "https://www.jcpenney.com",
    affiliate: (url) => url,
  },
  Costco: {
    url: "https://www.costco.com",
    affiliate: (url) => url,
  },
  Staples: {
    url: "https://www.staples.com",
    affiliate: (url) => url,
  },
  "Office Depot": {
    url: "https://www.officedepot.com",
    affiliate: (url) => url,
  },
  "Barnes & Noble": {
    url: "https://www.barnesandnoble.com",
    affiliate: (url) => url,
  },
  "Crate & Barrel": {
    url: "https://www.crateandbarrel.com",
    affiliate: (url) => url,
  },
  IKEA: {
    url: "https://www.ikea.com",
    affiliate: (url) => url,
  },
  Anthropologie: {
    url: "https://www.anthropologie.com",
    affiliate: (url) => url,
  },
  "Bloomingdale's": {
    url: "https://www.bloomingdales.com",
    affiliate: (url) => url,
  },
  "Urban Outfitters": {
    url: "https://www.urbanoutfitters.com",
    affiliate: (url) => url,
  },
  ASOS: {
    url: "https://www.asos.com",
    affiliate: (url) => url,
  },
  Uniqlo: {
    url: "https://www.uniqlo.com",
    affiliate: (url) => url,
  },
  Farfetch: {
    url: "https://www.farfetch.com",
    affiliate: (url) => url,
  },
  "Saks Fifth Avenue": {
    url: "https://www.saksfifthavenue.com",
    affiliate: (url) => url,
  },
  "B&H Photo Video": {
    url: "https://www.bhphotovideo.com",
    affiliate: (url) => url,
  },
  Chewy: {
    url: "https://www.chewy.com",
    affiliate: (url) => url,
  },
  Petco: {
    url: "https://www.petco.com",
    affiliate: (url) => url,
  },
  PetSmart: {
    url: "https://www.petsmart.com",
    affiliate: (url) => url,
  },
  QVC: {
    url: "https://www.qvc.com",
    affiliate: (url) => url,
  },
  HSN: {
    url: "https://www.hsn.com",
    affiliate: (url) => url,
  },
  Verishop: {
    url: "https://www.verishop.com",
    affiliate: (url) => url,
  },
  Rakuten: {
    url: "https://www.rakuten.com",
    affiliate: (url) => url,
  },
  "Neiman Marcus": {
    url: "https://www.neimanmarcus.com",
    affiliate: (url) => url,
  },
  "Michael Kors": {
    url: "https://www.michaelkors.com",
    affiliate: (url) => url,
  },
  Coach: {
    url: "https://www.coach.com",
    affiliate: (url) => url,
  },
  Lululemon: {
    url: "https://www.lululemon.com",
    affiliate: (url) => url,
  },
  Nike: {
    url: "https://www.nike.com",
    affiliate: (url) => url,
  },
  Adidas: {
    url: "https://www.adidas.com",
    affiliate: (url) => url,
  },
  Puma: {
    url: "https://www.puma.com",
    affiliate: (url) => url,
  },
  "Under Armour": {
    url: "https://www.underarmour.com",
    affiliate: (url) => url,
  },
  "Dick's Sporting Goods": {
    url: "https://www.dickssportinggoods.com",
    affiliate: (url) => url,
  },
  Patagonia: {
    url: "https://www.patagonia.com",
    affiliate: (url) => url,
  },
  "The North Face": {
    url: "https://www.thenorthface.com",
    affiliate: (url) => url,
  },
  "Lands' End": {
    url: "https://www.landsend.com",
    affiliate: (url) => url,
  },
  "Old Navy": {
    url: "https://www.oldnavy.com",
    affiliate: (url) => url,
  },
  Gap: {
    url: "https://www.gap.com",
    affiliate: (url) => url,
  },
  "Banana Republic": {
    url: "https://www.bananarepublic.com",
    affiliate: (url) => url,
  },
  "H&M": {
    url: "https://www.hm.com",
    affiliate: (url) => url,
  },
  "Forever 21": {
    url: "https://www.forever21.com",
    affiliate: (url) => url,
  },
  Zara: {
    url: "https://www.zara.com",
    affiliate: (url) => url,
  },
  Boohoo: {
    url: "https://www.boohoo.com",
    affiliate: (url) => url,
  },
  ModCloth: {
    url: "https://www.modcloth.com",
    affiliate: (url) => url,
  },
  "Rent the Runway": {
    url: "https://www.renttherunway.com",
    affiliate: (url) => url,
  },
  Revolve: {
    url: "https://www.revolve.com",
    affiliate: (url) => url,
  },
  ThredUp: {
    url: "https://www.thredup.com",
    affiliate: (url) => url,
  },
  Poshmark: {
    url: "https://www.poshmark.com",
    affiliate: (url) => url,
  },
  StockX: {
    url: "https://www.stockx.com",
    affiliate: (url) => url,
  },
  GOAT: {
    url: "https://www.goat.com",
    affiliate: (url) => url,
  },
  "Finish Line": {
    url: "https://www.finishline.com",
    affiliate: (url) => url,
  },
  "Foot Locker": {
    url: "https://www.footlocker.com",
    affiliate: (url) => url,
  },
  Apple: {
    url: "https://www.apple.com",
    affiliate: (url) => url,
  },
  Microsoft: {
    url: "https://www.microsoft.com",
    affiliate: (url) => url,
  },
  Dell: {
    url: "https://www.dell.com",
    affiliate: (url) => url,
  },
  HP: {
    url: "https://www.hp.com",
    affiliate: (url) => url,
  },
  Lenovo: {
    url: "https://www.lenovo.com",
    affiliate: (url) => url,
  },
  Samsung: {
    url: "https://www.samsung.com",
    affiliate: (url) => url,
  },
  Sony: {
    url: "https://www.sony.com",
    affiliate: (url) => url,
  },
  Canon: {
    url: "https://www.canon.com",
    affiliate: (url) => url,
  },
  Nikon: {
    url: "https://www.nikon.com",
    affiliate: (url) => url,
  },
};

let rank = {};
for (const key in full) {
  rank[key] = full[key].url;
}

export { full, rank };
