// Capitalize product name for clean display
function capitalize(text) {
  if (!text) return null;
  return text
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Calculate discount percentage safely
function calculateDiscount(regular, market) {
  if (!regular || !market) return 0;
  if (market <= regular) return 0;
  return Math.round(((market - regular) / market) * 100);
}

// Transform raw product API response into AI-ready products
function productTransformer(rawProductResponse) {
  return rawProductResponse.data.map(product => {
    const regularPrice = Number(product.regular_price);
    const marketPrice = Number(product.market_price);
    const discount = calculateDiscount(regularPrice, marketPrice);

    return {
      productId: product.id,
      productName: capitalize(product.name),
      description: product.description,
      price: regularPrice,
      marketPrice: marketPrice,
      discountPercentage: discount,
      hasDiscount: discount > 0,
      image: product.images,
      isActive: product.isActive === 1
    };
  });
}

module.exports = productTransformer;
