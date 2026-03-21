import { createBit } from "elbe-ui";
import { serverChannels } from "../app";
import { ListModel } from "../shared/m_list.shared";

export const ListBit = createBit({
  debugLabel: "ListBit",
  dataTypeHint: null as any as ListModel,
  stream: (params: { listId: string }, ctrl) => {
    const cancel = serverChannels.listen({
      channel: `list/${params.listId}`,
      onData: (d) => ctrl.setData(d.list),
      onError: (e) => ctrl.setError(e),
    }).cancel;
    return () => cancel();
  },
  control: () => ({}),
});
