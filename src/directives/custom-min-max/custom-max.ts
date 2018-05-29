import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS,  FormControl } from '@angular/forms';

@Directive({
  selector: '[customMax][formControlName],[customMax][formControl],[customMax][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMaxDirective, multi: true}]
})
export class CustomMaxDirective {

  constructor() {
  }
  @Input()
  customMax: number;
  
  validate(c: FormControl): {[key: string]: any} {
    let v = parseInt(c.value);
    if(this.customMax){
      return ( v > this.customMax)? {"customMax": true} : null;
    }
  }
}
