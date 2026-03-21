import {
  Button,
  Card,
  Column,
  Icons,
  Page,
  Row,
  Text,
  useToast,
} from "elbe-ui";
import { useApp } from "elbe-ui/dist/ui/app/app_ctxt";
import { createRandomListId } from "../app";
import { useL10n } from "./l10n";

export function HomePage() {
  const { c } = useL10n();
  const app = useApp();
  const { showToast } = useToast();
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
