import { Controller, Get, HttpCode, Inject, Query } from '@nestjs/common';
import { SearchKey } from '@rmp/dto/SearchKey';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  @Inject()
  private readonly searchService: SearchService;

  @Get('')
  @HttpCode(200)
  async search(@Query() searchKeyDto: SearchKey) {
    return await this.searchService.search(searchKeyDto);
  }

  @Get('/search-fields')
  @HttpCode(200)
  getSearchFields() {
    return this.searchService.getSearchFields();
  }

  @Get('/majors')
  @HttpCode(200)
  async getMajors() {
    return await this.searchService.getMajors();
  }
}
