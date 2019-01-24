import * as appSettings from "application-settings";
import * as purchase from "nativescript-purchase";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { AdService } from "~/services/ad.service";
import { GeneralService } from "~/services/general.service";
import { QuestionService } from "~/services/question.service";
import * as constantsModule from "../shared/constants";

export class PremiumModel extends Observable {

    get item() {
        return this._item;
    }

    get loading() {
        return this._loading;
    }

    private _loading: boolean = true;
    private _item: any;

    constructor() {
        super();
        purchase.getProducts()
            .then((res) => {
                // this._items = res;
                this._item = res[0];
                this._loading = false;
                this.publish();
            })
            .catch((e) => {
                this._item.priceFormatted = "Oops..Please try again!!";
                this._loading = false;
            });
        this.publish();
    }

    restorePurchase() {
        try {
            purchase.restorePurchases();
        } catch (error) {
            GeneralService.getInstance().logError(error);
        }
    }

    pay() {
        try {
            purchase.buyProduct(this._item);
        } catch (error) {
            if (error.message.includes("Product already purchased")) {
                this.grantRights();
                dialogs.alert("You are a premium user now! You wont be charged twice as you've already paid earlier!");
            } else {
                GeneralService.getInstance().logError(error);
            }
        }
    }

    grantRights() {
        appSettings.setBoolean(constantsModule.PREMIUM, true);
        AdService.getInstance().showAd = false;
        QuestionService.getInstance().readAllQuestions(-1);
    }

    private publish() {
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "item", value: this._item
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "loading", value: this._loading
        });
    }
}
