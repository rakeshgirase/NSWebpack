import { android, AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { Repeater } from "tns-core-modules/ui/repeater";
import { QuestionViewModel } from "~/question/question-view-model";
import { IState } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";
import { EditQuestionViewModel } from "./edit-question-model";

let vm: EditQuestionViewModel;
let state: IState;
let optionList: Repeater;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}
export function navigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "navigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    optionList = page.getViewById("optionList");
    state = <IState> page.navigationContext;
    vm = new EditQuestionViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function save(): void {
    vm.save();
    navigationModule.goBack();
}

export function cancel(): void {
    navigationModule.goBack();
}

export function selectOption(args): void {
    vm.selectOption(args);
    optionList.refresh();
}
