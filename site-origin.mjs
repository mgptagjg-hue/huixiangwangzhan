export const OFFICIAL_SITE_ORIGIN = "https://huixiangqimao.cn";

const configuredOrigin =
  typeof process !== "undefined" ? process.env.PUBLIC_SITE_ORIGIN?.trim() : "";

export function resolveSiteOrigin(value = configuredOrigin) {
  const candidate = value || OFFICIAL_SITE_ORIGIN;
  const url = new URL(candidate);

  if (
    url.protocol !== "https:" ||
    url.hostname !== "huixiangqimao.cn" ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `PUBLIC_SITE_ORIGIN must be the canonical production origin ${OFFICIAL_SITE_ORIGIN}. Received: ${candidate}`
    );
  }

  return url.origin;
}

export const SITE_ORIGIN = resolveSiteOrigin();
