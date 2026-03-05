export const prepareFormData = (data: object, ignoreKeys: string[] = []) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (ignoreKeys.includes(key)) {
      return;
    } else {
      const formattedKey = key
        .replace(/ /g, "_")
        .replace(/([A-Z])/g, "_$1")
        .replace(/^_/, "")
        .toLowerCase();
      if (value !== null && value !== undefined) {
        formData.append(
          formattedKey + (typeof value === "object" ? "_id" : ""),
          value["id"] || String(value)
        );
      }
    }

    // console.log(key + ": " + value);
  });
  return formData;
};
