import * as SocialShare from "nativescript-social-share";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { SettingsService } from "~/services/settings.service";
import { ConnectionService } from "../connection.service";
import { MyDrawerViewModel } from "./MyDrawer-view-model";

/* ***********************************************************
* Use the "loaded" event handler of the wrapping layout element to bind the view model to your view.
*************************************************************/
export function onLoaded(args: EventData): void {
    const component = <GridLayout>args.object;
    const componentTitle = component.get("selectedPage");
    component.bindingContext = new MyDrawerViewModel(componentTitle);
}

const closeDrawer = () => {
    const drawerComponent = <RadSideDrawer>app.getRootView();
    drawerComponent.closeDrawer();
};

/* ***********************************************************
* Use the "tap" event handler of the <GridLayout> component for handling navigation item taps.
* The "tap" event handler of the app drawer <GridLayout> item is used to navigate the app
* based on the tapped navigationItem's route.
*************************************************************/
export function onNavigationItemTap(args: EventData): void {
    const component = <GridLayout>args.object;
    const componentRoute = component.get("route");
    SettingsService.getInstance().saveRoute(componentRoute);

    topmost().navigate({
        moduleName: componentRoute,
        transition: {
            name: "fade"
        }
    });

    closeDrawer();

}

export function navigate(args: EventData): void {
    const component = <GridLayout>args.object;
    const componentRoute = component.get("route");
    topmost().navigate({
        moduleName: componentRoute,
        transition: {
            name: "fade"
        }
    });

    closeDrawer();
}

export function share(args: EventData): void {
    SocialShare.shareText("https://goo.gl\n" +
        "Hi there, Take a look at the NS Webpack which I am using!!!");
}

export function goPremium(args: EventData): void {
    if (ConnectionService.getInstance().isConnected()) {
        navigate(args);
    } else {
        dialogs.alert("Please connect to internet for the purchase!!");
    }

}

export function logout(args: EventData): void {
    android.os.Process.killProcess(android.os.Process.myPid());
}
