import {
  isValidList,
  ItemModel,
  ListModel,
  sanitizedList,
} from "../shared/m_list.shared";
import { NotifyableService } from "./s_notifyable.server";

const storagePath = "./data/";

function _sanitizeListId(id: string | null | undefined): string | null {
  if (!id) return null;
  const trimmed = id.trim();
  if (trimmed.length < 4) return null;
  if (trimmed.length > 64) return null;
  if (!/^[A-Za-z0-9_-]+(?:-[A-Za-z0-9_-]+)*$/.test(trimmed)) return null;
  return trimmed;
}

class ListService extends NotifyableService<ListModel> {
  private async _setList(
    unsanitizedListId: string,
    updater?: (existing: ListModel) => ListModel,
  ): Promise<ListModel> {
    const listId = _sanitizeListId(unsanitizedListId);
    if (!listId) throw new Error("invalid list id");

    const existing = await this.getList(listId);
    const updated = sanitizedList(updater ? updater(existing) : existing);
    if (!isValidList(updated)) throw new Error("invalid list data");
    await Bun.write(storagePath + listId + ".json", JSON.stringify(updated));
    this._notifyListeners(listId, updated);
    return updated;
  }

  async getList(unsanitizedListId: string): Promise<ListModel> {
    const listId = _sanitizeListId(unsanitizedListId);
    if (!listId) throw new Error("invalid list id");

    try {
      const data = await Bun.file(storagePath + listId + ".json").json();
      if (!isValidList(data)) throw new Error("invalid list data in file");
      return data;
    } catch (e) {
      return {
        setAt: Date.now(),
        about: "",
        items: [],
      };
    }
  }

  async setAbout(listId: string, about: string): Promise<void> {
    await this._setList(listId, (existing) => {
      existing.about = about;
      return existing;
    });
  }

  async setEntry(
    listId: string,
    entryIndex: number | null,
    entryData: ItemModel,
  ): Promise<void> {
    await this._setList(listId, (existing) => {
      if (entryIndex !== null) {
        // update the existing entry
        if (entryIndex < 0 || entryIndex >= existing.items.length) {
          throw new Error("entry index out of bounds");
        }
        if (entryData.state === "deleted") {
          existing.items.splice(entryIndex, 1);
        } else {
          existing.items[entryIndex] = {
            setAt: Date.now(),
            content: entryData.content,
            state: entryData.state,
          };
        }
      } else if (entryData.state !== "deleted") {
        existing.items.push({
          setAt: Date.now(),
          content: entryData.content,
          state: entryData.state,
        });
      }
      return existing;
    });
  }
}

export const listService = new ListService();
