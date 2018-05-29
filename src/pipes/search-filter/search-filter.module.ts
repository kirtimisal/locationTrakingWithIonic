import { NgModule } from '@angular/core';
import { SearchFilterPipe } from './search-filter';
import { SearchDataFilter } from './search-data-filter';
import { SearchReportFilter } from './search-report-filter';

@NgModule({
    declarations: [
        SearchDataFilter, SearchFilterPipe, SearchReportFilter
    ],
    imports: [],
    exports: [
        SearchDataFilter, SearchFilterPipe, SearchReportFilter
    ]
})
export class SearchFilterPageModule { }