import { NextRequest, NextResponse } from 'next/server'

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, inquiryType, subject, message, anonymous } = body

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Message content is required for editorial review.' },
        { status: 400 }
      )
    }

    const contactEmail = anonymous || !email ? `tip-${Date.now()}@aine.ws` : email.trim()
    const contactName = anonymous ? 'Confidential Newsroom Source' : (name?.trim() || 'Anonymous Reader')

    // 1. Create or update contact in HubSpot
    let contactId: string | null = null
    try {
      const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            email: contactEmail,
            firstname: contactName.split(' ')[0] || contactName,
            lastname: contactName.split(' ').slice(1).join(' ') || 'Source',
            phone: phone || '',
            lifecyclestage: 'lead',
          },
        }),
      })

      if (contactRes.ok) {
        const contactData = await contactRes.json()
        contactId = contactData.id
      } else if (contactRes.status === 409) {
        // Contact already exists, fetch existing ID
        const searchRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactEmail)}?idProperty=email`, {
          headers: { 'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
        })
        if (searchRes.ok) {
          const searchData = await searchRes.json()
          contactId = searchData.id
        }
      }
    } catch (crmErr) {
      console.error('HubSpot Contact creation warning:', crmErr)
    }

    // 2. Create Note attached to contact
    if (contactId) {
      try {
        const noteBody = `📰 [AINE.WS EDITORIAL DESK TRANSMISSION]
-------------------------------------------
Type: ${inquiryType || 'General Tip'}
Subject: ${subject || 'No Subject'}
From: ${contactName} (${contactEmail})
Phone: ${phone || 'N/A'}
Anonymous: ${anonymous ? 'YES' : 'NO'}

Message:
${message}
-------------------------------------------
Source: https://aine.ws/contact`

        await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              hs_timestamp: new Date().toISOString(),
              hs_note_body: noteBody,
            },
            associations: [
              {
                to: { id: contactId },
                types: [
                  {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: 202, // Note to contact association
                  },
                ],
              },
            ],
          }),
        })
      } catch (noteErr) {
        console.error('HubSpot Note creation warning:', noteErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your transmission has been securely logged with the AINE.WS editorial desk. Confidentiality protected under journalist shield standards.',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Editorial contact route error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while routing your message.' },
      { status: 500 }
    )
  }
}
