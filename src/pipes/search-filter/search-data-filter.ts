import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'searchDataFilter',
  })
  export class SearchDataFilter implements PipeTransform {
    transform(items: any[], field: string, value: string) {
      if (items && value) {
        return items.filter((item) => {
          if (field) {
            if(!item.entityCode){
              item.entityCode="";
            }
            if(!item.accName){
              item.accName="";
            }
            if (!item.refNo) {
              item.refNo = "";
            }
            if(!item.vrDate){
              item.vrDate="";
            }
            return item[field].toLowerCase().indexOf(value.toLowerCase()) > -1 || item["refNo"].toLowerCase().indexOf(value.toLowerCase()) > -1 || item["entityCode"].toLowerCase().indexOf(value.toLowerCase()) > -1 || item["accName"].toLowerCase().indexOf(value.toLowerCase()) > -1 || item["vrDate"].toLowerCase().indexOf(value.toLowerCase()) > -1;
          } else {
            return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
          }
        });
      } else {
        return items
      }
  
    }
  }