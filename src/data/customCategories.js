const STORAGE_KEY = "custom_categories";

export const defaultCategories = ["electronics", "phones", "fashion", "home", "beauty", "sports"];

export function getCustomCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addCustomCategory(name) {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return getCustomCategories();

  const current = getCustomCategories();
  if (defaultCategories.includes(trimmed) || current.includes(trimmed)) {
    return current;
  }

  const updated = [...current, trimmed];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeCustomCategory(name) {
  const updated = getCustomCategories().filter((c) => c !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getAllCategories() {
  return [...defaultCategories, ...getCustomCategories()];
}