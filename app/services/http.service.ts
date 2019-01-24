import { Observable } from "tns-core-modules/data/observable";
import { IQuestion } from "~/shared/questions.model";
import * as constantsModule from "../shared/constants";

const httpModule = require("http");

export class HttpService {

    static getInstance(): HttpService {
        return HttpService._instance;
    }

    private static _instance: HttpService = new HttpService();

    private questions: Array<IQuestion> = [];

    private constructor() {

    }

    showAds(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "ads.json";

        return httpModule.getString(url);
    }

    getQuestions<T>(): Promise<T> {
        const url = constantsModule.FIREBASE_URL + "questions.json";

        return httpModule.getJSON(url);
    }

    getPremiumQuestions<T>(): Promise<T> {
        const url = constantsModule.FIREBASE_URL + "premium.json";

        return httpModule.getJSON(url);
    }

    findLatestQuestionVersion(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "questionVersion.json";

        return httpModule.getString(url);
    }

    findPremiumQuestionVersion(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "premiumVersion.json";

        return httpModule.getString(url);
    }

    findPremiumRange<T>(orderBy: string, startAt: number, endAt: number): Promise<T> {
        const url = constantsModule.FIREBASE_URL + "premium.json" + "?orderBy=\"" + orderBy
            + "\"&startAt=" + startAt + "&endAt=" + endAt;

        return httpModule.getJSON(url);
    }

    checkPlayStoreVersion(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "playStoreVersion.json";

        return httpModule.getString(url);
    }

    checkTotalQuestions(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "totalQuestions.json";

        return httpModule.getString(url);
    }

    httpPost(url: string, data: any) {
        httpModule.request({
            url,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        });
    }
}
