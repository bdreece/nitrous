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
type NitrousConstructor = {
    new (): Nitrous;
    prototype: Nitrous;
    swapTitle: boolean;
};
export type NitrousOptions = {
    include?: string | string[];
    exclude?: string | string[];
    swapTitle?: boolean;
};
export function defineNitrous(name: `${string}-${string}`, { include, exclude, swapTitle, }?: NitrousOptions): NitrousConstructor;

//# sourceMappingURL=nitrous.d.ts.map
