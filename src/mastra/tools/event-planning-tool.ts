import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const eventPlanningTool = createTool({
  id: 'event-planning',
  description: 'Plan and structure events with timelines and milestones',
  inputSchema: z.object({
    eventType: z.string().describe('Type of event (wedding, corporate, birthday, conference, etc.)'),
    guestCount: z.number().describe('Expected number of guests'),
    budget: z.number().describe('Event budget in USD'),
    date: z.string().describe('Event date (YYYY-MM-DD format)'),
    duration: z.string().describe('Event duration (e.g., "4 hours", "2 days")'),
    location: z.string().describe('Event location or city'),
    specialRequirements: z.string().optional().describe('Any special requirements or preferences'),
  }),
  outputSchema: z.object({
    timeline: z.array(z.object({
      phase: z.string(),
      tasks: z.array(z.string()),
      deadline: z.string(),
      priority: z.string(),
    })),
    budgetBreakdown: z.object({
      venue: z.number(),
      catering: z.number(),
      decoration: z.number(),
      entertainment: z.number(),
      miscellaneous: z.number(),
    }),
    checklist: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ eventType, guestCount, budget, date, location }) => {
    // Calculate budget breakdown percentages
    const venuePercentage = 0.35; // 35% for venue
    const cateringPercentage = 0.30; // 30% for catering
    const decorationPercentage = 0.15; // 15% for decoration
    const entertainmentPercentage = 0.15; // 15% for entertainment
    const miscellaneousPercentage = 0.05; // 5% for miscellaneous

    const budgetBreakdown = {
      venue: Math.round(budget * venuePercentage),
      catering: Math.round(budget * cateringPercentage),
      decoration: Math.round(budget * decorationPercentage),
      entertainment: Math.round(budget * entertainmentPercentage),
      miscellaneous: Math.round(budget * miscellaneousPercentage),
    };

    // Generate timeline based on event type
    const timeline = generateTimeline(eventType, date, guestCount);
    
    // Generate checklist
    const checklist = generateChecklist(eventType, guestCount);
    
    // Generate recommendations
    const recommendations = generateRecommendations(eventType, guestCount, budget, location);

    return {
      timeline,
      budgetBreakdown,
      checklist,
      recommendations,
    };
  },
});

function generateTimeline(eventType: string, date: string, guestCount: number) {
  const baseTimeline = [
    {
      phase: 'Planning Phase (3-6 months before)',
      tasks: [
        'Set budget and secure funding',
        'Create guest list',
        'Research and book venue',
        'Hire key vendors (caterer, photographer, etc.)',
        'Send save-the-date notices',
      ],
      deadline: new Date(new Date(date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'High',
    },
    {
      phase: 'Coordination Phase (1-2 months before)',
      tasks: [
        'Finalize menu with caterer',
        'Order invitations',
        'Plan decorations and theme',
        'Arrange transportation if needed',
        'Confirm all vendor contracts',
      ],
      deadline: new Date(new Date(date).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'High',
    },
    {
      phase: 'Final Week',
      tasks: [
        'Send final invitations',
        'Confirm RSVPs',
        'Create seating arrangement',
        'Prepare day-of timeline',
        'Pack emergency kit',
      ],
      deadline: new Date(new Date(date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Critical',
    },
    {
      phase: 'Day Before Event',
      tasks: [
        'Reconfirm all vendors',
        'Prepare venue setup plan',
        'Charge all equipment',
        'Review day-of timeline',
        'Get rest',
      ],
      deadline: new Date(new Date(date).getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Critical',
    },
  ];

  return baseTimeline;
}

function generateChecklist(eventType: string, guestCount: number) {
  const baseChecklist = [
    '□ Set event budget',
    '□ Create guest list',
    '□ Book venue',
    '□ Hire caterer',
    '□ Send invitations',
    '□ Track RSVPs',
    '□ Plan decorations',
    '□ Arrange entertainment',
    '□ Create day-of timeline',
    '□ Prepare emergency contacts',
    '□ Test all equipment',
  ];

  if (guestCount > 50) {
    baseChecklist.push('□ Hire event coordinator', '□ Setup registration desk');
  }

  if (eventType === 'wedding') {
    baseChecklist.push('□ Book wedding officiant', '□ Order wedding cake', '□ Plan rehearsal dinner');
  } else if (eventType === 'corporate') {
    baseChecklist.push('□ Prepare presentation materials', '□ Setup registration system', '□ Arrange name tags');
  }

  return baseChecklist;
}

function generateRecommendations(eventType: string, guestCount: number, budget: number, location: string) {
  const recommendations = [
    `Consider a venue that can accommodate ${Math.ceil(guestCount * 1.2)} guests for extra space`,
    `Allocate 10-15% of budget for contingency expenses`,
    'Create a detailed day-of timeline with buffer time between activities',
    'Have a backup plan for outdoor venues in case of bad weather',
    'Send reminders to vendors 48 hours before the event',
  ];

  if (budget > 10000) {
    recommendations.push('Consider hiring a professional event coordinator for stress-free management');
  }

  if (eventType === 'corporate') {
    recommendations.push('Ensure proper AV equipment and technical support', 'Provide networking opportunities');
  }

  return recommendations;
}
