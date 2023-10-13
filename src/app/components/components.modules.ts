import { CommonModule } from "@angular/common";
import { ForoComponent } from "./foro/foro.component";
import { MisclasesComponent } from "./misclases/misclases.component";
import { MisdatosComponent } from "./misdatos/misdatos.component";
import { QrComponent } from "./qr/qr.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';


@NgModule ({
    declarations: [
        QrComponent,
        MisclasesComponent,
        MisdatosComponent,
        ForoComponent,
        QrComponent,
    ],
    imports: [
        CommonModule, IonicModule, FormsModule
    ],
    exports: [
        QrComponent,
        MisclasesComponent,
        ForoComponent,
        MisdatosComponent,
        QrComponent
    ]
})
export class ComponentsModule {}