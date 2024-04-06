export interface QueryParams {
  limit?: string;
  startIndex?: string;
  offer?:
    | {
        $in: string | boolean[];
      }
    | string;
  furnished?:
    | {
        $in: string | boolean[];
      }
    | string;
  parking?:
    | {
        $in: string | boolean[];
      }
    | string;
  type?:
    | {
        $in: string[];
      }
    | string;
  searchTerm?: string;
  sort?: string;
  order?: string;
}
