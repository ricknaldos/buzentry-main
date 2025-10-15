import {
 Body,
 Container,
 Head,
 Heading,
 Html,
 Link,
 Preview,
 Section,
 Text,
} from '@react-email/components';

interface OnboardingEmailProps {
 email: string;
}

export default function OnboardingEmail({
 email,
}: OnboardingEmailProps) {
 return (
  <Html>
   <Head />
   <Preview>Welcome to BuzEntry - You're almost there!</Preview>
   <Body style={main}>
    <Container style={container}>
     <Heading style={h1}>
      Welcome to <span style={brandColor}>BuzEntry</span>!
     </Heading>

     <Text style={text}>Hi there,</Text>

     <Text style={text}>
      Thanks for your interest in BuzEntry! Before you complete your sign-up, here's exactly how BuzEntry works and what you'll get.
     </Text>

     <Section style={section}>
      <Heading as="h2" style={h2}>
       How BuzEntry Works:
      </Heading>

      <Text style={stepText}>
       <strong style={stepNumber}>1.</strong> <strong>You get a dedicated phone number</strong>
       <br />
       <span style={stepDescription}>
        After you sign up, we instantly give you a unique phone number (your "Magic Number").
        This replaces your personal number in your building's intercom directory.
       </span>
      </Text>

      <Text style={stepText}>
       <strong style={stepNumber}>2.</strong> <strong>Give it to your building manager</strong>
       <br />
       <span style={stepDescription}>
        You provide this number to your building management to update in the intercom system.
        We'll give you a ready-to-send email template to make this easy.
       </span>
      </Text>

      <Text style={stepText}>
       <strong style={stepNumber}>3.</strong> <strong>Configure your door code</strong>
       <br />
       <span style={stepDescription}>
        Tell us which button unlocks your door (usually 1 or 2). Optionally add a 4-digit security PIN
        that visitors must enter before the door unlocks.
       </span>
      </Text>

      <Text style={stepText}>
       <strong style={stepNumber}>4.</strong> <strong>Done! Your door unlocks automatically</strong>
       <br />
       <span style={stepDescription}>
        When someone buzzes your apartment, our system answers in 2 seconds and automatically presses
        your door code. If you set up a security PIN, visitors will hear a voice prompt asking for the code
        before the door unlocks. No phone, no app, no rushing—it just works.
       </span>
      </Text>
     </Section>

     <Section style={highlightBox}>
      <Text style={highlightTitle}>What happens after you sign up:</Text>
      <Text style={highlightText}>
       ✓ Get your dedicated phone number instantly
       <br />
       ✓ Quick 2-minute setup to configure your door code
       <br />
       ✓ Start receiving deliveries without lifting a finger
      </Text>
     </Section>

     <Section style={section}>
      <Heading as="h2" style={h2}>
       What's Included:
      </Heading>

      <Text style={bulletText}>
       <strong>✓ Unlimited door unlocks</strong> — No limits, no extra charges
      </Text>

      <Text style={bulletText}>
       <strong>✓ 2-second response time</strong> — Faster than you can grab your phone
      </Text>

      <Text style={bulletText}>
       <strong>✓ Optional 4-digit security PIN</strong> — Extra protection if you want it
      </Text>

      <Text style={bulletText}>
       <strong>✓ Instant notifications</strong> — Get notified every time someone buzzes
      </Text>

      <Text style={bulletText}>
       <strong>✓ Pause anytime</strong> — Need to screen a visitor? Pause with one click
      </Text>

      <Text style={bulletText}>
       <strong>✓ 24/7 support</strong> — We're here to help if you need anything
      </Text>
     </Section>

     <Section style={guaranteeBox}>
      <Text style={guaranteeTitle}>🛡️ 30-Day Money-Back Guarantee</Text>
      <Text style={guaranteeText}>
       If BuzEntry doesn't work with your building or you're not satisfied for any reason,
       we'll refund you immediately - no questions asked.
      </Text>
     </Section>

     <Text style={text}>
      Questions before you sign up? Just reply to this email and we'll help you out.
     </Text>

     <Text style={footer}>
      Looking forward to making your apartment life easier!
      <br />
      <br />
      — The BuzEntry Team
      <br />
      <Link href="https://buzentry.com" style={link}>
       buzentry.com
      </Link>
     </Text>
    </Container>
   </Body>
  </Html>
 );
}

const main = {
 backgroundColor: '#f6f9fc',
 fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
 backgroundColor: '#ffffff',
 margin: '0 auto',
 padding: '40px 20px',
 marginBottom: '64px',
 borderRadius: '8px',
 maxWidth: '600px',
};

const h1 = {
 color: '#1f2937',
 fontSize: '32px',
 fontWeight: '700',
 margin: '0 0 30px',
 padding: '0',
 lineHeight: '1.2',
};

const h2 = {
 color: '#1f2937',
 fontSize: '24px',
 fontWeight: '600',
 margin: '30px 0 20px',
};

const brandColor = {
 color: '#2563eb',
};

const text = {
 color: '#4b5563',
 fontSize: '16px',
 lineHeight: '26px',
 margin: '16px 0',
};

const bulletText = {
 color: '#4b5563',
 fontSize: '16px',
 lineHeight: '26px',
 margin: '16px 0',
};

const stepText = {
 color: '#1f2937',
 fontSize: '16px',
 lineHeight: '26px',
 margin: '24px 0',
};

const stepNumber = {
 color: '#2563eb',
 fontSize: '18px',
 fontWeight: '700',
};

const stepDescription = {
 color: '#6b7280',
 fontSize: '15px',
 lineHeight: '24px',
};

const highlightBox = {
 background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
 borderRadius: '8px',
 border: '2px solid #bfdbfe',
 padding: '24px',
 margin: '32px 0',
};

const highlightTitle = {
 color: '#1e40af',
 fontSize: '18px',
 fontWeight: '700',
 margin: '0 0 12px',
};

const highlightText = {
 color: '#1e40af',
 fontSize: '16px',
 lineHeight: '24px',
 margin: '0',
};

const section = {
 margin: '32px 0',
};

const guaranteeBox = {
 backgroundColor: '#f0fdf4',
 borderRadius: '8px',
 border: '2px solid #86efac',
 padding: '24px',
 margin: '32px 0',
 textAlign: 'center' as const,
};

const guaranteeTitle = {
 color: '#166534',
 fontSize: '18px',
 fontWeight: '700',
 margin: '0 0 12px',
};

const guaranteeText = {
 color: '#166534',
 fontSize: '15px',
 lineHeight: '24px',
 margin: '0',
};

const link = {
 color: '#2563eb',
 textDecoration: 'underline',
};

const footer = {
 color: '#6b7280',
 fontSize: '15px',
 lineHeight: '24px',
 marginTop: '48px',
};
