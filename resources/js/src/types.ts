export type EventType = "click" | "hover" | "impression" | "visible";

export type GlobalState = {
    csrfToken: string;
    routePrefix: string;
    observer: MutationObserver | null;
    clickListener: EventListener | null;
    mouseoverListener: EventListener | null;
    inertiaStartListener: EventListener | null;
    beforeUnloadListener: EventListener | null;
    intersectionObserver: IntersectionObserver | null;
};
