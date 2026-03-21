import {
  Button,
  Card,
  Column,
  Field,
  IconButton,
  Icons,
  Page,
  Row,
  share,
  Text,
  useToast,
} from "elbe-ui";
import { useApp } from "elbe-ui/dist/ui/app/app_ctxt";
import { useState } from "react";
import { createRandomListId, makeServerCall } from "../app";
import { appConfig } from "../shared/info.shared";
import { ItemModel } from "../shared/m_list.shared";
import { ListBit } from "./b_list";
import { useL10n } from "./l10n";

export function ListPage(p: { listId: string }) {
  const app = useApp();
  const { c } = useL10n();
  return (
    <Page
      title={
        <Text.h3
          align="center"
          native={{
            onClick: () => {
              app.router.go("/");
            },
          }}
          v={p.listId}
        />
      }
      leading={
        <IconButton
          ariaLabel={c.listCreate}
          icon={Icons.FilePlus}
          onTap={() => app.router.go(`/${createRandomListId()}`)}
        />
      }
      actions={[
        <Button.minor
          ariaLabel={c.listShare}
          label={c.listShare}
          icon={Icons.Share2}
          onTap={() =>
            share(
              { url: window.location.href, title: c.listShareText },
              c.listShareToClipboardSuccess,
            )
          }
        />,
      ]}
      centerTitle
      narrow
    >
      <ListBit.Provider listId={p.listId} key={p.listId}>
        <_ListView listId={p.listId} />
      </ListBit.Provider>
    </Page>
  );
}

function _ListView(p: { listId: string }) {
  const listBit = ListBit.use();
  return listBit.mapUI((list) => (
    <Column cross="center">
      <Column
        style={{
          minWidth: "0",
          maxWidth: "30rem",
          width: "100%",
        }}
      >
        {list.items.map((item, i) => (
          <_ListItem
            key={item.content + item.setAt}
            item={item}
            onChange={(item) =>
              makeServerCall.setEntry({
                listId: p.listId,
                entryIndex: i,
                entry: item,
              })
            }
          />
        ))}
        {list.items.length < appConfig.constraints.maxListItems && (
          <_NewEntry listId={p.listId} />
        )}
      </Column>
    </Column>
  ));
}

function _ListItem(p: {
  item: ItemModel;
  onChange: (item: ItemModel) => void;
}) {
  const { c } = useL10n();
  const [text, setText] = useState(p.item.content);
  const isDone = p.item.state === "done";

  function _setText() {
    if (text === p.item.content) return;
    p.onChange({
      ...p.item,
      content: text,
    });
  }

  return (
    <Card
      scheme={isDone ? "primary" : "secondary"}
      state={isDone ? "disabled" : "neutral"}
      bordered
      padding={0}
    >
      <Row gap={0.5} cross="center">
        <IconButton.plain
          ariaLabel={c.listEntryDoneToggle}
          icon={isDone ? Icons.CircleCheckBig : Icons.Circle}
          onTap={() =>
            p.onChange({
              ...p.item,
              state: isDone ? "open" : "done",
            })
          }
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            flex: 1,
            marginTop: ".5rem",
            marginBottom: ".4rem",

            // remove default input styling
            background: "transparent",
            border: "none",
            outline: "none",

            //text striketrough:
            textDecoration: isDone ? "line-through" : "none",
            textDecorationThickness: "1.5px",
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            _setText();
          }}
          onBlur={() => _setText()}
        />

        <IconButton
          ariaLabel={c.listEntryDelete}
          icon={Icons.X}
          onTap={() =>
            p.onChange({
              ...p.item,
              state: "deleted",
            })
          }
        />
      </Row>
    </Card>
  );
}

function _NewEntry(p: { listId: string }) {
  const { showToast } = useToast();
  const { c } = useL10n();
  const [content, setContent] = useState("");

  function addEntry() {
    if (content.length === 0) return;
    makeServerCall
      .setEntry({
        listId: p.listId,
        entryIndex: null,
        entry: {
          content,
          setAt: Date.now(),
          state: "open",
        },
      })
      .catch(() => showToast("could not add entry"));
    setContent("");
  }

  return (
    <Field.text
      native={{
        // react to "Enter" press in the same way as on plus click
        onKeyDown: (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          addEntry();
        },
      }}
      flex
      hideLabel
      ariaLabel={c.listEntryAdd}
      label={c.listEntryAdd}
      hint={c.listEntryAdd}
      value={content}
      onInput={(v) => setContent(v)}
      onTrailingTap={content.length === 0 ? undefined : () => addEntry()}
      trailing={Icons.Plus}
    />
  );
}
