import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.io/appid-null",
  },
  appInfo: {
    appName: "qrbites",
    apiDomain: "https://qrbites.serveo.net",
    websiteDomain: "http://localhost:5173",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
  ]
});
