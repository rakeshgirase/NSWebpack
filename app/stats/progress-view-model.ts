import { EventData, Observable } from "tns-core-modules/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { IResult } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";

export class ProgressViewModel extends Observable {

    constructor() {
        super();
    }

    get results() {
        const results: Array<IResult> = PersistenceService.getInstance().getResult();

        return results.reverse();
    }

    get overall() {
        const results: Array<IResult> = PersistenceService.getInstance().getResult();
        let correct: number = 0;
        let total: number = 0;
        const totalExams: number = results.length;
        results.forEach((re) => {
            correct += re.correct;
            total += re.total;
        });
        const overall: Array<IResult> = [];
        const percentage = total === 0 ? 0 : Math.floor(correct * 100 / total);
        const percentageString: string = String(percentage) + "%";
        const result: IResult = {
            date: QuizUtil.getDateString(new Date()),
            correct,
            total,
            totalExams,
            percentage: percentageString,
            pass: percentage > 70
        };
        overall.push(result);

        return result;
    }

    resetExamStats() {
        PersistenceService.getInstance().resetMockExamStats();
    }
}
