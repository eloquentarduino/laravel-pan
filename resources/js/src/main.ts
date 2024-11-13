import type { EventType, GlobalState } from "./types";

export declare const window: {
    __pan: GlobalState;
} & Window;

window.__pan =
    window.__pan ||
    ({
        csrfToken: "%_PAN_CSRF_TOKEN_%",
        routePrefix: "%_PAN_ROUTE_PREFIX_%",
        observer: null,
        clickListener: null,
        mouseoverListener: null,
        inertiaStartListener: null,
        intersectionObserver: null,
    } as GlobalState);

if (window.__pan.observer) {
    window.__pan.observer.disconnect();

    window.__pan.observer = null;
}

if (window.__pan.clickListener) {
    document.removeEventListener("click", window.__pan.clickListener);

    window.__pan.clickListener = null;
}

if (window.__pan.mouseoverListener) {
    document.removeEventListener("mouseover", window.__pan.mouseoverListener);

    window.__pan.mouseoverListener = null;
}

if (window.__pan.inertiaStartListener) {
    document.removeEventListener(
        "inertia:start",
        window.__pan.inertiaStartListener
    );

    window.__pan.inertiaStartListener = null;
}

(function (): void {
    const domObserver = (callback: MutationCallback): void => {
        const observer = new MutationObserver(callback);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        window.__pan.observer = observer;
    };

    const intersectionObserver = (callback: IntersectionObserverCallback): void => {
        window.__pan.intersectionObserver = new IntersectionObserver(callback);
    }

    let queue: Array<{ type: EventType; name: string }> = [];
    let queueTimeout: number | null = null;
    let impressed: Array<string> = [];
    let hovered: Array<string> = [];
    let clicked: Array<string> = [];
    let visible: Array<string> = [];

    const commit = (): void => {
        if (queue.length === 0) {
            return;
        }

        const onGoingQueue = queue.slice();

        queue = [];

        navigator.sendBeacon(
            `/${window.__pan.routePrefix}/events`,
            new Blob(
                [
                    JSON.stringify({
                        events: onGoingQueue,
                        _token: window.__pan.csrfToken,
                    }),
                ],
                {
                    type: "application/json",
                }
            )
        );
    };

    const queueCommit = function (): void {
        queueTimeout && clearTimeout(queueTimeout);

        // @ts-ignore
        queueTimeout = setTimeout(commit, 1000);
    };

    const send = function (el: Event, event: EventType): void {
        const target = el.target as HTMLElement;
        const element = target.closest("[data-pan]");

        if (element === null) {
            return;
        }

        const name = element.getAttribute("data-pan");

        if (name === null) {
            return;
        }

        if (event === "hover") {
            if (hovered.includes(name)) {
                return;
            }

            hovered.push(name);
        }

        if (event === "click") {
            if (clicked.includes(name)) {
                return;
            }

            clicked.push(name);
        }

        queue.push({
            type: event,
            name: name,
        });

        queueCommit();
    };

    const detectImpressions = function (): void {
        const elementsBeingImpressed = document.querySelectorAll("[data-pan]");

        elementsBeingImpressed.forEach((element: Element): void => {
            if (
                element.checkVisibility !== undefined &&
                !element.checkVisibility()
            ) {
                return;
            }

            const name = element.getAttribute("data-pan");

            if (name === null) {
                return;
            }

            if (!impressed.includes(name)) {
                impressed.push(name);

                queue.push({
                    type: "impression",
                    name: name,
                });
            }
        });

        queueCommit();
    };

    domObserver(function (): void {
        impressed.forEach((name: string): void => {
            const element = document.querySelector(`[data-pan='${name}']`);

            if (element === null) {
                impressed = impressed.filter(
                    (n: string): boolean => n !== name
                );
                hovered = hovered.filter((n: string): boolean => n !== name);
                clicked = clicked.filter((n: string): boolean => n !== name);
            }
            else {
                window.__pan.intersectionObserver?.observe(element)
            }
        });

        detectImpressions();
    });

    intersectionObserver(function (entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry: IntersectionObserverEntry): void => {
            const name = entry.target.getAttribute("data-pan");

            if (!name || !entry.isIntersecting || visible.includes(name))
                return;

            visible.push(name);

            queue.push({
                type: "visible",
                name: name,
            });
        })
    })

    window.__pan.clickListener = (event: Event): void => send(event, "click");
    document.addEventListener("click", window.__pan.clickListener);

    window.__pan.mouseoverListener = (event: Event): void =>
        send(event, "hover");
    document.addEventListener("mouseover", window.__pan.mouseoverListener);

    window.__pan.inertiaStartListener = (event: Event): void => {
        impressed = [];
        hovered = [];
        clicked = [];

        detectImpressions();
    };

    document.addEventListener(
        "inertia:start",
        window.__pan.inertiaStartListener
    );

    window.__pan.beforeUnloadListener = function (event: Event): void {
        if (queue.length === 0) {
            return;
        }

        commit();
    };

    window.addEventListener("beforeunload", window.__pan.beforeUnloadListener);
})();
