import { GridItemEventData } from "nativescript-grid-view";
import * as Toast from "nativescript-toast";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { QuestionUtil } from "~/services/question.util";
import { SettingsService } from "~/services/settings.service";
import { IMap, IState } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";

const ALL: string = "all";
const SKIPPED: string = "skipped";
const TBD: string = "tbd";

export class MapViewModel extends Observable {

    get totalQuestions() {
        return this._state.questions.length;
    }

    get state() {
        return this._state;
    }

    get message() {
        return this._message;
    }
    allItems: Array<IMap> = [];
    items: Array<IMap> = [];
    private _state: IState;
    private _message: string;

    constructor(state: IState) {
        super();
        this._state = state;
        for (let loop = 0; loop < state.totalQuestions; loop++) {
            let status: string = ALL;
            if (state.questions.length > loop) {
                if (QuestionUtil.isSkipped(state.questions[loop])) {
                    status = SKIPPED;
                }
            } else {
                status = TBD;
            }
            this.allItems.push({value: (loop + 1), status});
        }
        this.all();
    }

    gridViewItemTap(args: GridItemEventData) {
        const item = this.items[args.index];
        if (this.items.length > args.index && this.items[args.index].status !== TBD) {
            this.state.questionNumber = item.value;
            SettingsService.getInstance().saveCache(this.state.mode, this.state);
            navigationModule.toPage("question/" + this.state.mode.toLowerCase());
        } else {
            Toast.makeText("Question " + item.value + " is yet to be asked." , "short").show();
        }
    }

    all() {
        this.items = this.allItems;
        this.publish();
    }

    answered() {
        this._message = "Answered";
        this.items = this.allItems.filter((item) => item.status !== SKIPPED && item.status !== TBD);
        this.publish();
    }

    skipped() {
        this._message = "Skipped";
        this.items = this.allItems.filter((item) => item.status === SKIPPED);
        this.publish();
    }

    tbd() {
        this._message = "remaining";
        this.items = this.allItems.filter((item) => item.status === TBD);
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "items",
            value: this.items
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "message",
            value: this._message
        });
    }
}
