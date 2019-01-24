import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "~/shared/navigation";
import { SelectedPageService } from "~/shared/selected-page-service";
import { ProgressViewModel } from "./progress-view-model";

let page: Page;
let vm: ProgressViewModel;

export function onPageLoaded(args: EventData): void {
    const pg = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    onDrawerButtonTap(args);
    args.cancel = true;
}

export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    vm = new ProgressViewModel();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("stats");
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function startTest(args: EventData) {
    navigationModule.toPage("question/mock");
}

export function showChart(args: EventData) {
    navigationModule.toPage("stats/chart");
}

export function resetExamStats(): void {
    dialogs.confirm("Are you sure you want to clear your test statistics?").then((proceed) => {
        if (proceed) {
            vm.resetExamStats();
            navigationModule.toPage("stats/progress");
            Toast.makeText("Cleared Exam Stats!!!", "long").show();
        }
    });
}
