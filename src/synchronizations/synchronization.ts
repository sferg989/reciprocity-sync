import { Page } from '../puppeteer';

export interface ISynchronization<T> {
  RetrieveDataFromOldSystem(page: Page, oldSystemUrl: string): Promise<T>;
  SyncOldDataToNewSystem(oldData: T, stateId: string): Promise<void>;
}
