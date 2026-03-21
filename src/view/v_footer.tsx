import { Footer } from "elbe-ui";
import { appConfig } from "../shared/info.shared";

export function AppFooter() {
  return (
    <Footer
      marginTop={3}
      copyright={appConfig.name}
      version={appConfig.version}
      legal={{
        label: "by robin - source",
        href: appConfig.repository,
      }}
    />
  );
}
