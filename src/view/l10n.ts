import { makeL10n } from "elbe-ui";

export const { useL10n, L10n } = makeL10n(
  {
    en_US: {
      appTagline: "Simple Collaborative Lists",
      appDescription:
        "Create and collaborate on lists in real-time. All changes are visible to everyone sharing the list. No accounts needed. Just copy your list's link and you're done. \n\nThe app is open source and free to use.",
      listCreate: "Create new List",
      listShare: "Share List",
      listDelete: "Delete List",
      listEntryAdd: "Add new entry",
      listEntryDelete: "Delete entry",
      listEntryDoneToggle: "Toggle entry done",
      listShareText: "Edit this list with me:",
      listShareToClipboardSuccess: "List URL copied to clipboard",
    },
  },
  {
    de_DE: {
      appTagline: "Einfache kollaborative Listen",
      appDescription:
        "Erstelle und bearbeite Listen gemeinsam in Echtzeit. Alle Änderungen sind für alle sichtbar, die die Liste teilen. Es sind keine Accounts nötig. Einfach den Link deiner Liste kopieren und los geht's. \n\nDie App ist Open Source und kostenlos nutzbar.",
      listCreate: "Neue Liste erstellen",
      listShare: "Liste teilen",
      listDelete: "Liste löschen",
      listEntryAdd: "Neuen Eintrag hinzufügen",
      listEntryDelete: "Eintrag löschen",
      listEntryDoneToggle: "Eintrag als erledigt markieren",
      listShareText: "Bearbeite diese Liste mit mir:",
      listShareToClipboardSuccess: "Listen-URL in die Zwischenablage kopiert",
    },
  },
);
