//
// "app.server.ts" IS THE ENTRY POINT TO YOUR APPLICATION.
// YOU CAN MODIFY IT, BUT MAKE SURE NOT TO REMOVE IT
//

import { donauServerRun, parameter, route, serveFrontend } from "donau/server";
import { handleServerCalls } from "donau/servercalls/server";
import { ServerChannelServer } from "donau/serverchannels/server";
import { listService } from "./server/s_list.server";
import { manifestService } from "./server/s_manifest.server";
import {
  serverCallDefinitions,
  serverChannelDefinitions,
} from "./shared/calls.shared";
import { ListModel } from "./shared/m_list.shared";

const PORT = Number.parseInt(process.env.PORT ?? "3000");

export const channelServer = new ServerChannelServer({
  sharedChannels: serverChannelDefinitions,
});

await channelServer.provideShared({
  list: {
    onSubChannelRequested: (p) => {
      return {
        description: "a sub channel for one list ",
        keepOpen: true,
        sendLatestOnConnect: true,
        initialize: async (self) => {
          const color = listService.listAccentColor(p.id);
          const fn = (list: ListModel) => self.send({ list, color });
          listService.listen(p.id, fn);
          self.config.onClose = () => listService.unlisten(p.id, fn);
          return { list: await listService.getList(p.id), color };
        },
      };
    },
    onMessage: async () => {},
  },
});

const serverCallRoutes = handleServerCalls(serverCallDefinitions, {
  setAbout: async (input) => {
    await listService.setAbout(input.listId, input.about);
    return {};
  },

  setEntry: async (input) => {
    await listService.setEntry(input.listId, input.entryIndex, input.entry);
    return {};
  },
});

const donauServer = donauServerRun(
  PORT,
  {
    info: {
      title: "openLists API",
      version: "1.0.3",
      description: "the API of the openLists app",
    },
    routes: [
      ...serverCallRoutes,
      ...channelServer.infoRoutes(),
      route("/pwa/icon.png", {
        method: "get",
        parameters: {
          color: parameter.query({ optional: true, type: "string" }),
        },
        description:
          "returns a PNG icon for the app, with the background color set to the value of the color query param " +
          "(in HEX like RRGGBB without the #)",
        handler: async (req, res) => {
          const bgColor = `#${req.query.color}`.trim();
          if (!/^#[0-9A-Fa-f]{6}$/.test(bgColor)) {
            res.status(400).send("invalid color parameter");
            return;
          }
          const result = await manifestService.getIcon(bgColor);
          //res.header("Cache-Control", "no-store");
          res.header("Content-Type", result.contentType);
          res.send(result.data);
        },
      }),
      route("/pwa/manifest.webmanifest", {
        method: "get",
        parameters: {
          list: parameter.query({ optional: true, type: "string" }),
        },
        description:
          "returns a web manifest for the app, customized for the list if listId query param is provided",
        handler: async (req, res) => {
          let receivedId: any = req.query.list;
          if (Array.isArray(receivedId)) receivedId = receivedId[0];
          let listId = typeof receivedId === "string" ? receivedId : null;

          if (!listId) {
            const referer = req.get("referer") || "";
            try {
              if (referer) {
                const u = new URL(referer);
                const p = u.pathname.replace(/^\/+|\/+$/g, "");
                if (p && !p.includes("/")) listId = decodeURIComponent(p);
              }
            } catch {
              // ignore parse errors
            }
          }

          res.header("Cache-Control", "no-store");
          res.header("Content-Type", "application/manifest+json");
          res.send(JSON.stringify(manifestService.manifest(listId)));
        },
      }),
    ],
  },
  [process.env.SERVE_FRONTEND === "true" ? serveFrontend("client") : null],
);
if (donauServer?.server) channelServer.serve({ server: donauServer.server });
