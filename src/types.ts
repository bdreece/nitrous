export type HyperlinkElement = HTMLAnchorElement | HTMLAreaElement;

export type DelegatedEvent<E extends Event, T extends EventTarget> = E & { target: T };

export interface Nitrous extends HTMLElement {
    get include(): string;
    set include(value: string | string[]);

    get exclude(): string;
    set exclude(value: string | string[]);

    get target(): string;
    set target(value: string);

    register(root?: ParentNode): void;
    unregister(root?: ParentNode): void;

    swap(html: string, target?: Element | null): void;
    swap(dom: Document, target?: Element | null): void;
}

export type NitrousConstructor = {
    new(): Nitrous,
    prototype: Nitrous,

    swapTitle: boolean;
}
