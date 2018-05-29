import { NgModule } from '@angular/core';
import { CustomMinDirective } from './custom-min-max/custom-min';
import { CustomMaxDirective } from './custom-min-max/custom-max';
@NgModule({
	declarations: [
    
    CustomMaxDirective,CustomMinDirective],
	imports: [],
	exports: [
    
    CustomMaxDirective,CustomMinDirective]
})
export class DirectivesModule {}
