import { HttpService } from "~/services/http.service";
import { IQuestion } from "~/shared/questions.model";
import * as TKUnit from "../TKUnit";

describe("Http Service", () => {
    /*it("Http Service getQuestions loads 200 Questions", async () => {
        return HttpService.getInstance().getQuestions<Array<IQuestion>>().then((questions: Array<IQuestion>) => {
            TKUnit.assert(questions.length === 200, "Default Loaded Questions expected 200 but " + questions.length);
        });
    });*/
});
