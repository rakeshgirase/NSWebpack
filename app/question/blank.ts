import { EventData } from "tns-core-modules/data/observable";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "../shared/navigation";

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function onPageLoaded(args) {
    navigationModule.route();
}
