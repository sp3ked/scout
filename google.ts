import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://lens.google.com";
const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
};

async function getPrerenderScript(page: string): Promise<any> {
  const r =
    page
      .split(`key: 'ds:0', hash: `)[1]
      .split("data:")[1]
      .split("], sideChannel")[0] + "]";
  return JSON.parse(r)[1];
}

function parsePrerenderScript(prerenderScript: any): any {
  let data = { match: null as any, similar: [] as any[] };
  try {
    data.match = {
      title: prerenderScript[0][1][8][12][0][0][0],
      thumbnail: prerenderScript[0][1][8][12][0][2][0][0],
      pageURL: prerenderScript[0][1][8][12][0][2][0][4],
    };
  } catch (error) {}

  const visualMatches = data.match
    ? prerenderScript[1][1][8][8][0][12]
    : prerenderScript[0][1][8][8][0][12];

  for (const match of visualMatches || []) {
    data.similar.push({
      title: match[3],
      thumbnail: match[0][0],
      pageURL: match[5],
      sourceWebsite: match[14],
      price: match[0][7] ? match[0][7][1] : null,
    });
  }

  return data;
}

async function searchByFile(photo: any): Promise<any> {
  const formData = new FormData();
  formData.append("encoded_image", photo);
  formData.append("image_content", "");

  const response = await axios.post(
    url + `/v3/upload?hl=en&re=df&stcs=${+new Date()}&vpw=1500&vph=1500`,
    formData,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
        Cookie:
          "NID=511=eoiYVbD3qecDKQrHrtT9_jFCqvrNnL-GSi7lPJANAlHOoYlZOhFjOhPvcc-43ZSGmBx_L5D_Irknb8HJvUMo41sCh1i0homN3Taqg2z7mdjnu3AQe-PbpKAyKE4zW1-N6niKTJAMkV6Jq4AWPwp6txH_c24gjt7fU3LWAfNIezA",
      },
      maxRedirects: 0,
    },
  );
  let t1 = new Date();

  const prerenderScript = await getPrerenderScript(response.data);

  return parsePrerenderScript(prerenderScript);
}

async function searchByUrl(xxurl: string): Promise<any> {
  const response = await axios.get(url + "/uploadbyurl", {
    headers: headers,
    params: { url: xxurl },
  });

  const prerenderScript = await getPrerenderScript(response.data);
  return parsePrerenderScript(prerenderScript);
}

export { searchByUrl, searchByFile };
