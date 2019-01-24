import * as appVersion from "nativescript-appversion";
import { EventData, Observable } from "tns-core-modules/data/observable";

import { ObservableProperty } from "~/shared/observable-property-decorator";
import { SelectedPageService } from "~/shared/selected-page-service";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer custom component view model.
*************************************************************/
export class MyDrawerViewModel extends Observable {
    @ObservableProperty() selectedPage: string;
    @ObservableProperty() version: string;

    /* ***********************************************************
    * Use the MyDrawer view model constructor to initialize the properties data values.
    *************************************************************/
    constructor(selectedPage: string) {
        super();

        this.selectedPage = selectedPage;
        SelectedPageService.getInstance().selectedPage$
            .subscribe((sp: string) => {
                this.selectedPage = sp;
            });
        this.findVersion();
    }

    findVersion() {
        appVersion.getVersionName().then((version: string) => {
            this.version = "v " + version;
        });
    }
}
