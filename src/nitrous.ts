import type { NitrousConstructor } from './types';
import { NitrousClickListener, NitrousSubmitListener } from './events';
import { NitrousError } from './errors';

export type { Nitrous } from './types';

export type NitrousOptions = {
    include?: string | string[];
    exclude?: string | string[];
    swapTitle?: boolean;
}

export function defineNitrous(name: `${string}-${string}`, {
    include = ['a', 'area'],
    exclude = [],
    swapTitle = true,
}: NitrousOptions = {}): NitrousConstructor {
    return class Nitrous extends HTMLElement {
        static { customElements.define(name, this); }
        static swapTitle = swapTitle;

        private readonly _parser = new DOMParser();
        private readonly _onClick = new NitrousClickListener(this);
        private readonly _onSubmit = new NitrousSubmitListener(this);
        private _include = include instanceof Array ? include.join(', ') : include;
        private _exclude = exclude instanceof Array ? exclude.join(', ') : exclude;

        get include(): string { return this._include; }
        set include(value: string | string[]) {
            this._include = value instanceof Array ? value.join(',') : value;
        }

        get exclude(): string { return this._exclude; }
        set exclude(value: string | string[]) {
            this._exclude = value instanceof Array ? value.join(',') : value;
        }

        get target() { return this.getAttribute('target') ?? ''; }
        set target(value: string) {
            this.setAttribute('target', value);
        }

        connectedCallback() {
            this.register();
        }

        disconnectedCallback() {
            this.unregister();
        }

        register(root: ParentNode = this): void {
            for (const el of root.querySelectorAll(this._include)) {
                if (el.matches(this._exclude)) {
                    continue;
                }

                switch (true) {
                    case el instanceof HTMLAnchorElement && el.dataset['nitrous'] !== 'false':
                    case el instanceof HTMLAreaElement && el.dataset['nitrous'] !== 'false':
                        el.addEventListener('click', this._onClick);
                        break;
                    case el instanceof HTMLFormElement && el.dataset['nitrous'] !== 'false':
                        el.addEventListener('submit', this._onSubmit);
                        break;
                    default:
                        continue;
                }
            }
        }

        unregister(root: ParentNode = this): void {
            for (const el of root.querySelectorAll(this._include)) {
                if (el.matches(this._exclude)) {
                    continue;
                }

                switch (true) {
                    case el instanceof HTMLAnchorElement && el.dataset['nitrous'] !== 'false':
                    case el instanceof HTMLAreaElement && el.dataset['nitrous'] !== 'false':
                        el.removeEventListener('click', this._onClick);
                        break;
                    case el instanceof HTMLFormElement && el.dataset['nitrous'] !== 'false':
                        el.removeEventListener('submit', this._onSubmit);
                        break;
                    default:
                        continue;
                }
            }
        }

        swap(html: string, target?: Element | null): void;
        swap(dom: Document, target?: Element | null): void;
        swap(input: string | Document, target: Element | null = null): void {
            const dom = typeof input === 'string'
                ? this._parser.parseFromString(input, 'text/html')
                : input;

            target ??= this.querySelector(this.target);
            if (!target) {
                throw new NitrousError(`Target '${this.target}' does not exist`);
            }

            target.replaceChildren(
                ...Array
                    .from(dom.body.childNodes)
                    .map(node => document.adoptNode(node))
            );

            if (Nitrous.swapTitle) {
                document.title = dom.title;
            }
        }
    }
}
