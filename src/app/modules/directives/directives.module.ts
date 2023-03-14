import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkuInputDirective } from '../../directives/sku-input.directive';
import { ControlStatusDirectiveDirective } from '../../directives/control-status-directive.directive';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';
import { CashOnlyDirective } from '../../directives/cash-only.directive';
import { DosDecimalesPipe } from '../../pipes/dos-decimales.pipe';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { DomChangeDirective } from '../../directives/dom-change.directive';
import { NumeroAletrasPipe } from '../../pipes/numero-aletras.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SkuInputDirective,
    ControlStatusDirectiveDirective,
    FocusTicketRowDirective,
    AutofocusDirective,
    OnlyNumbersDirective,
    CashOnlyDirective,
    DosDecimalesPipe,
    NumeroAletrasPipe,
    ModalFocusDirective,
    DomChangeDirective
  ],
  declarations: [
    SkuInputDirective,
    ControlStatusDirectiveDirective,
    FocusTicketRowDirective,
    AutofocusDirective,
    OnlyNumbersDirective,
    CashOnlyDirective,
    DosDecimalesPipe,
    NumeroAletrasPipe,
    ModalFocusDirective,
    DomChangeDirective
  ]
})
export class DirectivesModule {
}
