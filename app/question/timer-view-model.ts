import { clearInterval, setInterval, setTimeout } from "timer";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { SettingsService } from "~/services/settings.service";
import { IState } from "~/shared/questions.model";
import { QuestionViewModel } from "./question-view-model";

export class TimerViewModel extends QuestionViewModel {
    private _seconds: number = 0;
    private _minutes: number = 5;
    private _time: string = "";
    private clock: any;

    constructor(mode: string) {
        super(mode);
        this._minutes = this.state.time;
        this.startTimer();
    }

    previous(): void {
        super.goPrevious();
    }

    publishTime() {
        this.notify({object: this, eventName: Observable.propertyChangeEvent, propertyName: "time", value: this._time});
    }

    saveAndPublish(mode: string, state: IState) {
        state.time = this._minutes;
        SettingsService.getInstance().saveCache(mode, state);
        this.publish();
    }

    startTimer() {
        this.clock = setInterval(() => {
            if (this._seconds <= 0) {
                if (--this._minutes === -1) {
                    this._minutes = 0;
                    this.stopTimer();
                    this.showResult();
                } else {
                    this._seconds = 59;
                }
            } else {
                this._seconds--;
            }
            this._time = (("0" + this._minutes).slice(this._minutes > 99 ? -3 : -2)) + ":" + (("0" + this._seconds)
                .slice(-2)) + " MIN";
            this.publishTime();
        }, 1000);
    }

    stopTimer() {
        clearTimeout(this.clock);
    }

    get time() {
        return this._time;
    }
}
