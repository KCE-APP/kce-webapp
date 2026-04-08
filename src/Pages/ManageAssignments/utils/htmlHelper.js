/**
 * Decode HTML entities and strip HTML tags from text
 * @param {string} html - HTML text with entities and tags
 * @returns {string} - Clean text with decoded entities
 */
export const decodeHtmlAndStripTags = (html) => {
  if (!html) return "";
  
  // Create a temporary element to decode HTML entities
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  
  // Get text content (automatically decodes entities)
  let text = tempElement.textContent || tempElement.innerText || "";
  
  // Remove any remaining HTML tags just in case
  text = text.replace(/<[^>]+>/g, "");
  
  return text.trim();
};
