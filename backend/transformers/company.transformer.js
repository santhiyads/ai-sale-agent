// Normalize website to always include protocol
function normalizeWebsite(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `https://${url}`;
}

// Capitalize words for clean display
function capitalize(text) {
  if (!text) return null;
  return text
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Transform raw company API response into AI-ready company object
function companyTransformer(rawCompanyResponse) {
  const company = rawCompanyResponse.data[0];

  return {
    companyId: company.id,
    companyName: capitalize(company.name),
    website: normalizeWebsite(company.website),
    email: company.email,
    phone: company.phone,
    location: capitalize(company.location),
    industry: company.industry,

    about: company.about
      ? `${capitalize(company.name)} specializes in ${company.about.trim()}.`
      : null,

    ctaText: company.button || "Learn More",

    images: {
      logo: company.profileimage,
      cover: company.coverimage
    }
  };
}

module.exports = companyTransformer;

