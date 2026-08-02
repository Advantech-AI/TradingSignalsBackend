import app from "../src/app";
import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}