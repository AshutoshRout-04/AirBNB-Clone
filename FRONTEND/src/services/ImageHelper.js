const BEACH_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
];

const CABIN_IMAGES = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1472214222555-d404758b1c42?auto=format&fit=crop&w=800&q=80"
];

const LUXURY_IMAGES = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
];

const LOFT_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
];

// Experience-specific images (outdoor adventures, cultural activities, tours)
const EXPERIENCE_IMAGES = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
];

// Service-specific images (spa, wellness, professional services)
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138daaa4e74b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519416645881-b6a3a5da9eff?auto=format&fit=crop&w=800&q=80"
];

const MOCK_AMENITIES = [
  { name: "Wi-Fi", icon: "wifi" },
  { name: "Kitchen", icon: "utensils" },
  { name: "Air Conditioning", icon: "wind" },
  { name: "Free Parking", icon: "car" },
  { name: "Dedicated workspace", icon: "briefcase" },
  { name: "Hot water", icon: "droplet" },
  { name: "TV", icon: "tv" },
];

export const getPropertyImages = (property) => {
  if (!property) return LOFT_IMAGES;

  // If the property has custom image fields provided by API, put it first, then append other images
  const apiImage =
    property.imageUrl ||
    property.image ||
    property.imageURL ||
    property.photo ||
    property.thumbnail ||
    (Array.isArray(property.images) ? property.images[0] : undefined);

  // Parse photos JSON field for a real uploaded image
  if (!apiImage && property.photos) {
    try {
      const parsed = JSON.parse(property.photos);
      if (Array.isArray(parsed) && parsed[0]?.url) {
        const coverUrl = parsed[0].url;
        // Use the right pool as additional images
        const pool = getPoolForProperty(property);
        return [coverUrl, ...pool.slice(1)];
      }
    } catch (_) {}
  }

  // Use type-specific pools for experiences and services
  const pool = getPoolForProperty(property);

  if (apiImage && apiImage !== "/property-fallback.svg") {
    return [apiImage, ...pool.slice(1)];
  }

  // Permute based on property id or title length to make cards look unique
  const shift = (property.id || (property.title || "").length || 0) % 5;
  const rotated = [...pool.slice(shift), ...pool.slice(0, shift)];
  return rotated;
};

function getPoolForProperty(property) {
  if (property.propertyType === "experience") return EXPERIENCE_IMAGES;
  if (property.propertyType === "service") return SERVICE_IMAGES;

  const title = (property.title || "").toLowerCase();
  const desc = (property.description || "").toLowerCase();
  const loc = (property.location || "").toLowerCase();

  if (title.includes("cabin") || desc.includes("cabin") || title.includes("wood") || desc.includes("forest") || title.includes("mountain") || loc.includes("manali")) {
    return CABIN_IMAGES;
  } else if (title.includes("beach") || desc.includes("beach") || title.includes("ocean") || title.includes("sea") || title.includes("lake") || loc.includes("goa")) {
    return BEACH_IMAGES;
  } else if (title.includes("luxury") || desc.includes("luxury") || title.includes("villa") || desc.includes("villa") || title.includes("mansion") || property.pricePerNight > 8000) {
    return LUXURY_IMAGES;
  }
  return LOFT_IMAGES;
}

export const getPropertyCategory = (property) => {
  if (!property) return "all";
  if (property.propertyType === "experience") return "experiences";
  if (property.propertyType === "service") return "services";

  const title = (property.title || "").toLowerCase();
  const desc = (property.description || "").toLowerCase();
  const loc = (property.location || "").toLowerCase();

  if (title.includes("cabin") || desc.includes("cabin") || title.includes("wood") || desc.includes("forest") || title.includes("mountain") || loc.includes("manali")) {
    return "cabins";
  }
  if (title.includes("beach") || desc.includes("beach") || title.includes("ocean") || title.includes("sea") || loc.includes("goa")) {
    return "beachfront";
  }
  if (title.includes("villa") || desc.includes("luxury") || title.includes("mansion") || property.pricePerNight > 8000) {
    return "mansions";
  }
  if (title.includes("treehouse") || desc.includes("treehouse")) {
    return "treehouses";
  }
  if (title.includes("camp") || desc.includes("camp") || title.includes("tent") || desc.includes("tent")) {
    return "camping";
  }
  if (title.includes("farm") || desc.includes("farm") || desc.includes("barn") || title.includes("ranch")) {
    return "countryside";
  }
  if (title.includes("view") || desc.includes("view") || desc.includes("panoramic")) {
    return "amazing_views";
  }
  
  // High ratings/price can be trending
  if (property.rating >= 4.8 || property.id % 4 === 0) {
    return "trending";
  }

  return "all";
};
