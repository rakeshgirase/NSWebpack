import { EventData, Observable } from "tns-core-modules/data/observable";
import { SettingsService } from "~/services/settings.service";
import { ISetting } from "~/shared/questions.model";

export class SettingsViewModel extends Observable {

    get settings() {
        return this._settings;
    }
    private _settings: ISetting;

    constructor() {
        super();
        this._settings = SettingsService.getInstance().readSettings();
        this.publish();
    }

    save() {
        SettingsService.getInstance().saveSetting(this._settings);
    }

    private publish() {
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "settings", value: this._settings});
    }
}
