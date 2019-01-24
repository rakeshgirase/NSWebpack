/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "application-settings";
import { Observable } from "tns-core-modules/data/observable";
import { FLAG_QUESTION, PRACTICE_STATS, PREMIUM, RESULT, WRONG_QUESTION } from "~/shared/constants";
import { IPracticeStats, IQuestion, IResult } from "~/shared/questions.model";

export class PersistenceService {

    static getInstance(): PersistenceService {
        return PersistenceService._instance;
    }

    private static _instance: PersistenceService = new PersistenceService();

    resetAllStats(): any {
        this.resetPracticeStats();
        this.resetMockExamStats();
    }

    resetPracticeStats() {
        appSettings.remove(PRACTICE_STATS);
    }

    resetMockExamStats(): void {
        appSettings.remove(RESULT);
    }

    readPracticeStats(): IPracticeStats {
        return appSettings.hasKey(PRACTICE_STATS) ? JSON.parse(appSettings.getString(PRACTICE_STATS))
            : {attempted: new Array<number>(), correct: new Array<number>()};
    }

    readWrongQuestions(): Array<IQuestion> {
        return this.readQuestions(WRONG_QUESTION);
    }

    readFlaggedQuestions(): Array<IQuestion> {
        return this.readQuestions(FLAG_QUESTION);
    }

    addQuestions(key: string, questions: Array<IQuestion>) {
        appSettings.setString(key, JSON.stringify(questions));
    }

    getResult(): Array<IResult> {
        let items: Array<IResult> = [];
        if (appSettings.hasKey(RESULT)) {
            items = JSON.parse(appSettings.getString(RESULT));
        }

        return items;
    }

    saveResult(result: IResult): void {
        if (appSettings.hasKey(RESULT)) {
            const items: Array<IResult> = JSON.parse(appSettings.getString(RESULT));
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        } else {
            const items: Array<IResult> = [];
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        }
    }

    savePracticeStats(practiceStats: IPracticeStats) {
        appSettings.setString(PRACTICE_STATS, JSON.stringify(practiceStats));
    }

    isPremium(): boolean {
        return appSettings.hasKey(PREMIUM);
    }

    private readQuestions(key: string): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasBookmarkedQuestions(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    private hasBookmarkedQuestions(key: string): boolean {
        return appSettings.hasKey(key);
    }
}
