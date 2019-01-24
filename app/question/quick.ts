import { android, AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { SwipeDirection, SwipeGestureEventData } from "tns-core-modules/ui/gestures";
import * as ListView from "tns-core-modules/ui/list-view";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { AdService } from "~/services/ad.service";
import { ConnectionService } from "~/shared/connection.service";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as constantsModule from "../shared/constants";
import { QuestionViewModel } from "./question-view-model";

let vm: QuestionViewModel;
let optionList: ListView.ListView;
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

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    }
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
    SelectedPageService.getInstance().updateSelectedPage("quick");
    const page = <Page>args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    optionList = page.getViewById("optionList");
    scrollView = page.getViewById("scrollView");
    banner = page.getViewById("banner");
    vm = new QuestionViewModel(constantsModule.QUICK);
    page.bindingContext = vm;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function previous(): void {
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function flag(): void {
    vm.flag();
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

export function submit(): void {
    vm.submit();
}

export function quit(): void {
    vm.quit();
}

export function showMap(): void {
    vm.showMap();
}

export function showAnswer(): void {
    vm.showAnswer();
}

export function selectOption(args): void {
    vm.selectOption(args);
    optionList.refresh();
}

export function goToEditPage(): void {
    vm.goToEditPage();
}
