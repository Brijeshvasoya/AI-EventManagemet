import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const guestManagementTool = createTool({
  id: 'guest-management',
  description: 'Manage guest lists, RSVPs, and guest communications',
  inputSchema: z.object({
    action: z.enum(['create-list', 'track-rsvp', 'send-invitations', 'manage-seating']).describe('Action to perform'),
    guestCount: z.number().optional().describe('Number of expected guests'),
    eventType: z.string().optional().describe('Type of event'),
    guestData: z.array(z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      address: z.string().optional(),
      dietary: z.string().optional(),
      plusOne: z.boolean().optional(),
    })).optional().describe('Guest data for list creation'),
  }),
  outputSchema: z.object({
    guestList: z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      address: z.string().optional(),
      dietary: z.string().optional(),
      plusOne: z.boolean(),
      rsvpStatus: z.enum(['pending', 'confirmed', 'declined']),
      invitationSent: z.boolean(),
    })),
    statistics: z.object({
      totalInvited: z.number(),
      confirmed: z.number(),
      declined: z.number(),
      pending: z.number(),
      plusOnes: z.number(),
    }),
    templates: z.object({
      invitation: z.string(),
      followUp: z.string(),
      seatingChart: z.string(),
    }),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ action, guestCount, eventType, guestData }) => {
    switch (action) {
      case 'create-list':
        return createGuestList(guestData || generateMockGuests(guestCount));
      case 'track-rsvp':
        return trackRSVP(guestData || []);
      case 'send-invitations':
        return sendInvitations(guestData || []);
      case 'manage-seating':
        return manageSeating(guestData || [], eventType);
      default:
        throw new Error('Invalid action specified');
    }
  },
});

function createGuestList(guestData: any[]) {
  const guestList = guestData.map((guest, index) => ({
    id: `guest_${index + 1}`,
    name: guest.name,
    email: guest.email,
    phone: guest.phone || '',
    address: guest.address || '',
    dietary: guest.dietary || '',
    plusOne: guest.plusOne || false,
    rsvpStatus: 'pending' as const,
    invitationSent: false,
  }));

  const statistics = calculateStatistics(guestList);

  return {
    guestList,
    statistics,
    templates: generateTemplates(),
    recommendations: generateGuestRecommendations(guestList),
  };
}

function generateMockGuests(count: number) {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];

  const guests = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    guests.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone: `+1-555-${Math.floor(Math.random() * 9000 + 1000)}`,
      address: `${Math.floor(Math.random() * 9999 + 1)} Main St, City, ST 12345`,
      dietary: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free'][Math.floor(Math.random() * 4)],
      plusOne: Math.random() > 0.5,
    });
  }

  return guests;
}

function calculateStatistics(guestList: any[]) {
  const totalInvited = guestList.length;
  const confirmed = guestList.filter(g => g.rsvpStatus === 'confirmed').length;
  const declined = guestList.filter(g => g.rsvpStatus === 'declined').length;
  const pending = guestList.filter(g => g.rsvpStatus === 'pending').length;
  const plusOnes = guestList.filter(g => g.plusOne).length;

  return {
    totalInvited,
    confirmed,
    declined,
    pending,
    plusOnes,
  };
}

function generateTemplates() {
  return {
    invitation: `Dear [Guest Name],

You are cordially invited to celebrate with us at [Event Type] on [Date] at [Time].

[Event Details]
Location: [Venue]
Address: [Address]
Dress Code: [Dress Code]

Please RSVP by [RSVP Date] by replying to this email or calling [Phone Number].

We look forward to celebrating with you!

Best regards,
[Host Name]`,
    
    followUp: `Hi [Guest Name],

Just a friendly reminder about your invitation to [Event Type] on [Date]. We haven't received your RSVP yet.

Please let us know if you can attend by [Final RSVP Date] so we can finalize our arrangements.

Hope to see you there!

Best,
[Host Name]`,

    seatingChart: `Seating Arrangement Guidelines:

1. Family and close friends: Front tables
2. Colleagues: Middle section
3. Acquaintances: Back section
4. Consider dietary restrictions at each table
5. Ensure easy access to exits and facilities
6. Place gift table near entrance
7. Head table placement for hosts/VIPs
8. Dance floor visibility from main tables`,
  };
}

