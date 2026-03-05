import { useCrypto } from "@/composables/useCrypto";

export function useLocalStorage() {
  const { encryptData, decryptData } = useCrypto();

  // 🔥 تحديد نوع التخزين ديناميكيًا
  const isDev = import.meta.env.MODE === "development";
  const storage = isDev ? localStorage : sessionStorage;

  const APP_PREFIX = "" + getAppInstanceId();

  function getAppInstanceId() {
    const STORAGE_KEY = "ali7med";

    // لاحظ: يفضل هنا أن نستخدم نفس التخزين الديناميكي أيضًا
    let id = storage.getItem(STORAGE_KEY);

    if (!id) {
      // console.log(crypto.getRandomValues(new Uint32Array(16)));
      // console.log(crypto.randomUUID());
      // console.log("id", id);

      id = crypto.getRandomValues(new Uint32Array(16)).toString();
      // id = crypto.randomUUID();
      storage.setItem(STORAGE_KEY, id);
    }

    return id;
  }

  function get({
    key,
    withEncrypt = false,
  }: {
    key: string;
    withEncrypt: boolean;
  }): string | null {
    const data = storage.getItem(`${APP_PREFIX}_${key}`);
    if (!data) return null;

    if (withEncrypt) {
      const decrypted = decryptData(data);
      // decryptData returns Record<string, unknown> | null, but we know our encrypted values are strings
      return decrypted as string | null;
    }
    return data;
  }

  async function set({
    key,
    value,
    withEncrypt = false,
  }: {
    key: string;
    value: string | number | boolean | any;
    withEncrypt: boolean;
  }) {
    if (withEncrypt) {
      value = encryptData(value)?.toString() ?? value;
    }
    storage.setItem(`${APP_PREFIX}_${key}`, value);
  }

  function remove(key: string) {
    storage.removeItem(`${APP_PREFIX}_${key}`);
  }

  return {
    get,
    set,
    remove,
  };
}
