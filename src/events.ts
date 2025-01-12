import type { DelegatedEvent, HyperlinkElement, Nitrous } from './types';
import { NitrousResponseError } from './errors';
import { NitrousFormRequest, NitrousHyperlinkRequest } from './requests';

abstract class NitrousRequestHandler {
    private _controller = new AbortController();

    constructor(
        protected readonly nitrous: Nitrous,
        private readonly timeout?: number,
    ) {
    }

    abort(reason?: unknown): void {
        this._controller.abort(reason);
        this._controller = new AbortController();
    }

    protected async handleRequest(req: Request, target: Element | null): Promise<void> {
        const signal = !this.timeout
            ? this._controller.signal
            : AbortSignal.any([
                AbortSignal.timeout(this.timeout),
                this._controller.signal
            ]);

        const res = await fetch(req, {
            signal,
        });

        if (!res.ok) {
            throw new NitrousResponseError(
                `Invalid status code: '${res.status} ${res.statusText}'`,
                { response: res },
            );
        }

        const html = await res.text();
        this.nitrous.swap(html, target);
    }
}

export class NitrousClickListener extends NitrousRequestHandler implements EventListenerObject {
    handleEvent(e: DelegatedEvent<MouseEvent, HyperlinkElement>): void {
        e.preventDefault();

        const req = new NitrousHyperlinkRequest(e.target, {
            nitrous: {
                target: this.nitrous.target,
            },
        });

        const target = e.target.dataset['target']
            ? this.nitrous.querySelector(e.target.dataset['target'])
            : null;

        this.handleRequest(req, target).catch(console.error);
    }
}

export class NitrousSubmitListener extends NitrousRequestHandler implements EventListenerObject {
    handleEvent(e: DelegatedEvent<SubmitEvent, HTMLFormElement>): void {
        e.preventDefault();

        const req = new NitrousFormRequest(e.target, {
            nitrous: {
                target: this.nitrous.target,
            },
        });

        const target = e.target.dataset['target']
            ? this.nitrous.querySelector(e.target.dataset['target'])
            : null;
        
        this.handleRequest(req, target).catch(console.error);
    }
}
