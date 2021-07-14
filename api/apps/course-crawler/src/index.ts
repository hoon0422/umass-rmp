import 'reflect-metadata';
import { config } from 'dotenv';
config({
  path:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
      ? '.env'
      : `.${process.env.NODE_ENV}.env`,
});
import { createConnection, useContainer as typeOrmUseContainer } from 'typeorm';
import { Container as typeormContainer } from 'typeorm-typedi-extensions';
import { Container } from 'typedi';
import { launch } from 'puppeteer';
import { DatabaseUpdateService } from './services/database-update.service';
import ormconfig from './ormconfig';
import { getToken } from './util';

const directory = undefined;
const semesters = ['2021 Fall', '2021 Spring', '2021 Summer'];
const majors = [];
const headless = false;

(async () => {
  typeOrmUseContainer(typeormContainer);
  await createConnection(
    ormconfig[
      !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
        ? 'default'
        : process.env.NODE_ENV
    ],
  );
  const browser = await launch({ headless });
  const pageForAuth = await browser.newPage();
  await getToken(pageForAuth);

  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  Container.set('session', page);
  Container.set('pageForAuth', pageForAuth);
  const updater = Container.get(DatabaseUpdateService);
  await updater.updateDatabase(directory, majors, semesters);
})();
