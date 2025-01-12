import type { Constructor, NitrousCustomElement } from './types';
import { NitrousClickListener, NitrousSubmitListener } from './events';
import { NitrousError } from './errors';

export type { NitrousCustomElement };

export type NitrousOptions = {
    include?: string | string[];
    exclude?: string | string[];
    swapTitle?: boolean;
};

const defaults = {
    include: ['a', 'area'],
    exclude: [] as string[],
    swapTitle: true,
};

export default class Nitrous<T extends HTMLElement = HTMLElement> {
    private readonly _parser = new DOMParser();
    private readonly _onClick = new NitrousClickListener(this);
    private readonly _onSubmit = new NitrousSubmitListener(this);
    private readonly _swapTitle: boolean;
    private _include: string;
    private _exclude: string;

    readonly root: T;

    constructor(
        root: T,
        {
            include = defaults.include,
            exclude = defaults.exclude,
            swapTitle = defaults.swapTitle,
        }: NitrousOptions = {},
    ) {
        this.root = root;
        this._swapTitle = swapTitle;
        this._include = include instanceof Array ? include.join(', ') : include;
        this._exclude = exclude instanceof Array ? exclude.join(', ') : exclude;
    }

    get include(): string {
        return this._include;
    }
    set include(value: string | string[]) {
        this._include = value instanceof Array ? value.join(',') : value;
    }

    get exclude(): string {
        return this._exclude;
    }
    set exclude(value: string | string[]) {
        this._exclude = value instanceof Array ? value.join(',') : value;
    }

    get target() {
        return this.root.getAttribute('target') ?? '';
    }
    set target(value: string) {
        this.root.setAttribute('target', value);
    }

    destroy(): void {
        this.unregister();
    }

    register(root: ParentNode = this.root): void {
        for (const el of root.querySelectorAll(this._include)) {
            if (el.matches(this._exclude)) {
                continue;
            }

            switch (true) {
                case el instanceof HTMLAnchorElement &&
                    el.dataset['nitrous'] !== 'false':
                case el instanceof HTMLAreaElement &&
                    el.dataset['nitrous'] !== 'false':
                    el.addEventListener('click', this._onClick);
                    break;
                case el instanceof HTMLFormElement &&
                    el.dataset['nitrous'] !== 'false':
                    el.addEventListener('submit', this._onSubmit);
                    break;
                default:
                    continue;
            }
        }
    }

    unregister(root: ParentNode = this.root): void {
        for (const el of root.querySelectorAll(this._include)) {
            if (el.matches(this._exclude)) {
                continue;
            }

            switch (true) {
                case el instanceof HTMLAnchorElement &&
                    el.dataset['nitrous'] !== 'false':
                case el instanceof HTMLAreaElement &&
                    el.dataset['nitrous'] !== 'false':
                    el.removeEventListener('click', this._onClick);
                    break;
                case el instanceof HTMLFormElement &&
                    el.dataset['nitrous'] !== 'false':
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
        const dom =
            typeof input === 'string' ?
                this._parser.parseFromString(input, 'text/html')
            :   input;

        target ??= this.root.querySelector(this.target);
        if (!target) {
            throw new NitrousError(`Target '${this.target}' does not exist`);
        }

        target.replaceChildren(
            ...Array.from(dom.body.childNodes).map(node =>
                document.adoptNode(node),
            ),
        );

        if (this._swapTitle) {
            document.title = dom.title;
        }

        this.register(target);
    }

    static define<T extends HTMLElement>(
        base: Constructor<T>,
        options: NitrousOptions = {},
    ): Constructor<NitrousCustomElement<T>> {
        // @ts-expect-error 2322 2415
        return class extends base {
            private readonly _nitrous = new Nitrous(this, options);

            get include(): string {
                return this._nitrous.include;
            }
            set include(value: string | string[]) {
                this._nitrous.include = value;
            }

            get exclude(): string {
                return this._nitrous.exclude;
            }
            set exclude(value: string | string[]) {
                this._nitrous.exclude = value;
            }

            get target(): string {
                return this._nitrous.target;
            }
            set target(value: string) {
                this._nitrous.target = value;
            }

            register(root?: ParentNode): void {
                this._nitrous.register(root);
            }

            unregister(root?: ParentNode): void {
                this._nitrous.unregister(root);
            }

            swap(
                input: string | Document,
                target: Element | null = null,
            ): void {
                this._nitrous.swap(input as string, target);
            }
        };
    }
}
