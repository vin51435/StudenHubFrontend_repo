import ROUTES from '@src/routes/routes.config';
import { RouteConfig } from '@src/types/app';

export function getRoutePath(key: string, config: RouteConfig = ROUTES): string {
  const parts = key.split('.');

  function search(nodes: RouteConfig, index: number): string | null {
    for (const node of nodes) {
      if (node.name === parts[index]) {
        // If it's the last part, return its path
        if (index === parts.length - 1) return node.path;

        // If it has children, search deeper
        if (node.children) {
          const childPath = search(node.children, index + 1);
          if (childPath) return node.path + childPath;
        }
      }

      // Even if this node doesn't match, search its children
      if (node.children) {
        const found = search(node.children, index);
        if (found) return found;
      }
    }
    return null;
  }

  const result = search(config, 0);
  if (!result) {
    console.error(`Route not found: ${key}`);
    return '/route_not_found';
  }

  return result.startsWith('/') ? result : '/' + result;
}
