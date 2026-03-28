import { useServerCalls } from "donau/servercalls/client";
import { useServerChannels } from "donau/serverchannels/client";

import {
  Button,
  ElbeApp,
  HexColor,
  Icons,
  makeThemeContext,
  renderElbe,
  Route,
} from "elbe-ui";
import { useState } from "react";
import {
  serverCallDefinitions,
  serverChannelDefinitions,
} from "./shared/calls.shared";
import { appConfig } from "./shared/info.shared";
import { L10n } from "./view/l10n";
import { AppFooter } from "./view/v_footer";
import { HomePage } from "./view/vp_home";
import { ListPage } from "./view/vp_list";

export const { serverChannels } = useServerChannels({
  port: import.meta.env.VITE_API_PORT,
  shared: serverChannelDefinitions,
});

export const { makeServerCall } = useServerCalls(serverCallDefinitions, {
  port: import.meta.env.VITE_API_PORT,
});

const _themeContext = makeThemeContext({
  seed: {
    color: { accent: appConfig.theme.accent as HexColor },
    type: {
      heading: {
        bold: true,
        size: 2,
        family: ["Atkinson Hyperlegible", "sans-serif"],
      },
    },
  },
});
export const { useTheme, WithTheme } = _themeContext;

function App() {
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [highVis, setHighVis] = useState(false);

  return (
    <L10n>
      <ElbeApp
        title={"openLists"}
        key={dark ? "dark" : "light"}
        themeContext={_themeContext}
        footer={<AppFooter />}
        themeSelector={(c) => ({
          color: {
            ...c.color,
            selection: {
              ...c.color.selection,
              mode: dark ? "dark" : "light",
              contrast: highVis ? "highvis" : "normal",
            },
          },
        })}
        globalActions={[
          <Button.plain
            label="High Visibility"
            ariaLabel="toggle high visibility mode"
            icon={highVis ? Icons.Paintbrush : Icons.Contrast}
            onTap={() => setHighVis(!highVis)}
          />,
          <Button.plain
            label="Dark Mode"
            ariaLabel="toggle dark mode"
            icon={dark ? Icons.Sun : Icons.Moon}
            onTap={() => setDark(!dark)}
          />,
        ]}
      >
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/:listId">
          {({ listId }) => <ListPage listId={listId} />}
        </Route>
      </ElbeApp>
    </L10n>
  );
}

renderElbe(<App />);

function _nonConfusableChars(length: number) {
  const chars = "23456789ABCDEFGHJKLMNPQRSTWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function createRandomListId() {
  return `${_nonConfusableChars(4)}-${_nonConfusableChars(4)}`;
}

export function shareListUrl(listId: string) {
  // try using the ``
}
