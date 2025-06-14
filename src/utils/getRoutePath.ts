import ROUTES from '@src/routes/routes.config';
import { RouteConfig, RouteNode } from '@src/types/app';
import { ExtractKeyValues } from '@src/utils/common';

type SearchableNode = RouteNode & { _parent?: SearchableNode };

/**
 * Get the full route path by key, resolving from any level.
 */
export function getRoutePath(key: string, config: RouteConfig | any = ROUTES): string {
  const node = searchByKey(config, key);

  if (!node) {
    console.error(`Route not found: ${key}`);
    return '/route_not_found';
  }

  const fullPath = buildFullPath(node);
  return fullPath.startsWith('/') ? fullPath : '/' + fullPath;
}

/**
 * Get node details using name or path.
 */
export function getRouteDetails(
  search: { name?: string; path?: string },
  config: RouteConfig | any = ROUTES
) {
  const { name, path } = search;

  if (name) {
    return searchByKey(config, name);
  } else if (path) {
    return searchByPath(config, path);
  }

  return null;
}

type routesNameKeyType = ExtractKeyValues<typeof ROUTES, 'name'>;

/**
 * Get the exact route path by key, resolving from any level.
 * If the key does not resolve to a route, '/route_not_found' is returned.
 * @param key the key to search for
 * @param config the route configuration to search
 * @returns the exact route path, or '/route_not_found' if not found
 */
export function getExactRoutePath(
  key: routesNameKeyType | string,
  config: RouteConfig | any = ROUTES
): string {
  config as unknown as RouteConfig;
  const node = searchByKey(config, key);
  if (!node?.path) {
    console.error(`Exact route not found for key: ${key}`);
    return '/route_not_found';
  }

  return node.path;
}

/**
 * Recursively build full path from node up to root.
 */
function buildFullPath(node: SearchableNode): string {
  const pathParts: string[] = [];
  let current: SearchableNode | undefined = node;

  while (current) {
    if (current.path) {
      pathParts.unshift(current.path.startsWith('/') ? current.path : '/' + current.path);
    }
    current = current._parent;
  }

  return pathParts.join('').replace(/\/{2,}/g, '/');
}

/**
 * Searches by a dot-separated key (e.g., 'AUTH.OAUTH_CALLBACK').
 * Supports partial or nested keys starting from any level.
 */
function searchByKey(nodes: RouteConfig, key: string): SearchableNode | null {
  const parts = key.split('.');

  const dfs = (
    nodes: RouteConfig,
    index: number,
    parent?: SearchableNode
  ): SearchableNode | null => {
    for (const node of nodes) {
      const current: SearchableNode = { ...node, _parent: parent };

      if (current.name === parts[index]) {
        if (index === parts.length - 1) return current;
        if (current.children) {
          const childResult = dfs(current.children, index + 1, current);
          if (childResult) return childResult;
        }
      }

      if (current.children) {
        const childResult = dfs(current.children, index, current);
        if (childResult) return childResult;
      }
    }
    return null;
  };

  return dfs(nodes, 0);
}

/**
 * Recursively search a node by path.
 */
function searchByPath(nodes: RouteConfig, path: string): null | RouteNode {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = searchByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}
