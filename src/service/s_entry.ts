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

    async observe(emit: (entries: any[]) => void): Promise<void> {
        const load = async () => {
            emit((await collEntries.getFullList()));
        }
        await collEntries.subscribe("*", (_) => { load() });
        load();
    }
}