import { PersistenceService } from "~/services/persistence.service";
import { IResult } from "~/shared/questions.model";

export class ChartViewModel {

    private _stats = [];

    constructor() {
        const results: Array<IResult> = PersistenceService.getInstance().getResult();
        results.forEach((result) =>
            this._stats.push({Percentage: +result.percentage.substr(0, result.percentage.length - 1)}));
    }

    get stats() {
        return this._stats;
    }
}
