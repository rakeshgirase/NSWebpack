import { EventData, Observable } from "tns-core-modules/data/observable";
import { QuestionUtil } from "~/services/question.util";
import { IQuestion, IState } from "../questions.model";

export class DetailedResultViewModel extends Observable {

    get size() {
        return this._size;
    }

    get message() {
        return this._message;
    }

    get questions() {
        return this._questions;
    }
    private _questions: Array<IQuestion> = [];
    private allQuestions: Array<IQuestion>;
    private _message: string;
    private _size: number;
    private state: IState;

    constructor(state: IState) {
        super();
        this.state = state;
        this.allQuestions = state.questions;
        this.all();
    }

    all(): void {
        this._message = "All";
        this.allQuestions.forEach((question) => {
            question.skipped = QuestionUtil.isSkipped(question);
        });
        this._questions = this.allQuestions;
        this._size = this._questions.length;
        this.publish();
    }

    correct(): void {
        this._message = "Correct";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isCorrect(question));
        this._size = this._questions.length;
        this.publish();
    }

    incorrect(): void {
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isWrong(question));
        this._message = "Incorrect";
        this._size = this._questions.length;
        this.publish();
    }

    skipped(): void {
        this._message = "Skipped";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isSkipped(question));
        this._size = this._questions.length;
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questions",
            value: this._questions
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "size",
            value: this._size
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "message",
            value: this._message
        });
    }
}
