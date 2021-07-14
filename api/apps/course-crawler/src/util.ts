import { Page } from 'puppeteer';

export const getToken = async (pageForAuth: Page) => {
  await pageForAuth.goto(
    'https://www.spire.umass.edu/psp/heproda/?cmd=login&languageCd=ENG',
  );
  await (await pageForAuth.$('[name=CourseCatalogLink]')).click();
  await pageForAuth.waitForSelector('#ptifrmtgtframe');
};
