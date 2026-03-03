import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const venueManagementTool = createTool({
  id: 'venue-management',
  description: 'Find and manage event venues based on requirements',
  inputSchema: z.object({
    eventType: z.string().describe('Type of event'),
    guestCount: z.number().describe('Number of guests'),
    budget: z.number().describe('Venue budget'),
    location: z.string().describe('Preferred city or area'),
    requirements: z.string().optional().describe('Specific venue requirements'),
  }),
  outputSchema: z.object({
    venues: z.array(z.object({
      name: z.string(),
      type: z.string(),
      capacity: z.number(),
      price: z.number(),
      features: z.array(z.string()),
      contact: z.string(),
      rating: z.number(),
      availability: z.string(),
    })),
    recommendations: z.array(z.string()),
    tips: z.array(z.string()),
  }),
  execute: async ({ eventType, guestCount, budget, location, requirements }) => {
    // Generate mock venue data based on requirements
    const venues = generateVenues(eventType, guestCount, budget, location);
    
    // Generate recommendations
    const recommendations = generateVenueRecommendations(eventType, guestCount, budget);
    
    // Generate tips
    const tips = generateVenueTips(eventType, guestCount);

    return {
      venues,
      recommendations,
      tips,
    };
  },
});

async function generateVenues(eventType: string, guestCount: number, budget: number, location: string) {
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );
  const geoData = await geoRes.json();

  if (!geoData.length) return [];

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  // 2️⃣ Overpass API query (Free)
  const query = `
    [out:json];
    (
      node["amenity"="events_venue"](around:5000,${lat},${lon});
      node["amenity"="community_centre"](around:5000,${lat},${lon});
      node["tourism"="hotel"](around:5000,${lat},${lon});
    );
    out;
  `;

  const overpassRes = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  const data = await overpassRes.json();

  return data.elements.slice(0, 6).map((place: any) => ({
    name: place.tags.name || "Unnamed Venue",
    type: eventType + " Venue",
    capacity: 50 + Math.floor(Math.random() * 200),
    price: 20000 + Math.floor(Math.random() * 80000),
    features: Object.keys(place.tags),
    contact: place.tags.phone || "Not Available",
    rating: 3.5 + Math.random() * 1.5,
    availability: "Contact Venue",
  }));
}

function generateVenueRecommendations(eventType: string, guestCount: number, budget: number) {
  const recommendations = [
    `Book venue 3-6 months in advance for ${eventType} events`,
    `Visit venues in person before booking for ${guestCount}+ guests`,
    'Get all agreements in writing and read cancellation policies carefully',
    'Ask about package deals that include catering or decorations',
    'Check if the venue has proper insurance and permits',
  ];

  if (guestCount > 100) {
    recommendations.push('Consider venues with multiple rooms or breakout spaces');
  }

  if (eventType === 'wedding') {
    recommendations.push('Ask about wedding packages and bridal suite access', 'Check if venue has rain backup plan');
  }

  return recommendations;
}

function generateVenueTips(eventType: string, guestCount: number) {
  const tips = [
    'Create a venue comparison spreadsheet with pros and cons',
    'Factor in additional costs like service charges and gratuities',
    'Check parking capacity and accessibility for all guests',
    'Ask about noise restrictions and curfew times',
    'Verify what furniture and equipment are included',
  ];

  if (guestCount > 50) {
    tips.push('Consider flow and traffic patterns for large groups', 'Plan for clear signage and wayfinding');
  }

  if (eventType === 'corporate') {
    tips.push('Ensure reliable WiFi and power outlets for presentations', 'Check AV capabilities and technical support');
  }

  return tips;
}
