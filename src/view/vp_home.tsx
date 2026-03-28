import { Button, Card, Column, Icons, Page, Row, Text } from "elbe-ui";
import { useApp } from "elbe-ui/dist/ui/app/app_ctxt";
import { useEffect } from "react";
import { createRandomListId } from "../app";
import { useL10n } from "./l10n";

const MANIFEST_PATH = "/api/manifest.webmanifest";

export function setManifestHref(listId: string | null) {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="manifest"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }
  link.href = listId ? `${MANIFEST_PATH}?listId=${listId}` : MANIFEST_PATH;
}

export function HomePage() {
  const { c } = useL10n();
  const app = useApp();

  useEffect(() => setManifestHref(null), []);

  return (
    <Page
      title="openLists"
      narrow
      actions={[
        <Button.minor
          ariaLabel={c.listShare}
          icon={Icons.Share2}
          onTap={() => {}}
        />,
      ]}
    >
      <Text.h1 style={{ margin: "4rem 0" }} align="center" v={c.appTagline} />
      <Card scheme="secondary">
        <Row wrap main="center">
          <Column cross="center">
            <Icons.ListChecks style={{ margin: "2.5rem" }} />
          </Column>
          <Text
            flex={1}
            v={c.appDescription}
            style={{ whiteSpace: "pre-wrap", minWidth: "10rem" }}
          />
        </Row>
      </Card>
      <Button.major
        label={c.listCreate}
        ariaLabel={c.listCreate}
        icon={Icons.Plus}
        onTap={() => {
          app.router.go(`/${createRandomListId()}`);
        }}
      />
    </Page>
  );
}
