import * as Toast from "nativescript-toast";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { QuestionService } from "~/services/question.service";
import { IOption, IQuestion, IState } from "~/shared/questions.model";
import {QuestionUtil} from "~/services/question.util";

export class EditQuestionViewModel extends Observable {

    get question() {
        return this._question;
    }

    get state() {
        return this._state;
    }
    private _state: IState;
    private _question: IQuestion;
    private _originalQuestion: IQuestion;
    private _originalQuestionString: string;

    constructor(state: IState) {
        super();
        this._originalQuestionString = JSON.stringify(state.questions[state.questionNumber - 1]);
        this._originalQuestion = JSON.parse(this._originalQuestionString);
        this._question = JSON.parse(this._originalQuestionString);
        this._state = state;
        this.publish();
    }

    save() {
        if (this._question && this._question.description && this._question.explanation) {
            console.log("this._question.description", this._question.description, "this._question.explanation", this._question.explanation);
            if (this._question.description !== "text" && this._question.explanation !== "text") {
                if (JSON.stringify(this._question) !== this._originalQuestionString) {
                    if (QuestionUtil.isOptionUpdated(this._question)) {
                        QuestionService.getInstance().updateCorrectOption(this._question);
                    } else if (this._question.description !== this._originalQuestion.description || this._question.explanation !== this._originalQuestion.explanation) {
                        if (this._question.description !== this._originalQuestion.description && this._question.explanation !== this._originalQuestion.explanation){
                            this._question.suggestionHint = "Both Updated";
                        } else if (this._question.description !== this._originalQuestion.description) {
                            this._question.suggestionHint = "Question Updated";
                        } else if (this._question.explanation !== this._originalQuestion.explanation) {
                            this._question.suggestionHint = "Explanation Updated";
                        }
                        QuestionService.getInstance().update(this._question);
                    }
                    Toast.makeText("Thanks a ton. Your changes will be reviewed and included asap.", "long")
                        .show();
                }
            } else {
                Toast.makeText("Ignored", "long").show();
            }
        }
    }

    selectOption(args: any) {
        const selectedOption: IOption = args.view.bindingContext;
        if (selectedOption.selected) {
            selectedOption.selected = false;
        } else {
            this.question.options.forEach((item, index) => {
                item.selected = item.tag === selectedOption.tag;
            });
        }
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "question",
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "state",
            value: this._state
        });
    }
}
