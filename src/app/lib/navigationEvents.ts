export const FOOTER_CATEGORY_EVENT = "kairos:footer-category";
export const FOOTER_COMING_SOON_EVENT = "kairos:footer-coming-soon";

export function openFooterCategory(category: string) {
  window.dispatchEvent(new CustomEvent(FOOTER_CATEGORY_EVENT, { detail: category }));
}

export function openComingSoon(section: string) {
  window.dispatchEvent(new CustomEvent(FOOTER_COMING_SOON_EVENT, { detail: section }));
}
