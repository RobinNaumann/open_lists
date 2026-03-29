import { appConfig } from "../shared/info.shared";

export class ManifestService {
  public manifest(listId: string | null) {
    const normalizedListId = listId?.trim() || null;
    const appBaseLongName = appConfig.name + " — " + "Shared Lists";
    const appLongName = normalizedListId
      ? `${normalizedListId} - ${appConfig.name}`
      : appBaseLongName;
    const startUrl = normalizedListId
      ? `/${encodeURIComponent(normalizedListId)}`
      : "/";

    return {
      name: appLongName,
      short_name: normalizedListId ?? appConfig.name,
      description: "An open-source app for collaborative list-making.",
      id: startUrl,
      start_url: startUrl,
      scope: "/",
      display: "standalone",
      display_override: ["standalone", "minimal-ui", "browser"],
      background_color: "#e0d5e9",
      theme_color: appConfig.theme.accent,
      icons: [
        {
          src: "/icon.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
      ],
      shortcuts: [
        {
          name: "Create new list",
          short_name: "New list",
          url: "/",
        },
      ],
    };
  }
}

export const manifestService = new ManifestService();
