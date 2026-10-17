export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(query: any): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || "20"), 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function formatPaginated<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
