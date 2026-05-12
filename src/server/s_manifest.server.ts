import sharp from "sharp";
import { appConfig } from "../shared/info.shared";
import { listService } from "./s_list.server";

export class ManifestService {
  public manifest(listId: string | null): object | null {
    // don't serve a manifest on the root path.

    const normalizedListId = listId?.trim() || "demo";
    //if (normalizedListId === "") return null;

    const appLongName = `${normalizedListId} - ${appConfig.name}`;

    const startUrl = normalizedListId
      ? `/${encodeURIComponent(normalizedListId)}`
      : "/";

    const color = listService.listAccentColor(listId);
    const iconPath = `/api/pwa/icon.png?color=${color.substring(1)}`;

    return {
      name: appLongName,
      short_name: normalizedListId ?? appConfig.name,
      description: "An open-source app for collaborative list-making.",
      id: startUrl,
      start_url: startUrl,
      scope: startUrl,
      display: "standalone",
      display_override: ["standalone", "minimal-ui", "browser"],
      background_color: color,
      theme_color: color,
      lang: "en-US",
      orientation: "portrait",
      categories: ["productivity"],
      prefer_related_applications: false,
      related_applications: [],
      icons: [
        {
          src: iconPath,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: iconPath,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: iconPath,
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

  /**
   * get the icon for the PWA
   * @param backgroundColor expects the color as "#RRGGBB"
   * @returns
   */
  public async getIcon(backgroundColor: string): Promise<{
    contentType: string;
    data: Buffer<ArrayBufferLike>;
  }> {
    const image = await sharp("client/pwaicon.png")
      .flatten({ background: backgroundColor })
      .png()
      .toBuffer();

    return { contentType: "image/png", data: image };
  }
}

export const manifestService = new ManifestService();
