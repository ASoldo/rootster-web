import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

interface ServiceWorkerGlobalScopeWithEvents extends ServiceWorkerGlobalScope { }
declare const self: ServiceWorkerGlobalScopeWithEvents;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
clientsClaim();

console.log("Custom Service Worker");
