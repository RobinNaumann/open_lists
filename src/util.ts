const language = navigator.language.substring(0, 2);

export function imsg(languages: L10nMessage): string {
    if (language in languages) {
        return languages[language];
    }
    return languages['en'];
}

type L10nMessage = {
    [key: string]: string;
};

export function listId(): string | null{
    const p = window.location.pathname.replace("/", '');
    if(p.length > 0){
        return p;
    }
    return null
}

export function createNewList(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const items = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]);

    const id = items.slice(0, 4).join('') + '-' + items.slice(4).join('');

    // go the the new list
    window.location.href = "/" + id;

}
