/**
 * Created by rakesh on 15-Nov-2017.
 */
import { Observable } from "tns-core-modules/data/observable";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import { HttpService } from "./http.service";

export class GeneralService {

    static getInstance(): GeneralService {
        return GeneralService._instance;
    }

    private static _instance: GeneralService = new GeneralService();

    logError(error: any) {
        const url = constantsModule.FIREBASE_URL + "error.json";
        const errorWithDate = {error: error.message, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, errorWithDate);
    }
}
