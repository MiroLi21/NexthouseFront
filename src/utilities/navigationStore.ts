import Api from "@/api/apiConfig";

/**
 * Creates navigation methods for a store
 * @param pathUrl - The base API path for the resource (e.g., "/voucher/payment")
 * @returns Object containing first, last, next, and previous navigation methods
 */
export function createNavigationMethods(pathUrl: string) {
  return {
    getFirst: async () => {
      return await Api.get(`${pathUrl}/first`);
    },
    getLast: async () => {
      return await Api.get(`${pathUrl}/last`);
    },
    getNext: async (id: number) => {
      return await Api.get(`${pathUrl}/next/${id}`);
    },
    getPrevious: async (id: number) => {
      return await Api.get(`${pathUrl}/previous/${id}`);
    },
  };
}
