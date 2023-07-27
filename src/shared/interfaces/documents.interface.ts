export interface ReceivedDocuments<T> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  elements: T[];
}
