import * as env from 'dotenv';
import * as fetch from 'node-fetch';
import { HttpClient } from 'tsbase/Net/Http/module';
import { ReciprocityEndpoints, Errors, Selectors } from './enums/module';
import { State, UsccaApiCollectionResponse } from './models/module';
import { ISynchronization, Changelog } from './synchronizations/module';
import { getBrowser, Page } from './puppeteer';

env.config({ path: './.env' });

export class Program {
  private static httpClient = new HttpClient({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Api-Token': process.env.X_API_TOKEN || ''
  }, fetch);

  static async Main() {
    console.log('Getting state data');

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto('https://www.usconcealedcarry.com/resources/ccw_reciprocity_map/', { waitUntil: 'networkidle2' });
    await page.waitForSelector(Selectors.StateSelect, { timeout: 5000 });

    const stateUrls = await this.getStateUrls(page);
    const stateData = await this.getStateData(stateUrls);

    console.log('All states:');
    console.table(stateData);

    const synchronizations: ISynchronization<any>[] = [
      new Changelog(this.httpClient)
    ];

    for (const state of stateData) {
      console.log('Running synchronizations for:');
      console.table(state);

      for (const synchronization of synchronizations) {
        const oldData = await synchronization.RetrieveDataFromOldSystem(page, state.oldSystemUrl as string);
        await synchronization.SyncOldDataToNewSystem(oldData, state.id as string);
      }
      break; // only do one state for now
    }

    await browser.close();
  }

  private static async getStateUrls(page: Page): Promise<string[]> {
    return await page.evaluate((selector) => {
      return Array.from(
        document.querySelectorAll<HTMLAnchorElement>(selector)
      ).map(e => e.href);
    }, Selectors.StateSelect);
  }

  private static async getStateData(stateUrls: string[]) {
    const response = await this.httpClient.Get<UsccaApiCollectionResponse<State>>(ReciprocityEndpoints.GetAllStates);
    if (response.ok) {
      return response.body.data.map(state => ({
        id: state.id,
        abbreviation: state.attributes.abbreviation,
        name: state.attributes.name,
        oldSystemUrl: stateUrls.find(url => {
          const abbreviationInUrl = url.split('ccw_reciprocity_map/')[1].split('-')[0].toLowerCase();
          return abbreviationInUrl === state.attributes.abbreviation.toLowerCase();
        })
      }));

    } else {
      throw new Error(Errors.UnableToGetStatesFromApi);
    }
  }
}
