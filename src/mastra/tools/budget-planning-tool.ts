import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const budgetPlanningTool = createTool({
  id: 'budget-planning',
  description: 'Plan and manage event budgets with detailed breakdowns',
  inputSchema: z.object({
    totalBudget: z.number().describe('Total event budget'),
    eventType: z.string().describe('Type of event'),
    guestCount: z.number().describe('Number of guests'),
    duration: z.string().optional().describe('Event duration'),
    priorityItems: z.array(z.string()).optional().describe('High-priority budget items'),
  }),
  outputSchema: z.object({
    budgetBreakdown: z.object({
      venue: z.number(),
      catering: z.number(),
      beverages: z.number(),
      decoration: z.number(),
      entertainment: z.number(),
      photography: z.number(),
      staff: z.number(),
      contingency: z.number(),
      miscellaneous: z.number(),
    }),
    recommendations: z.array(z.string()),
    costSavingTips: z.array(z.string()),
    trackingTemplate: z.object({
      categories: z.array(z.string()),
      estimated: z.array(z.number()),
      actual: z.array(z.number()),
      variance: z.array(z.number()),
    }),
  }),
  execute: async ({ totalBudget, eventType, guestCount, duration, priorityItems }) => {
    // Generate budget breakdown
    const breakdown = generateBudgetBreakdown(totalBudget, eventType, guestCount);

    // Generate recommendations
    const recommendations = generateBudgetRecommendations(totalBudget, eventType, guestCount);

    // Generate cost-saving tips
    const costSavingTips = generateCostSavingTips(eventType, guestCount);

    // Create tracking template
    const trackingTemplate = createTrackingTemplate(breakdown);

    return {
      budgetBreakdown: breakdown,
      recommendations,
      costSavingTips,
      trackingTemplate,
    };
  },
});

function generateBudgetBreakdown(totalBudget: number, eventType: string, guestCount: number) {
  // Standard percentage allocations based on event type
  const allocations: Record<string, Record<string, number>> = {
    wedding: {
      venue: 0.35,
      catering: 0.30,
      beverages: 0.10,
      decoration: 0.10,
      entertainment: 0.08,
      photography: 0.05,
      staff: 0.02,
    },
    corporate: {
      venue: 0.25,
      catering: 0.35,
      beverages: 0.15,
      avEquipment: 0.10,
      staff: 0.10,
      miscellaneous: 0.05,
    },
    birthday: {
      venue: 0.30,
      catering: 0.40,
      decoration: 0.15,
      entertainment: 0.10,
      miscellaneous: 0.05,
    },
    conference: {
      venue: 0.40,
      catering: 0.25,
      avEquipment: 0.20,
      staff: 0.10,
      miscellaneous: 0.05,
    },
  };

  const eventAllocation = allocations[eventType] || allocations.corporate;
  const contingency = totalBudget * 0.10; // 10% contingency

  const breakdown: Record<string, number> = {};
  let allocatedTotal = 0;

  // Apply allocations
  Object.entries(eventAllocation).forEach(([category, percentage]) => {
    breakdown[category] = Math.round(totalBudget * percentage);
    allocatedTotal += breakdown[category];
  });

  // Add contingency
  breakdown.contingency = Math.round(contingency);

  // Calculate miscellaneous (remaining budget)
  const totalAllocated = allocatedTotal + contingency;
  breakdown.miscellaneous = Math.max(0, totalBudget - totalAllocated);

  return breakdown;
}

function generateBudgetRecommendations(totalBudget: number, eventType: string, guestCount: number) {
  const recommendations = [
    `Allocate 10-15% of budget for contingency expenses`,
    `Get detailed quotes from at least 3 vendors per category`,
    `Negotiate package deals for multiple services together`,
    `Consider off-peak days or seasons for better rates`,
    `Track all expenses in real-time to avoid overspending`,
  ];

  if (totalBudget > 20000) {
    recommendations.push('Consider hiring a professional event planner for large budgets');
  }

  if (guestCount > 100) {
    recommendations.push('Budget for additional staff and security', 'Consider per-person catering costs');
  }

  if (eventType === 'wedding') {
    recommendations.push('Allocate extra budget for wedding attire and rings', 'Consider honeymoon costs in total budget');
  } else if (eventType === 'corporate') {
    recommendations.push('Budget for professional presentation materials', 'Consider team-building activities');
  }

  const perPersonBudget = totalBudget / guestCount;
  if (perPersonBudget < 50) {
    recommendations.push('Consider increasing budget or reducing guest count for better experience');
  }

  return recommendations;
}

function generateCostSavingTips(eventType: string, guestCount: number) {
  const tips = [
    'Book venues and vendors well in advance for early-bird discounts',
    'Consider weekday events instead of weekends for lower rates',
    'Opt for buffet or family-style service to reduce staff costs',
    'Use digital invitations to save on printing and postage',
    'Compare prices from multiple vendors before booking',
    'Negotiate for package deals that bundle multiple services',
  ];

  if (guestCount > 50) {
    tips.push('Bulk order supplies and decorations', 'Consider volunteer staff for non-critical roles');
  }

  if (eventType === 'wedding') {
    tips.push('Consider off-season wedding dates', 'Use in-season flowers and decorations');
  } else if (eventType === 'corporate') {
    tips.push('Use in-house AV equipment when possible', 'Negotiate corporate rates with hotels');
  }

  return [
    ...tips,
    'DIY decorations and centerpieces can save significantly',
    'Consider cash bars instead of open bars to control costs',
    'Partner with local businesses for sponsorships',
    'Use student photographers or emerging talent for better rates',
  ];
}

function createTrackingTemplate(breakdown: Record<string, number>) {
  const categories = Object.keys(breakdown);
  const estimated = Object.values(breakdown);
  const actual = new Array(estimated.length).fill(0); // Initialize with zeros for actual tracking
  const variance = estimated.map((est, index) => est - actual[index]);

  return {
    categories,
    estimated,
    actual,
    variance,
  };
}
