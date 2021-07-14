import { MajorCrawlService } from './major-crawl.service';
import { MajorData, Option, SemesterData } from '../models';
import { Page } from 'puppeteer';
import { Service, Inject } from 'typedi';

const waitForWheel = async (page: Page) => {
  await page.waitForFunction(
    `document.getElementById('WAIT_win0') && document.getElementById('WAIT_win0').style.visibility === "hidden"`,
  );
};

@Service()
export class CrawlService {
  @Inject('session') private readonly session: Page;
  @Inject('pageForAuth') private readonly pageForAuth: Page;
  @Inject() private readonly majorCrawlService: MajorCrawlService;

  async crawlMajor(majorOption: Option, semesterOption: Option) {
    const careerOptions = await this.crawlCareerOptions();
    const courses = {};

    for (const careerOption of careerOptions) {
      await this.selectSemester(semesterOption);
      await this.clearOpenClassChk();
      await this.selectMajor(majorOption);
      await this.selectCareer(careerOption);
      await this.clickSearchBtn();

      if (await this.isSearchResultNone()) {
        console.log(
          `'${careerOption.name}' '${majorOption.name}' in '${semesterOption.name}' does not have any search result.`,
        );
        continue;
      }

      const coursesOfCareer = await this.majorCrawlService.crawlCourses();
      await this.moveFromSearchResultToSearchPage();

      for (const course of coursesOfCareer) {
        courses[course.courseNumber] = course;
      }
    }

    return new MajorData({
      ...majorOption,
      semester: new SemesterData({
        year: parseInt(semesterOption.name.split(' ')[0]),
        season: semesterOption.name.split(' ')[1],
      }),
      courses: Object.values(courses),
    });
  }

  async moveToSearchPage(): Promise<void> {
    await this.session.goto(
      'https://www.spire.umass.edu/psc/heproda/EMPLOYEE/SA/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL',
    );
    await this.session.waitForFunction(
      () => document.querySelector('#pthdr2logimg') === null,
    );
    await this.session.waitForSelector('#CLASS_SRCH_WRK2_SUBJECT\\$108\\$');
    await this.session.waitForSelector('#CLASS_SRCH_WRK2_ACAD_CAREER option');
  }

  async crawlMajorOptions() {
    return (
      await this.session.$$eval(
        '#CLASS_SRCH_WRK2_SUBJECT\\$108\\$ option',
        (optionTags) =>
          optionTags.map((optionTag) => ({
            value: optionTag
              .getAttribute('value')
              .trim()
              .replace(/\s\s+/g, ' '),
            name: optionTag.textContent.trim().replace(/\s\s+/g, ' '),
          })),
      )
    )
      .slice(1)
      .map((op) => new Option(op));
  }

  async crawlSemesterOptions() {
    return (
      await this.session.$$eval(
        '#UM_DERIVED_SA_UM_TERM_DESCR option',
        (optionTags) =>
          optionTags.map((optionTag) => ({
            value: optionTag
              .getAttribute('value')
              .trim()
              .replace(/\s\s+/g, ' '),
            name: optionTag.textContent.trim().replace(/\s\s+/g, ' '),
          })),
      )
    )
      .slice(1)
      .map((op) => new Option(op));
  }

  private async crawlCareerOptions() {
    return (
      await this.session.$$eval(
        '#CLASS_SRCH_WRK2_ACAD_CAREER option',
        (optionTags) =>
          optionTags.map((optionTag) => ({
            value: optionTag
              .getAttribute('value')
              .trim()
              .replace(/\s\s+/g, ' '),
            name: optionTag.textContent.trim().replace(/\s\s+/g, ' '),
          })),
      )
    )
      .slice(1)
      .map((op) => new Option(op));
  }

  private async selectMajor(major: Option) {
    await this.session.waitForSelector(`option[value="${major.value}"]`);
    await this.session.$eval(`option[value="${major.value}"]`, (option) => {
      option.setAttribute('selected', 'selected');
    });
    await waitForWheel(this.session);
  }

  private async selectCareer(career: Option) {
    await this.session.waitForSelector(`option[value="${career.value}"]`);
    await this.session.$eval(`option[value="${career.value}"]`, (option) => {
      option.setAttribute('selected', 'selected');
    });
    await waitForWheel(this.session);
  }

  private async selectSemester(semester: Option) {
    await this.session.waitForSelector(`option[value="${semester.value}"]`);
    await this.session.$eval(`option[value="${semester.value}"]`, (option) => {
      option.setAttribute('selected', 'selected');
    });
    await waitForWheel(this.session);
  }

  private async clearOpenClassChk() {
    await this.session.waitForSelector('#CLASS_SRCH_WRK2_SSR_PB_CLEAR');
    await this.session.click('#CLASS_SRCH_WRK2_SSR_PB_CLEAR');
    await waitForWheel(this.session);
  }

  private async clickSearchBtn() {
    await this.session.waitForSelector('#CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH');
    await this.session.click('#CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH');
    await waitForWheel(this.session);
  }

  private async isSearchResultNone() {
    return (await this.session.$('#DERIVED_CLSMSG_ERROR_TEXT')) !== null;
  }

  private async moveFromSearchResultToSearchPage() {
    await this.session.waitForSelector('#CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH');
    await this.session.click('#CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH');
    await waitForWheel(this.session);
  }
}
