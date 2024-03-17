import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocket.robbb.in');
const collEntries = pb.collection('openlist_entries');

export interface Entry {
    id?: string;
    list?: string;
    title?: string;
    done?: boolean;

}

export class EntryService {
    public static i = new EntryService();
    private constructor() { }

    async set(id: string | null, data: Entry): Promise<void> {
        if (id === null) {
            await collEntries.create(data);
        }
        else {
            await collEntries.update(id, data);
        }
    }

    async delete(id: string): Promise<void> {
        await collEntries.delete(id);
    }

    async observe(listId: string, data: (entries: any[]) => void, error: (e: string) => void): Promise<void> {
        const load = async () => {
            try {
                const d = (await collEntries.getList(1,100,{ filter: "list = '" + listId + "'"})).items;
                //console.log("entries",d);

                data(d);
            } catch (e) {
                error(e);
            }
        }
        load();
        const sub = await collEntries.subscribe("*", (_) => { load() }, error);
    }
}