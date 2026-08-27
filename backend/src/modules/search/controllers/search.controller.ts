import type { Request, Response } from "express";
import { searchService } from "@/modules/search/services/search.service";
import { sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";

export const searchController = {
  global: asyncHandler(async (req: Request, res: Response) => {
    const query = String(req.query.q ?? "");
    sendSuccess(res, await searchService.globalSearch(query));
  }),
};
