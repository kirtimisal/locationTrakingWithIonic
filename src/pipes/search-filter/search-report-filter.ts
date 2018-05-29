import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'searchPartyList',
  })
  export class SearchReportFilter implements PipeTransform {
    transform(items: any[], field: string, value: string) {
      if (items && value) {
        return items.filter((item) => {
          // console.log(JSON.stringify(items))
          if (field) {
            return item[field].toLowerCase().indexOf(value.toLowerCase()) > -1;
          } else {
            return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
          }
        });
      } else {
        return items
      }
  
    }
  }
  