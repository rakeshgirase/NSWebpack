import { QuestionService } from "~/services/question.service";
import * as constantsModule from "../../shared/constants";
import * as TKUnit from "../TKUnit";

describe("Question Service", () => {
    it("can be initialized without an initializer", () => {
        TKUnit.clearQuestionSize();
        TKUnit.clearKey(constantsModule.PREMIUM);
        const q: QuestionService = QuestionService.getInstance();
        TKUnit.assert(q.readQuestionSize() === 0, "Default Question Size is not 0 but is " +  q.readQuestionSize());
    });

    it("ReadAllQuestsion loads 200 questions for non premium users", () => {
        TKUnit.clearQuestionSize();
        TKUnit.clearKey(constantsModule.PREMIUM);
        const q: QuestionService = QuestionService.getInstance();
        TKUnit.assert(q.readQuestionSize() === 0 , "Default Question Size is not 0 but is " +  q.readQuestionSize());

        return q.readAllQuestions(-1).then(() => {
            console.log("q.readQuestionSize():", q.readQuestionSize());
            TKUnit.assert(q.readQuestionSize() === 200 , "Question Size should be 200 but is " +  q.readQuestionSize());
        });
    });

    it("Premium Users have access to all the questions", async () => {
        const value = 434;
        TKUnit.clearQuestionSize();
        TKUnit.saveBoolean(constantsModule.PREMIUM, true);
        const q: QuestionService = QuestionService.getInstance();
        TKUnit.assert(q.readQuestionSize() === 0 , "Default Question Size is not 0 but is " +  q.readQuestionSize());

        return q.readAllQuestions(4).then(() => {
            console.log("q.readQuestionSize():", q.readQuestionSize());
            TKUnit.assert(q.readQuestionSize() === value , "Question Size should be " + value + " but is "
                +  q.readQuestionSize());
        });
    });

    it("Rewarded Questions Loaded again with question update", async () => {
        const totalQuestions: number = 210;
        TKUnit.clearQuestionSize();
        TKUnit.clearKey(constantsModule.PREMIUM);
        const q: QuestionService = QuestionService.getInstance();
        TKUnit.assert(q.readQuestionSize() === 0 , "Default Question Size is not 0 but is " +  q.readQuestionSize());
        TKUnit.saveNumber(constantsModule.QUESTIONS_SIZE, totalQuestions);

        return q.readAllQuestions(4).then(() => {
            console.log("q.readQuestionSize():", q.readQuestionSize());
            TKUnit.assert(q.readQuestionSize() === totalQuestions , "Question Size should be " + totalQuestions
                + " but is " +  q.readQuestionSize());
        });
    });
});
