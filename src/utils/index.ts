/**
 * Add cache busting parameters to image URLs
 * @param url - The original image URL
 * @param index - Optional index for additional uniqueness
 * @returns URL with cache busting parameters
 */
export const addCacheBusting = (url: string, index?: number): string => {
  if (!url) return url;

  const separator = url.includes("?") ? "&" : "?";
  const timestamp = Date.now();
  const cacheBust =
    index !== undefined ? `${timestamp}&index=${index}` : timestamp;

  return `${url}${separator}v=${cacheBust}`;
};

/**
 * Add cache busting to all images in a product
 * @param product - The product object
 * @returns Product with cache-busted image URLs
 */
export const addCacheBustingToProduct = (product: any) => {
  if (!product || !product.images) return product;

  return {
    ...product,
    images: product.images.map((img: any, index: number) => ({
      ...img,
      url: addCacheBusting(img.url, index),
    })),
  };
};

/**
 * Add cache busting to all products in an array
 * @param products - Array of products
 * @returns Array of products with cache-busted image URLs
 */
export const addCacheBustingToProducts = (products: any[]) => {
  if (!Array.isArray(products)) return products;

  return products.map((product) => addCacheBustingToProduct(product));
};
