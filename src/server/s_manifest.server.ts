import { appConfig } from "../shared/info.shared";

export class ManifestService {
  public manifest(listId: string | null) {
    const appBaseLongName = appConfig.name + " — " + "Shared Lists";
    const appLongName = listId
      ? `${listId} - ${appConfig.name}`
      : appBaseLongName;
    const startUrl = `/${listId ?? ""}`;
    const manifestId = listId ? `/list/${listId}` : "/";

    return {
      name: appLongName,
      short_name: listId ?? appConfig.name,
      description: "An open-source app for collaborative list-making.",
      id: manifestId,
      start_url: startUrl,
      scope: "/",
      display: "standalone",
      background_color: "#e0d5e9",
      theme_color: appConfig.theme.accent,
      icons: [
        {
          src: "/icon.png",
          //sizes: "any",
          //type: "image/svg+xml",
          //purpose: "any",
        },
      ],
    };
  }
}

export const manifestService = new ManifestService();
