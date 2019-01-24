/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from "application";
import * as purchase from "nativescript-purchase";
import { isAndroid } from "platform";
import { setTimeout } from "timer";
import * as frame from "tns-core-modules/ui/frame";
import { QuestionViewModel } from "~/question/question-view-model";
import { AdService } from "~/services/ad.service";
import { GeneralService } from "./services/general.service";

purchase.init([
    "base.sas.quiz.premium"
]);

if (isAndroid) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, (args: app.AndroidActivityBackPressedEventData) => {
        const page = frame.topmost().currentPage;
        if (page != null && page.hasListeners(app.AndroidApplication.activityBackPressedEvent)) {
            (<any>args).page = page;
            page.notify(args);
        }
    });
}

const application = require("application");

application.on(application.uncaughtErrorEvent, (args) => {
    if (args.android) {
        GeneralService.getInstance().logError(args.android);
    } else if (args.ios) {
        GeneralService.getInstance().logError(args.ios);
    }
});

setTimeout(() => AdService.getInstance().doPreloadInterstitial(() => {
        QuestionViewModel._errorLoading = false;
    },
    () => {
        QuestionViewModel._errorLoading = true;
    }), 1000);
app.run({moduleName: "app-root/app-root"});
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
