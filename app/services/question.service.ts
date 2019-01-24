/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "application-settings";
import * as appVersion from "nativescript-appversion";
import * as Toast from "nativescript-toast";
import { isAndroid } from "platform";
import { Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "utils/utils";
import { ConnectionService } from "~/shared/connection.service";
import { IQuestion } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import { HttpService } from "./http.service";
import { PersistenceService } from "./persistence.service";
import { QuestionUtil } from "./question.util";

export class QuestionService {

    static getInstance(): QuestionService {
        return QuestionService._instance;
    }

    private static _instance: QuestionService = new QuestionService();

    private questions: Array<IQuestion> = [];
    private _checked: boolean = false;

    getNextQuestion(): Promise<IQuestion> {
        return this.getFirebaseQuestion();
    }

    handleWrongQuestions(question: IQuestion) {
        const wrongQuestions: Array<IQuestion> = PersistenceService.getInstance().readWrongQuestions();
        if (QuestionUtil.isWrong(question)) {
            this.add(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        } else {
            this.remove(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        }
    }

    handleFlagQuestion(question: IQuestion) {
        const flaggedQuestions: Array<IQuestion> = PersistenceService.getInstance().readFlaggedQuestions();
        if (!this.containsQuestion(question, flaggedQuestions)) {
            Toast.makeText("Added to flagged questions.", "long").show();
            question.flagged = true;
            flaggedQuestions.push(question);
            PersistenceService.getInstance().addQuestions(constantsModule.FLAG_QUESTION, flaggedQuestions);
        } else {
            question.flagged = false;
            this.remove(constantsModule.FLAG_QUESTION, question, flaggedQuestions);
            Toast.makeText("Question is removed from flagged.", "long").show();
        }
    }

    add(key: string, question: IQuestion, questions: Array<IQuestion>) {
        if (!this.containsQuestion(question, questions)) {
            questions.push(question);
            PersistenceService.getInstance().addQuestions(key, questions);
        }
    }

    remove(key: string, question: IQuestion, questions: Array<IQuestion>) {
        const filteredRecords: Array<IQuestion> = questions.filter((item) => item.number !== question.number);
        PersistenceService.getInstance().addQuestions(key, filteredRecords);
    }

    update(question: IQuestion) {
        const url = constantsModule.FIREBASE_URL + "suggestions.json";
        const questionWithDate = {question, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, questionWithDate);
    }

    updateCorrectOption(question: IQuestion) {
        console.log("updateCorrectOption", question);
        const url = constantsModule.FIREBASE_URL + "updateOption.json";
        const questionWithDate = {question, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, questionWithDate);
    }

    getFirebaseQuestion(): Promise<IQuestion> {
        this.checkQuestionUpdate();
        if (this.questions.length !== 0) {
            return this.readFromQuestions();
        } else {
            if (this.hasQuestions()) {
                this.questions = this.readQuestions();

                return this.readFromQuestions();
            } else {
                if (!ConnectionService.getInstance().isConnected()) {
                    dialogs.alert("Please connect to internet so that we can prepare quality questions for you!!");
                } else {
                    this.readAllQuestions(-1);
                }
            }
        }

        return this.getNextQuestionFromCache();
    }

    isFlagged(question: IQuestion): boolean {
        return this.containsQuestion(question, PersistenceService.getInstance().readFlaggedQuestions());
    }

    readAllQuestions(latestQuestionVersion): Promise<void> {

        return HttpService.getInstance().getQuestions<Array<IQuestion>>().then((questions: Array<IQuestion>) => {
            const oldQuestionSize: number = this.readQuestionSize();
            this.questions = questions;
            this.saveQuestions(questions);
            if (PersistenceService.getInstance().isPremium()) {
                return HttpService.getInstance().getPremiumQuestions<Array<IQuestion>>()
                    .then((premiumQuestions: Array<IQuestion>) => {
                        const updatedQuestions: Array<IQuestion> = questions.concat(premiumQuestions);
                        this.saveQuestions(updatedQuestions);
                    });
            } else if (latestQuestionVersion > 6) {
                if (oldQuestionSize > questions.length) {
                    return this.findPremiumRange(questions.length + 1, oldQuestionSize).
                    then(() => console.log("Loaded Premium Range", questions.length + 1, oldQuestionSize),
                        (error) => console.error("Error loading premium range", error));
                }
            }
        });
    }

    findPremiumRange(startAt: number, endAt: number): Promise<void> {
        return HttpService.getInstance().findPremiumRange<Array<IQuestion>>("number", startAt, endAt)
            .then((map: any) => {
                const newQuestions: Array<IQuestion> = Object.keys(map).map((key) => map[key]);
                let questions: Array<IQuestion> = this.readQuestions();
                questions = questions.concat(newQuestions);
                this.saveQuestions(questions);
            }).catch((e) => console.error("Error Loading Premium Range Questions...", e));
    }

    saveQuestions(questions: Array<IQuestion>): void {
        const json: string = JSON.stringify(questions);
        appSettings.setString(constantsModule.QUESTIONS, json);
        appSettings.setNumber(constantsModule.QUESTIONS_SIZE, questions.length);
    }

    saveQuestionVersion(questionVersion: number): void {
        appSettings.setNumber(constantsModule.QUESTION_VERSION, questionVersion);
    }

    readQuestionVersion(): number {
        return appSettings.hasKey(constantsModule.QUESTION_VERSION)
            ? appSettings.getNumber(constantsModule.QUESTION_VERSION) : 0;
    }

    readQuestionSize(): number {
        return appSettings.hasKey(constantsModule.QUESTIONS_SIZE)
            ? appSettings.getNumber(constantsModule.QUESTIONS_SIZE) : 0;
    }

    readQuestions(): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasQuestions() ? JSON.parse(appSettings.getString(constantsModule.QUESTIONS)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    hasQuestions(): boolean {
        return appSettings.hasKey(constantsModule.QUESTIONS);
    }

    hasSize(): boolean {
        return appSettings.hasKey(constantsModule.QUESTIONS_SIZE);
    }

    allQuestionsAsked(alreadyAsked: number): boolean {
        return this.hasSize()
            ? alreadyAsked < appSettings.getNumber(constantsModule.QUESTIONS_SIZE)
            : alreadyAsked > 433;
    }

    private containsQuestion(search: IQuestion, questions: Array<IQuestion>): boolean {
        let contains = false;
        questions.forEach((question) => {
            if (question.number === search.number) {
                contains = true;
            }
        });

        return contains;
    }

    private getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));

        return randomNumber;
    }

    private checkQuestionUpdate(): void {
        this._checked = false;
        if (!this._checked) {
            HttpService.getInstance().findLatestQuestionVersion().then((latestQuestionVersion: string) => {
                if (this.readQuestionVersion() < Number(latestQuestionVersion)) {
                // if (-1 < Number(latestQuestionVersion)) {
                    this.readAllQuestions(Number(latestQuestionVersion));
                    this.saveQuestionVersion(Number(latestQuestionVersion));
                }
            });
            this.checkForApplicationUpdate();
            this._checked = true;
        }
    }

    private readFromQuestions(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            const randomNumber = this.getRandomNumber(this.questions.length);
            const question = JSON.parse(JSON.stringify(this.questions[randomNumber]));
            question.flagged = this.isFlagged(question);
            resolve(question);
        });
    }

    private getNextQuestionFromCache(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            resolve(QUESTIONS[this.getRandomNumber(QUESTIONS.length)]);
        });
    }

    private checkForApplicationUpdate() {
        if (!this._checked) {
            HttpService.getInstance().checkPlayStoreVersion().then((playStoreVersion: string) => {
                appVersion.getVersionCode().then((versionCode: string) => {
                    if (Number(playStoreVersion) > Number(versionCode)) {
                        dialogs.confirm({
                            title: "Notification",
                            message: "A latest version of NS Webpack is now available on play store.",
                            okButtonText: "Update",
                            cancelButtonText: "Remind me Later"
                        }).then((proceed) => {
                            if (proceed) {
                                if (isAndroid) {
                                    utils.openUrl("https://play.google.com/store/apps/details?" +
                                        "id=com.tns.nswebpack");
                                }
                            }
                        });
                    }
                });
            });
        }

    }
}

const QUESTIONS: Array<IQuestion> = [
    {
        description: "Why PROC FSLIST is used?",
        explanation: "The FSLIST procedure enables you to browse external files " +
        "that are not SAS data sets within a SAS session. " +
        "Because the files are displayed in an interactive window, " +
        "the procedure provides a highly convenient mechanism for examining file contents.",
        number: "-1",
        options: [{
            correct: false,
            description: "A. to write to an external file",
            tag: "A"
        }, {
            correct: true,
            description: "B. to read from an external file",
            tag: "B"
        }, {
            correct: false,
            description: "C. to sort by date",
            tag: "C"
        }, {
            correct: false,
            description: "D. not a valid statement",
            tag: "D"
        }]
    }
];
