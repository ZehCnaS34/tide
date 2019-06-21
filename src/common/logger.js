import { createLogger } from "bunyan";

const log = createLogger({ name: "common" });
const clog = createLogger({ name: "client" });
const slog = createLogger({ name: "server" });

export { log, clog, slog };
