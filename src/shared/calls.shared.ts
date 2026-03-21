import { serverCall } from "donau/servercalls/shared";
import { sharedServerChannel } from "donau/serverchannels/shared";
import { ItemModel, ListModel } from "./m_list.shared";

// prettier-ignore
export const serverCallDefinitions = {
  setEntry: serverCall<{listId: string; entryIndex: number | null; entry: ItemModel }, {}>(),
  setAbout: serverCall<{listId: string; about: string }, {}>()};

// prettier-ignore
export const serverChannelDefinitions = {
  list: sharedServerChannel<{}, { list: ListModel }>({sendLatestOnConnect: true}),
};
