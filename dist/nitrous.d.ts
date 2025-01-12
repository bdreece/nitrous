type RegisterFunction = {
    (root?: ParentNode): void;
};
type UnregisterFunction = {
    (root?: ParentNode): void;
};
type SwapFunction = {
    (html: string, target?: Element | null): void;
    (dom: Document, target?: Element | null): void;
};
type Constructor<T> = {
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
export type NitrousOptions = {
    include?: string | string[];
    exclude?: string | string[];
    swapTitle?: boolean;
};
export default class Nitrous<T extends HTMLElement = HTMLElement> {
    readonly root: T;
    constructor(root: T, { include, exclude, swapTitle, }?: NitrousOptions);
    get include(): string;
    set include(value: string | string[]);
    get exclude(): string;
    set exclude(value: string | string[]);
    get target(): string;
    set target(value: string);
    destroy(): void;
    register(root?: ParentNode): void;
    unregister(root?: ParentNode): void;
    swap(html: string, target?: Element | null): void;
    swap(dom: Document, target?: Element | null): void;
    static define<T extends HTMLElement>(base: Constructor<T>, options?: NitrousOptions): Constructor<NitrousCustomElement<T>>;
}

//# sourceMappingURL=nitrous.d.ts.map
