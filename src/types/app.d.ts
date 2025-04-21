export type SelectState = {
  load: boolean;
  options: Record<string, DefaultOptionType[]>;
  values: Record<string, DefaultOptionType | DefaultOptionType[]> | null;
};

export interface RouteNode {
  name: string;
  path: string;
  children?: RouteNode[];
}

export type RouteConfig = RouteNode[];
