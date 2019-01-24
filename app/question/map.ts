import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { GridItemEventData } from "nativescript-grid-view";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "~/shared/navigation";
import { IState } from "~/shared/questions.model";
import { MapViewModel } from "./map-view-model";

let page: Page;
let state: IState;
let vm: MapViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const pg: any = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}

export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    state = <IState> page.navigationContext;
    vm = new MapViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function gridViewItemTap(args: GridItemEventData) {
    vm.gridViewItemTap(args);
}

export function all() {
    vm.all();
}

export function answered() {
    vm.answered();
}

export function skipped() {
    vm.skipped();
}

export function tbd() {
    vm.tbd();
}
