import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid, screen } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as ButtonModule from "tns-core-modules/ui/button";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { SwipeDirection } from "tns-core-modules/ui/gestures";
import { Label } from "tns-core-modules/ui/label";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { QuestionViewModel } from "~/question/question-view-model";
import { AdService } from "~/services/ad.service";
import { ConnectionService } from "~/shared/connection.service";
import { SelectedPageService } from "~/shared/selected-page-service";
import { WrongQuestionModel } from "./wrong-question-model";

let vm: WrongQuestionModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let defaultExplanation: Label;
let explanationHeader: Label;
let _page: any;
let scrollView: ScrollView;
let banner: any;
let loaded: boolean = false;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    resetBanner();
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
    loaded = false;
}
/* ***********************************************************
* Use the "navigatingTo" handler to initialize the page binding context.
*************************************************************/
export function navigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "navigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/

    if (args.isBackNavigation) {
        return;
    }
    _page = <Page>args.object;
    vm = new WrongQuestionModel();
    _page.bindingContext = vm;
    _page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    banner = _page.getViewById("banner");
    optionList = _page.getViewById("optionList");
    suggestionButton = _page.getViewById("suggestionButton");
    explanationHeader = _page.getViewById("explanationHeader");
    defaultExplanation = _page.getViewById("defaultExplanation");
    scrollView = _page.getViewById("scrollView");
    SelectedPageService.getInstance().updateSelectedPage("wrong");
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    }
}

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton && scrollView) {
        const locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function flag(): void {
    vm.flag();
}

export function previous(): void {
    if (!vm) {
        vm = new WrongQuestionModel();
    }
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function next(): void {
    if (AdService.getInstance().showAd && !ConnectionService.getInstance().isConnected()) {
        dialogs.alert("Please connect to internet so that we can fetch next question for you!");
    } else {
        vm.next();
        if (AdService.getInstance().showAd && !loaded) {
            AdService.getInstance().showSmartBanner().then(
                () => {
                    loaded = true;
                    banner.height = AdService.getInstance().getAdHeight() + "dpi";
                },
                (error) => {
                    resetBanner();
                }
            );
        }
        if (scrollView) {
            scrollView.scrollToVerticalOffset(0, false);
        }
    }
}

export function showAnswer(): void {
    vm.showAnswer();
    optionList.refresh();
    // moveToLast();
}

export function selectOption(args): void {
    vm.showAnswer();
    vm.selectOption(args);
    optionList.refresh();
    // moveToLast();
}
