import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const vendorCoordinationTool = createTool({
  id: 'vendor-coordination',
  description: 'Coordinate and manage event vendors and services',
  inputSchema: z.object({
    action: z.enum(['find-vendors', 'coordinate-vendors', 'track-vendors', 'evaluate-vendors']).describe('Action to perform'),
    eventType: z.string().describe('Type of event'),
    budget: z.number().optional().describe('Total budget for vendor services'),
    location: z.string().optional().describe('Event location'),
    requirements: z.array(z.string()).optional().describe('Specific vendor requirements'),
  }),
  outputSchema: z.object({
    vendors: z.array(z.object({
      name: z.string(),
      category: z.string(),
      rating: z.number(),
      price: z.number(),
      contact: z.string(),
      services: z.array(z.string()),
      availability: z.string(),
      reviews: z.number(),
    })),
    coordinationPlan: z.object({
      timeline: z.array(z.object({
        task: z.string(),
        vendor: z.string(),
        deadline: z.string(),
        status: z.string(),
      })),
      communicationLog: z.array(z.object({
        date: z.string(),
        vendor: z.string(),
        message: z.string(),
        followUp: z.string(),
      })),
    }),
    recommendations: z.array(z.string()),
    evaluationCriteria: z.object({
      questions: z.array(z.string()),
      scoringMatrix: z.object({
        criteria: z.array(z.string()),
        weights: z.array(z.number()),
      }),
    }),
  }),
  execute: async ({ action, eventType, budget, location, requirements }) => {
    switch (action) {
      case 'find-vendors':
        return findVendors(eventType, budget, location, requirements);
      case 'coordinate-vendors':
        return coordinateVendors(eventType, budget);
      case 'track-vendors':
        return trackVendors();
      case 'evaluate-vendors':
        return evaluateVendors(eventType);
      default:
        throw new Error('Invalid action specified');
    }
  },
});

function findVendors(eventType: string, budget: number, location: string, requirements: string[]) {
  const vendorCategories = {
    wedding: ['Caterer', 'Photographer', 'Florist', 'DJ/Band', 'Venue', 'Wedding Planner', 'Bakery'],
    corporate: ['Caterer', 'AV Equipment', 'Venue', 'Event Planner', 'Transportation', 'Security'],
    birthday: ['Venue', 'Caterer', 'Entertainment', 'Bakery', 'Photographer'],
    conference: ['Venue', 'Caterer', 'AV Equipment', 'Registration Services', 'Transportation', 'Speakers'],
  };

  const vendors = [];
  const categories = vendorCategories[eventType as keyof typeof vendorCategories] || vendorCategories.corporate;

  categories.forEach(category => {
    // Generate 2-3 vendors per category
    const vendorCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < vendorCount; i++) {
      vendors.push(generateVendor(category, location, budget));
    }
  });

  return {
    vendors: vendors.slice(0, 15), // Return top 15 vendors
    coordinationPlan: generateCoordinationPlan(vendors),
    recommendations: generateVendorRecommendations(eventType, budget),
    evaluationCriteria: generateEvaluationCriteria(eventType),
  };
}

function generateVendor(category: string, location: string, budget: number) {
  const basePrice = budget * 0.15; // Average 15% of total budget per vendor
  const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
  
  const vendorServices: Record<string, string[]> = {
    'Caterer': ['Full-service catering', 'Buffet service', 'Plated dinners', 'Cocktail service'],
    'Photographer': ['Event photography', 'Video coverage', 'Drone photography', 'Photo albums'],
    'Florist': ['Bridal bouquets', 'Centerpieces', 'Ceremony flowers', 'Reception decorations'],
    'DJ/Band': ['Music entertainment', 'Lighting', 'Sound system', 'MC services'],
    'Venue': ['Event space rental', 'Setup/cleanup', 'Parking', 'Security'],
    'Wedding Planner': ['Full coordination', 'Day-of coordination', 'Vendor management', 'Timeline creation'],
    'Bakery': ['Wedding cake', 'Dessert bar', 'Birthday cakes', 'Pastries'],
    'AV Equipment': ['Sound systems', 'Projectors', 'Lighting', 'Live streaming'],
    'Event Planner': ['Event coordination', 'Timeline management', 'Vendor negotiation', 'Day-of support'],
    'Transportation': ['Shuttle service', 'Valet parking', 'Airport transfers', 'Group transportation'],
    'Security': ['Event security', 'Crowd control', 'Emergency response', 'Access control'],
    'Registration Services': ['Check-in management', 'Badge printing', 'Registration software', 'Welcome desk'],
    'Speakers': ['Keynote speakers', 'Session presenters', 'Workshop leaders', 'Panel moderators'],
  };

  return {
    name: `${location} ${category} ${Math.floor(Math.random() * 5 + 1)}`,
    category,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0 rating
    price: Math.round(basePrice * (1 + priceVariation)),
    contact: `contact@vendor${Math.floor(Math.random() * 1000)}.com`,
    services: vendorServices[category] || ['General services'],
    availability: Math.random() > 0.3 ? 'Available' : 'Limited',
    reviews: Math.floor(Math.random() * 200 + 50),
  };
}

function generateCoordinationPlan(vendors: Array<any>) {
  const timeline = [
    {
      task: 'Initial vendor contact and quotes',
      vendor: 'All Vendors',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    },
    {
      task: 'Contract signing and deposits',
      vendor: 'Selected Vendors',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    },
    {
      task: 'Final requirements confirmation',
      vendor: 'All Vendors',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    },
    {
      task: 'Day-of coordination briefing',
      vendor: 'All Vendors',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
    },
  ];

  const communicationLog = [
    {
      date: new Date().toISOString().split('T')[0],
      vendor: 'Initial Contact',
      message: 'Reached out to potential vendors for availability and pricing',
      followUp: 'Follow up in 3-5 business days',
    },
  ];

  return {
    timeline,
    communicationLog,
  };
}