function generateGuestRecommendations(guestList: any[]) {
  const recommendations = [
    'Send invitations 6-8 weeks before the event',
    'Include clear RSVP deadline (usually 2 weeks before)',
    'Offer multiple RSVP methods (email, phone, online form)',
    'Follow up with non-responders 1 week before deadline',
    'Create a separate email list for updates and reminders',
  ];

  const totalGuests = guestList.length + guestList.filter(g => g.plusOne).length;
  
  if (totalGuests > 50) {
    recommendations.push('Consider assigned seating for large groups', 'Use name tags for easy identification');
  }

  const dietaryRestrictions = guestList.filter(g => g.dietary && g.dietary !== 'None').length;
  if (dietaryRestrictions > 0) {
    recommendations.push('Coordinate with caterer for dietary accommodations', 'Label food options clearly');
  }

  return recommendations;
}

function trackRSVP(guestData: any[]) {
  // Simulate RSVP tracking
  const updatedGuestList = guestData.map(guest => ({
    ...guest,
    rsvpStatus: Math.random() > 0.3 ? 'confirmed' : Math.random() > 0.5 ? 'declined' : 'pending',
  }));

  const statistics = calculateStatistics(updatedGuestList);

  return {
    guestList: updatedGuestList,
    statistics,
    templates: generateTemplates(),
    recommendations: [
      'Send confirmation emails to confirmed guests',
      'Follow up with pending responses',
      'Update catering numbers based on confirmations',
      'Create final seating arrangement',
    ],
  };
}

function sendInvitations(guestData: any[]) {
  // Simulate sending invitations
  const updatedGuestList = guestData.map(guest => ({
    ...guest,
    invitationSent: true,
    rsvpStatus: 'pending' as const,
  }));

  const statistics = calculateStatistics(updatedGuestList);

  return {
    guestList: updatedGuestList,
    statistics,
    templates: generateTemplates(),
    recommendations: [
      'Monitor email delivery rates',
      'Prepare for follow-up communications',
      'Set up RSVP tracking system',
      'Prepare welcome materials for confirmed guests',
    ],
  };
}

function manageSeating(guestData: any[], eventType: string) {
  const seatingArrangements = generateSeatingArrangements(guestData, eventType);
  
  return {
    guestList: guestData,
    statistics: calculateStatistics(guestData),
    templates: {
      ...generateTemplates(),
      seatingChart: seatingArrangements.chart,
    },
    recommendations: [
      'Consider guest relationships when arranging tables',
      'Ensure accessibility for elderly or disabled guests',
      'Place children\'s table near parents if applicable',
      'Consider noise levels for different table locations',
      'Have extra chairs ready for unexpected plus-ones',
    ],
  };
}

function generateSeatingArrangements(guestData: any[], eventType: string) {
  const tables = [];
  const guestsPerTable = eventType === 'wedding' ? 8 : 6;
  
  for (let i = 0; i < guestData.length; i += guestsPerTable) {
    const tableGuests = guestData.slice(i, i + guestsPerTable);
    tables.push({
      tableNumber: Math.floor(i / guestsPerTable) + 1,
      guests: tableGuests.map(g => g.name),
      capacity: guestsPerTable,
      location: `${eventType === 'wedding' ? 'Near dance floor' : 'Center of room'} - Table ${Math.floor(i / guestsPerTable) + 1}`,
    });
  }

  return {
    chart: `Table Arrangement:\n\n${tables.map(table => 
      `Table ${table.tableNumber} (${table.location}):\n${table.guests.join(', ')}\nCapacity: ${table.capacity}/${table.guests.length}\n`
    ).join('\n')}`,
    totalTables: tables.length,
  };
}
