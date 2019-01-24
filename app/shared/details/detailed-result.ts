import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as ListView from "tns-core-modules/ui/list-view";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "../navigation";
import { IState } from "../questions.model";
import { DetailedResultViewModel } from "./detailed-result-view-model";

let page: Page;
let vm: DetailedResultViewModel;
let list: ListView.ListView;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const pg = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}

export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    list = page.getViewById("listView");
    const state: IState = <IState> page.navigationContext;
    vm = new DetailedResultViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function all(): void {
    vm.all();
    list.scrollToIndex(0);
}

export function correct(): void {
    vm.correct();
    list.scrollToIndex(0);
}

export function incorrect(): void {
    vm.incorrect();
    list.scrollToIndex(0);
}

export function skipped(): void {
    vm.skipped();
    list.scrollToIndex(0);
}
