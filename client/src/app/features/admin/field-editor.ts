import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, icons } from './editor-fields';
@Component({
  selector: 'app-field-editor', imports: [FormsModule],
  template: `
    @for (field of fields(); track field.key) {
      <div class="field">
        <label [for]="prefix() + '-' + field.key">{{ field.label }}{{ field.required ? ' *' : '' }}</label>
        @switch (field.type) {
          @case ('boolean') { <input [id]="prefix() + '-' + field.key" type="checkbox" [ngModel]="value()[field.key]" (ngModelChange)="set(field, $event)" /> }
          @case ('number') { <input [id]="prefix() + '-' + field.key" type="number" min="0" [ngModel]="value()[field.key]" (ngModelChange)="set(field, $event)" /> }
          @case ('textarea') { <textarea [id]="prefix() + '-' + field.key" [ngModel]="value()[field.key]" (ngModelChange)="set(field, $event)"></textarea> }
          @case ('list') { <textarea [id]="prefix() + '-' + field.key" [ngModel]="(value()[field.key] || []).join('\n')" (ngModelChange)="set(field, $event)"></textarea> }
          @case ('icon') { <select [id]="prefix() + '-' + field.key" [ngModel]="value()[field.key]" (ngModelChange)="set(field, $event)"><option value="">No icon</option>@for (icon of icons; track icon) { <option [value]="icon">{{ icon }}</option> }</select> }
          @default { <input [id]="prefix() + '-' + field.key" type="text" [ngModel]="value()[field.key]" (ngModelChange)="set(field, $event)" /> }
        }
      </div>
    }
  `,
})
export class FieldEditor {
  readonly fields = input.required<Field[]>();
  readonly value = input.required<Record<string, any>>();
  readonly prefix = input.required<string>();
  readonly changed = output<void>();
  protected readonly icons = icons;
  protected set(field: Field, next: any): void {
    this.value()[field.key] = field.type === 'list' ? String(next).split('\n') : next;
    this.changed.emit();
  }
}
