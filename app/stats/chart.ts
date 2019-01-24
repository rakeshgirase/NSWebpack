import * as orientationModule from "nativescript-screen-orientation";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { EventData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { QuestionViewModel } from "~/question/question-view-model";
import { ChartViewModel } from "./chart-view-model";

export function onPageLoaded(args) {
    const page = args.object;
    orientationModule.setCurrentOrientation("landscape", () => console.log("Changed"));
    page.bindingContext = new ChartViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function onNavigatedFrom(args) {
    orientationModule.orientationCleanup();
}
