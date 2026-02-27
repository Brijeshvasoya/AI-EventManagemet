import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { eventManagementAgent } from '../agents/event-management-agent'
import { eventPlanningTool } from '../tools/event-planning-tool'

/* -------------------------------------------------- */
/* SCHEMAS */
/* -------------------------------------------------- */

const eventDetailsSchema = z.object({
  eventType: z.string().nullable(),
  guestCount: z.number().nullable(),
  budget: z.number().nullable(),
  date: z.string().nullable(),
  duration: z.number().nullable(),
  location: z.string().nullable(),
  specialRequirements: z.string().nullable(),
})

const finalOutputSchema = z.object({
  structuredDetails: eventDetailsSchema,
  eventPlan: z.any(),
  venueRecommendations: z.string(),
  timeline: z.string(),
})

/* -------------------------------------------------- */
/* STEP 1: Extract Structured Event Details */
/* -------------------------------------------------- */

const extractEventDetails = createStep({
  id: 'extract-event-details',
  description: 'Extract structured event planning details from user request',
  inputSchema: z.object({
    userRequest: z.string(),
  }),
  outputSchema: eventDetailsSchema,
  execute: async ({ inputData }) => {
    const prompt = `
Extract structured event information from this request:

"${inputData.userRequest}"

Return ONLY valid JSON with:

{
  eventType: string | null,
  guestCount: number | null,
  budget: number | null,
  date: string | null,
  duration: number | null,
  location: string | null,
  specialRequirements: string | null
}

If any field missing, set null.
`

    const response = await eventManagementAgent.generate(prompt)

    return JSON.parse(response.text)
  },
})

/* -------------------------------------------------- */
/* STEP 2: Generate Core Event Plan (Tool Based) */
/* -------------------------------------------------- */

const generateEventPlan = createStep({
  id: 'generate-event-plan',
  description: 'Generate structured event plan using event planning tool',
  inputSchema: eventDetailsSchema,
  outputSchema: z.object({
    structuredDetails: eventDetailsSchema,
    eventPlan: z.any(),
  }),
  execute: async ({ inputData }) => {
    if (!eventPlanningTool.execute) {
      throw new Error('eventPlanningTool execute method not found')
    }

    const plan = await eventPlanningTool.execute(
      {
        eventType: inputData.eventType ?? '',
        guestCount: inputData.guestCount ?? 0,
        budget: inputData.budget ?? 0,
        date: inputData.date ?? '',
        duration: String(inputData.duration ?? ''),
        location: inputData.location ?? '',
        specialRequirements: inputData.specialRequirements ?? '',
      },
      {} as any
    )

    return {
      structuredDetails: inputData,
      eventPlan: plan,
    }
  },
})

/* -------------------------------------------------- */
/* STEP 3: Venue Recommendations */
/* -------------------------------------------------- */

const generateVenueRecommendations = createStep({
  id: 'generate-venue-recommendations',
  description: 'Generate smart venue recommendations',
  inputSchema: z.object({
    structuredDetails: eventDetailsSchema,
    eventPlan: z.any(),
  }),
  outputSchema: z.object({
    structuredDetails: eventDetailsSchema,
    eventPlan: z.any(),
    venueRecommendations: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { structuredDetails } = inputData

    const prompt = `
Suggest 3–5 venue recommendations for:

Event Type: ${structuredDetails.eventType}
Guest Count: ${structuredDetails.guestCount}
Budget: ${structuredDetails.budget}
Location: ${structuredDetails.location}

For each venue include:
- Venue name
- Capacity
- Estimated cost
- Pros & cons
- Why it fits this event
`

    const response = await eventManagementAgent.generate(prompt)

    return {
      ...inputData,
      venueRecommendations: response.text,
    }
  },
})

/* -------------------------------------------------- */
/* STEP 4: Timeline & Checklist */
/* -------------------------------------------------- */

const generateTimeline = createStep({
  id: 'generate-timeline',
  description: 'Generate event timeline & checklist',
  inputSchema: z.object({
    structuredDetails: eventDetailsSchema,
    eventPlan: z.any(),
    venueRecommendations: z.string(),
  }),
  outputSchema: finalOutputSchema,
  execute: async ({ inputData }) => {
    const { structuredDetails } = inputData

    const prompt = `
Create detailed timeline & checklist for:

Event Type: ${structuredDetails.eventType}
Guests: ${structuredDetails.guestCount}
Duration: ${structuredDetails.duration} hours

Include:
- Pre-event planning timeline
- Event day hourly breakdown
- Post-event checklist
- Vendor coordination milestones
`

    const response = await eventManagementAgent.generate(prompt)

    return {
      ...inputData,
      timeline: response.text,
    }
  },
})

/* -------------------------------------------------- */
/* WORKFLOW */
/* -------------------------------------------------- */

export const eventPlanningWorkflow = createWorkflow({
  id: 'event-planning-workflow',
  inputSchema: z.object({
    userRequest: z.string(),
  }),
  outputSchema: finalOutputSchema,
})
  .then(extractEventDetails)
  .then(generateEventPlan)
  .then(generateVenueRecommendations)
  .then(generateTimeline)

eventPlanningWorkflow.commit()

export default eventPlanningWorkflow