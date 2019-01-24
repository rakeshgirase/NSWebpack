import { IQuestion } from "~/shared/questions.model";

export class QuestionUtil {

    static isCorrect(question: IQuestion) {
        let isCorrect = false;
        for (const option of question.options) {
            if (option.selected && option.correct) {
                isCorrect = true;
                break;
            }
        }

        return isCorrect;
    }

    static isSkipped(question: IQuestion) {
        let isSkipped = true;
        for (const option of question.options) {
            if (option.selected) {
                isSkipped = false;
                break;
            }
        }

        return isSkipped;
    }

    static isWrong(question: IQuestion) {
        return !this.isSkipped(question) && !this.isCorrect(question);
    }

    static isOptionUpdated(question: IQuestion) {
        return !this.isCorrect(question);
    }

    private constructor() {}
}
