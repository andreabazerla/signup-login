import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';

const modules = [
  MatFormFieldModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
