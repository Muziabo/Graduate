import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Initialize services
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request: Request) {
  const { email, phone, orderDetails } = await request.json();

  try {
    // Send email notification
    const emailMsg = {
      to: email,
      from: 'no-reply@yourdomain.com',
      subject: 'Order Confirmation',
      text: `Your order has been successfully processed. Order Details: ${JSON.stringify(orderDetails)}. Ready for collection on ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    };
    await sgMail.send(emailMsg);

    // Send SMS notification
    await twilioClient.messages.create({
      body: `Your order has been successfully processed. Ready for collection on ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
