import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { ChangelogEntry, UsccaApiCollectionResponse } from '../models/module';
import { EndpointParams, Errors, ReciprocityEndpoints, Selectors } from '../enums/module';
import { Page } from '../puppeteer';
import { ISynchronization } from './synchronization';

export class Changelog implements ISynchronization<ChangelogEntry[]> {
  constructor(private httpClient: HttpClient) { }

  async RetrieveDataFromOldSystem(page: Page, oldSystemUrl: string): Promise<ChangelogEntry[]> {
    await page.goto(oldSystemUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector(Selectors.ChangeLogRowData, { timeout: 5000 });

    return await this.getOldSystemChangeLogEntries(page);
  }

  async SyncOldDataToNewSystem(oldSystemChangeLog: ChangelogEntry[], stateId: string): Promise<void> {
    console.log('old changelog entries for state id', stateId);
    console.table(oldSystemChangeLog);

    const existingChangelog = await this.getExistingChangeLogEntries(stateId);
    console.log('existing changelog entries for state id', stateId);
    const existingChangelogEntries = existingChangelog.data.map(e => ({
      id: e.id,
      date: e.attributes.date,
      summary: e.attributes.summary
    }));
    console.table(existingChangelogEntries);

    for (const oldSystemEntry of oldSystemChangeLog) {
      const existingEntryForDate = existingChangelogEntries.find(e => e.date === oldSystemEntry.date);

      if (existingEntryForDate) {
        console.log('TODO: PATCH', existingEntryForDate);
        console.log('to', oldSystemEntry);
        // const updateUri = ReciprocityEndpoints.UpdateChangeLogEntry.replace(EndpointParams.Id, existingEntryForDate.id);
        // await this.httpClient.Patch(updateUri, {
        //   summary: encodeURIComponent(oldSystemEntry.summary)
        // });
      } else {
        console.log('TODO: POST', oldSystemEntry);
        // const createUri = ReciprocityEndpoints.ChangeLogForState.replace(EndpointParams.Id, stateId);
        // await this.httpClient.Post(createUri, {
        //   date: oldSystemEntry.date, // api only takes summary? - may not be able to sync older changelog entries
        //   summary: oldSystemEntry.summary
        // });
      }
    }
  }

  private async getExistingChangeLogEntries(stateId: string): Promise<UsccaApiCollectionResponse<ChangelogEntry>> {
    const uri = ReciprocityEndpoints.ChangeLogForState.replace(EndpointParams.Id, stateId);
    const response = await this.httpClient.Get<UsccaApiCollectionResponse<ChangelogEntry>>(uri);

    if (response.ok) {
      return response.body;
    } else {
      throw new Error(Errors.UnableToGetChangelogDataFromApi);
    }
  }

  private async getOldSystemChangeLogEntries(page: Page): Promise<ChangelogEntry[]> {
    return await page.evaluate((selector) => {
      const entries: ChangelogEntry[] = [];
      const tds = Array.from(
        document.querySelectorAll<HTMLTableElement>(selector)
      );

      for (let i = 0; i < tds.length; i += 2) {
        const date = tds[i].innerHTML;
        const summary = tds[i + 1].innerHTML;
        entries.push({
          date,
          summary
        });
      }

      return entries;
    }, Selectors.ChangeLogRowData);
  }
}
