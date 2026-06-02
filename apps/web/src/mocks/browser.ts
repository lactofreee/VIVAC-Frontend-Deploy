import { setupWorker } from "msw/browser";

import { handlers } from "@vivac/api/mocks";

export const worker = setupWorker(...handlers);
