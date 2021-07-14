import {
  CourseData,
  ProfessorData,
  SectionData,
  SectionTimeData,
} from '../models';
import { load } from 'cheerio';
import { Service, Inject } from 'typedi';
import { Page } from 'puppeteer';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

const trim = (str: string) => str.trim().replace(/\s\s+/g, ' ');

@Service()
export class MajorCrawlService {
  @Inject('session') private readonly session: Page;

  async crawlCourses() {
    const sectionsProm = this.crawlSections().then((sections) =>
      Object.values(sections).reduce((sectionsForCourse, section) => {
        if (sectionsForCourse[section.courseNumber]) {
          sectionsForCourse[section.courseNumber].push(section);
        } else {
          sectionsForCourse[section.courseNumber] = [section];
        }
        return sectionsForCourse;
      }, {} as { [courseNumber: string]: SectionData[] }),
    );

    return this.session.content().then(async (c) => {
      const $ = load(c);
      const crawledCourseData = $('[id^=DERIVED_CLSRCH_DESCR200]')
        .map(function () {
          return trim($(this).text());
        })
        .get();
      const sections = await sectionsProm;

      return crawledCourseData.map((temp) => {
        const courseNumber = trim(temp.substr(0, temp.indexOf('-') - 1));

        return new CourseData({
          courseNumber,
          title: trim(temp.substr(temp.indexOf('-') + 2)),
          sections: sections[courseNumber],
        });
      });
    });
  }

  private async crawlSections() {
    const sectionLinkIds = await this.crawlSectionLinkId();
    const professorsProm = this.getProfessors(sectionLinkIds);
    const contentsProm = this.session.evaluate(
      (sectionLinkIds: string[]) =>
        Promise.all(
          sectionLinkIds.map(async (linkId) => {
            const form = document['win0'].cloneNode(true);
            form.ICResubmit.value = '0';
            form.ICAction.value = linkId;

            return fetch(
              'https://www.spire.umass.edu/psc/heproda/EMPLOYEE/SA/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL',
              {
                method: 'post',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'same-origin',
                body: new URLSearchParams(new FormData(form) as any).toString(),
              },
            ).then((response) => response.text());
          }),
        ),
      sectionLinkIds,
    );
    const professors = await professorsProm;
    const contents = await contentsProm;

    return contents.reduce((sections, content) => {
      const section = this.crawlSection(content);
      // console.log(`${this.name} - section: ${section.classNumber}`);

      section.professors = professors[section.classNumber];
      return {
        ...sections,
        [section.classNumber]: new SectionData(section as SectionData),
      };
    }, {} as { [classNumber: string]: SectionData });
  }

  private async crawlSectionLinkId() {
    return await this.session.$$eval('.PSHYPERLINKACTIVE', (sections) =>
      sections
        .filter((_, idx) => {
          return idx % 2 === 1;
        })
        .map((s) => s.id),
    );
  }

  private async getProfessors(sectionLinkIds: string[]) {
    return (
      await Promise.all(
        sectionLinkIds.map(async (sectionLinkId) => {
          const [head, num] = sectionLinkId.split('$');
          const classNumber = await this.session.$eval(
            `#${head}\\$${num}`,
            (selector) =>
              selector.textContent.trim().split('(')[1].substr(0, 5),
          );
          const professors = await this.session.$$eval(
            `#win0divUM_DERIVED_SR_UM_HTML1\\$${num} a`,
            (links) =>
              links.map((link) => ({
                email: link.getAttribute('href').split(':')[1],
                name: link.textContent,
              })),
          );

          return { classNumber, professors };
        }),
      )
    ).reduce(
      (professors, { classNumber, professors: professorsForSection }) => ({
        ...professors,
        [classNumber]: professorsForSection.map((p) => new ProfessorData(p)),
      }),
      {} as { [classNumber: string]: ProfessorData[] },
    );
  }

  private crawlSection(content: string): Mutable<Partial<SectionData>> {
    const $ = load(content);
    const section: Mutable<Partial<SectionData>> = {};

    section.courseNumber = this.crawlCourseNumber($);
    section.category = this.crawlClassCategory($);
    section.classNumber = this.crawlClassNumber($);
    const units = this.crawlUnits($);
    section.minUnit = units.minUnit;
    section.maxUnit = units.maxUnit;
    section.components = this.crawlComponents($);
    section.room = this.crawlRoom($);
    section.time = SectionTimeData.parseSectionTimeString(this.crawlTime($));
    return section;
  }

  private crawlCourseNumber($: cheerio.Root) {
    const temp = trim($('#DERIVED_CLSRCH_DESCR200').text());
    return trim(temp.substr(0, temp.indexOf('-') - 1));
  }

  private crawlClassCategory($: cheerio.Root) {
    let temp = trim($('#DERIVED_CLSRCH_SSS_PAGE_KEYDESCR').text());
    temp = trim(temp.substr(temp.lastIndexOf('|') + 2));
    const spaceIdx = temp.indexOf(' ');
    if (spaceIdx >= 0 && !isNaN(Number(temp.substring(spaceIdx + 1, 2)))) {
      temp = trim(temp.substring(0, spaceIdx));
    }
    return temp;
  }

  private crawlClassNumber($: cheerio.Root) {
    return trim($('#SSR_CLS_DTL_WRK_CLASS_NBR').text());
  }

  private crawlUnits($: cheerio.Root) {
    const temp = $('#SSR_CLS_DTL_WRK_UNITS_RANGE').text();

    if (!temp) {
      return {
        minUnit: 0,
        maxUnit: 0,
      };
    } else if (temp.includes('-')) {
      return {
        minUnit: parseFloat(trim(temp.substr(0, temp.indexOf('-')))),
        maxUnit: parseFloat(trim(temp.substr(temp.indexOf('-') + 1))),
      };
    } else {
      return {
        minUnit: parseFloat(trim(temp)),
        maxUnit: parseFloat(trim(temp)),
      };
    }
  }

  private crawlComponents($: cheerio.Root) {
    const components: string[] = [];
    for (let i = 0; $('#SSR_CLS_DTL_WRK_DESCR\\$' + i).length !== 0; i++) {
      components.push(trim($('#SSR_CLS_DTL_WRK_DESCR\\$' + i).text()));
    }
    return components;
  }

  private crawlCareer($: cheerio.Root) {
    return trim($('#PSXLATITEM_XLATLONGNAME\\$33\\$').text());
  }

  private crawlRoom($: cheerio.Root) {
    return trim($('#MTG_LOC\\$0').text());
  }

  private crawlTime($: cheerio.Root) {
    return trim($('#MTG_SCHED\\$0').text());
  }
}
