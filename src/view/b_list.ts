import { createBit } from "elbe-ui";
import { serverChannels } from "../app";
import { ListModel } from "../shared/m_list.shared";

export const ListBit = createBit({
  debugLabel: "ListBit",
  dataTypeHint: null as any as { list: ListModel; color: string },
  stream: (params: { listId: string }, ctrl) => {
    const cancel = serverChannels.listen({
      channel: `list/${params.listId.toLowerCase()}`,
      onData: (d) => ctrl.setData(d),
      onError: (e) => ctrl.setError(e),
    }).cancel;
    return () => cancel();
  },
  control: () => ({}),
});
