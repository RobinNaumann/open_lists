const $APP_VERSION = "DEVELOPMENT";

export const appConfig = {
  version: $APP_VERSION,
  name: "openLists",
  authors: [
    {
      name: "Robin",
      email: "robin.naumann@proton.me",
    },
  ],
  repository: "https://github.com/RobinNaumann/open-lists",
  constraints: {
    maxStringLength: 1000,
    maxListItems: 500,
  },
};
