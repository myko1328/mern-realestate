export type SideBarData = {
  searchTerm: string;
  type: string | "all";
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  sort: string | "created_at";
  order: string | "desc" | "asc";
};
