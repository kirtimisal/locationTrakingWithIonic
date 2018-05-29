import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: string) {
    if (items && value) {
      return items.filter((item) => {
        if (field) {
          if (item.code) {
            return item[field].toLowerCase().indexOf(value.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(value.toLowerCase()) > -1;
          } else {
            return item[field].toLowerCase().indexOf(value.toLowerCase()) > -1;
          }

        } else {
          return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }

      });
    } else {
      return items
    }

  }
}



