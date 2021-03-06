import axios from 'axios';
export const userAgent: string = 'Node-JS Cheerio Web Scraper - Github TwiggyRJ';

export const instance = axios.create({
  headers: {
    'User-Agent': userAgent
  }
});

export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function sleep(ms: number, callback: () => void) {
  setTimeout(() => {
    callback();
  }, ms);
}

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
