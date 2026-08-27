import { searchRepository } from "@/modules/search/repositories/search.repository";

export class SearchService {
  async globalSearch(query: string) {
    const results = await searchRepository.globalSearch(query);
    return {
      query,
      total: results.length,
      results,
      grouped: {
        clients: results.filter((r) => r.type === "client"),
        projects: results.filter((r) => r.type === "project"),
        contracts: results.filter((r) => r.type === "contract"),
        meetings: results.filter((r) => r.type === "meeting"),
        files: results.filter((r) => r.type === "file"),
        briefings: results.filter((r) => r.type === "briefing"),
        users: results.filter((r) => r.type === "user"),
      },
    };
  }
}

export const searchService = new SearchService();
