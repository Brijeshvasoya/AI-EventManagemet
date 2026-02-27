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

function generateVenues(eventType: string, guestCount: number, budget: number, location: string) {
  const venueTypes: Record<string, string[]> = {
    wedding: ['Ballroom', 'Garden', 'Beach Resort', 'Historic Mansion', 'Hotel'],
    corporate: ['Conference Center', 'Hotel Meeting Room', 'Rooftop Venue', 'Convention Center'],
    birthday: ['Restaurant Private Room', 'Community Hall', 'Rooftop Bar', 'Event Space'],
    conference: ['Convention Center', 'Hotel Conference Room', 'University Hall', 'Business Center'],
  };

  const baseVenues = [
    {
      name: `${location} Grand Ballroom`,
      type: venueTypes[eventType]?.[0] || 'Event Space',
      capacity: Math.ceil(guestCount * 1.5),
      price: Math.round(budget * 0.4),
      features: ['Parking', 'AV Equipment', 'Catering Kitchen', 'Dance Floor', 'Bar Service'],
      contact: 'events@grandballroom.com',
      rating: 4.5,
      availability: 'Available',
    },
    {
      name: `${location} Garden Pavilion`,
      type: venueTypes[eventType]?.[1] || 'Outdoor Venue',
      capacity: Math.ceil(guestCount * 1.3),
      price: Math.round(budget * 0.3),
      features: ['Outdoor Space', 'Garden Setting', 'Tent Coverage', 'Scenic Views', 'Parking'],
      contact: 'info@gardenpavilion.com',
      rating: 4.7,
      availability: 'Available',
    },
    {
      name: `${location} Modern Conference Center`,
      type: venueTypes[eventType]?.[2] || 'Modern Venue',
      capacity: Math.ceil(guestCount * 1.2),
      price: Math.round(budget * 0.5),
      features: ['Modern AV', 'High-Speed WiFi', 'Multiple Rooms', 'Catering Services', 'Tech Support'],
      contact: 'bookings@conferencecenter.com',
      rating: 4.3,
      availability: 'Limited',
    },
    {
      name: `${location} Historic Estate`,
      type: venueTypes[eventType]?.[3] || 'Unique Venue',
      capacity: Math.ceil(guestCount * 1.1),
      price: Math.round(budget * 0.6),
      features: ['Historic Charm', 'Photo Opportunities', 'Gardens', 'Parking', 'Event Coordinator'],
      contact: 'events@historicestate.com',
      rating: 4.8,
      availability: 'Available',
    },
    {
      name: `${location} Riverside Hotel`,
      type: venueTypes[eventType]?.[4] || 'Hotel Venue',
      capacity: Math.ceil(guestCount * 1.4),
      price: Math.round(budget * 0.35),
      features: ['Hotel Rooms', 'Restaurant', 'Meeting Rooms', 'Parking', 'Shuttle Service'],
      contact: 'events@riversidehotel.com',
      rating: 4.2,
      availability: 'Available',
    },
  ];

  // Filter venues that can accommodate guest count and are within budget
  return baseVenues.filter(venue => 
    venue.capacity >= guestCount && venue.price <= budget
  );
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
