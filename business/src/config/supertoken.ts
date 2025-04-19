import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import ThirdParty from "supertokens-web-js/recipe/thirdParty";

SuperTokens.init({
    appInfo: {
        apiDomain: "https://qrbites.serveo.net",
        apiBasePath: "/auth",
        appName: "...",
    },
    recipeList: [
        Session.init(),
        ThirdParty.init(),
        Passwordless.init(),
    ],
});