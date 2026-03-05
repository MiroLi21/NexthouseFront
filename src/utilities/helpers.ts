import { t } from "@/utilities/I18nPlugin";
export const getError = (error: {
  response: {
    data: { errors: { [s: string]: unknown } | ArrayLike<unknown> };
    status: any;
    headers: any;
  };
  config: { url: any };
}) => {
  const errorMessage = t("Server is down, please try again.");

  if (!error.response) {
    console.error(`API ${error.config.url} not found`);
    return errorMessage;
  }
  if (process.env.NODE_ENV === "development") {
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  }
  if (error.response.data && error.response.data.errors) {
    return Object.values(error.response.data.errors).flat().join();
  }

  return errorMessage;
};

export const hexToRgb = (hex: string) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  hex = hex.replace(
    shorthandRegex,
    (m: string, r: string, g: string, b: string) => {
      return r + r + g + g + b + b;
    }
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `${Number.parseInt(result[1], 16)},${Number.parseInt(
        result[2],
        16
      )},${Number.parseInt(result[3], 16)}`
    : null;
};
