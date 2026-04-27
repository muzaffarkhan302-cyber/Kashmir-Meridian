import { createRouter, publicQuery } from "./middleware";
import { templateRouter } from "./template";
import { packageRouter } from "./package";
import { hotelRouter, vehicleRouter } from "./hotel";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  template: templateRouter,
  package: packageRouter,
  hotel: hotelRouter,
  vehicle: vehicleRouter,
});

export type AppRouter = typeof appRouter;