function generateVendorRecommendations(eventType: string, budget: number) {
  const recommendations = [
    'Get at least 3 quotes per vendor category',
    'Check vendor portfolios and recent reviews',
    'Ask for references from recent similar events',
    'Verify insurance and licensing requirements',
    'Clarify what\'s included in vendor packages',
    'Negotiate payment terms and schedules',
  ];

  if (budget > 15000) {
    recommendations.push('Consider hiring an event coordinator for vendor management');
  }

  if (eventType === 'wedding') {
    recommendations.push('Schedule vendor walkthrough 1 week before', 'Create day-of emergency contact list');
  } else if (eventType === 'corporate') {
    recommendations.push('Ensure vendors understand corporate protocols', 'Setup vendor check-in system');
  }

  return recommendations;
}

function generateEvaluationCriteria(eventType: string) {
  const criteria = {
    wedding: [
      'Portfolio quality and style compatibility',
      'Professionalism and communication',
      'Price transparency and value',
      'Availability and responsiveness',
      'Equipment and service quality',
    ],
    corporate: [
      'Corporate experience and references',
      'Professional reliability and punctuality',
      'Technical capabilities and equipment',
      'Scalability and flexibility',
      'Cost-effectiveness and value',
    ],
    birthday: [
      'Experience with similar events',
      'Creativity and entertainment value',
      'Reliability and backup plans',
      'Child-friendly experience (if applicable)',
      'Price and package options',
    ],
    conference: [
      'Conference and AV experience',
      'Technical capabilities',
      'Professional references',
      'Scalability for group size',
      'Setup and support quality',
    ],
  };

  const selectedCriteria = criteria[eventType as keyof typeof criteria] || criteria.corporate;
  
  return {
    questions: [
      'How long have you been in business?',
      'Can you provide references from similar events?',
      'What is included in your pricing?',
      'Do you have liability insurance?',
      'What is your backup plan for emergencies?',
      'How do you handle changes or cancellations?',
      ...selectedCriteria,
    ],
    scoringMatrix: {
      criteria: selectedCriteria,
      weights: [0.25, 0.20, 0.20, 0.15, 0.10, 0.10], // Total weight = 1.0
    },
  };
}

function coordinateVendors(eventType: string, budget: number) {
  return {
    vendors: [],
    coordinationPlan: {
      timeline: [
        {
          task: 'Vendor selection and booking',
          vendor: 'Event Coordinator',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'In Progress',
        },
      ],
      communicationLog: [
        {
          date: new Date().toISOString().split('T')[0],
          vendor: 'Coordination Team',
          message: `Initiated vendor coordination for ${eventType} with budget $${budget}`,
          followUp: 'Weekly status meetings scheduled',
        },
      ],
    },
    recommendations: [
      'Create master vendor contact list',
      'Schedule regular coordination meetings',
      'Establish clear communication protocols',
      'Document all vendor agreements',
      'Create day-of emergency procedures',
    ],
    evaluationCriteria: generateEvaluationCriteria(eventType),
  };
}

function trackVendors() {
  return {
    vendors: [],
    coordinationPlan: {
      timeline: [
        {
          task: 'Vendor performance tracking',
          vendor: 'All Active Vendors',
          deadline: new Date().toISOString().split('T')[0],
          status: 'Ongoing',
        },
      ],
      communicationLog: [
        {
          date: new Date().toISOString().split('T')[0],
          vendor: 'Status Update',
          message: 'Weekly vendor check-ins and performance reviews',
          followUp: 'Address any issues immediately',
        },
      ],
    },
    recommendations: [
      'Maintain detailed vendor files',
      'Schedule regular check-in calls',
      'Document all communications',
      'Track budget vs actual costs',
      'Plan for vendor meals and breaks',
    ],
    evaluationCriteria: {
      questions: ['Performance rating', 'Communication quality', 'Budget adherence', 'Problem resolution'],
      scoringMatrix: {
        criteria: ['Performance', 'Communication', 'Budget', 'Problem Solving'],
        weights: [0.30, 0.25, 0.25, 0.20],
      },
    },
  };
}

function evaluateVendors(eventType: string) {
  const sevenDaysFromNow = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  return {
    vendors: [],
    coordinationPlan: {
      timeline: [
        {
          task: 'Post-event vendor evaluation',
          vendor: 'Evaluation Team',
          deadline: new Date(Date.now() + sevenDaysFromNow).toISOString().split('T')[0],
          status: 'Scheduled',
        },
      ],
      communicationLog: [
        {
          date: new Date().toISOString().split('T')[0],
          vendor: 'All Vendors',
          message: 'Requesting post-event feedback and evaluation forms',
          followUp: 'Schedule debrief meetings',
        },
      ],
    },
    recommendations: [
      'Send evaluation forms within 48 hours',
      'Request detailed feedback from all vendors',
      'Document lessons learned for future events',
      'Update vendor database with performance notes',
      'Consider long-term vendor relationships',
    ],
    evaluationCriteria: {
      questions: ['Performance rating', 'Communication quality', 'Budget adherence', 'Problem resolution'],
      scoringMatrix: {
        criteria: ['Performance', 'Communication', 'Budget', 'Problem Solving'],
        weights: [0.30, 0.25, 0.25, 0.20],
      },
    },
  };
}
