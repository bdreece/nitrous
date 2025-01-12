export type HyperlinkElement = HTMLAnchorElement | HTMLAreaElement;

export type DelegatedEvent<E extends Event, T extends EventTarget> = E & {
    target: T;
};

export type RegisterFunction = {
    (root?: ParentNode): void;
};

export type UnregisterFunction = {
    (root?: ParentNode): void;
};

export type SwapFunction = {
    (html: string, target?: Element | null): void;
    (dom: Document, target?: Element | null): void;
};

export type Constructor<T> = {
    new (): T;
    prototype: T;
};

export type NitrousCustomElement<T extends HTMLElement> = T & {
    get include(): string;
    set include(value: string | string[]);

    get exclude(): string;
    set exclude(value: string | string[]);

    get target(): string;
    set target(value: string);

    register: RegisterFunction;
    unregister: UnregisterFunction;
    swap: SwapFunction;
};
