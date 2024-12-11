import * as puppeteerLib from 'puppeteer';
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { executablePath } = require('puppeteer');

export const getBrowser = async () => {
  return await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  }) as puppeteerLib.Browser;
};

export type Page = puppeteerLib.Page;
