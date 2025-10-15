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

interface WelcomeEmailProps {
 email: string;
 phoneNumber: string;
 dashboardUrl: string;
}

export default function WelcomeEmail({
 email,
 phoneNumber = '+1 (555) 123-4567',
 dashboardUrl = 'https://buzentry.com/dashboard',
}: WelcomeEmailProps) {
 return (
  <Html>
   <Head />
   <Preview>Welcome to BuzEntry - Your automated door system is ready!</Preview>
   <Body style={main}>
    <Container style={container}>
     <Heading style={h1}>
      Welcome to <span style={brandColor}>BuzEntry</span>!
     </Heading>

     <Text style={text}>Hi there,</Text>

     <Text style={text}>
      Thank you for signing up! Your automated door answering system is now active.
     </Text>

     <Section style={codeBox}>
      <Text style={codeTitle}>Your SignalWire Phone Number:</Text>
      <Text style={phoneNumberStyle}>{phoneNumber}</Text>
     </Section>

     <Section style={section}>
      <Heading as="h2" style={h2}>
       Next Steps:
      </Heading>

      <Text style={text}>
       <strong>1. Give your number to building management</strong>
       <br />
       Provide {phoneNumber} to your building manager to add to the apartment directory.
      </Text>

      <Text style={text}>
       <strong>2. Set your door code</strong>
       <br />
       Visit your dashboard and enter which button unlocks your door (usually 1 or 2).
      </Text>

      <Text style={text}>
       <strong>3. Test it out</strong>
       <br />
       Have someone buzz your apartment to make sure everything works!
      </Text>
     </Section>

     <Section style={buttonContainer}>
      <Link href={dashboardUrl} style={button}>
       Go to Dashboard
      </Link>
     </Section>

     <Section style={infoSection}>
      <Text style={infoTitle}>Need Help?</Text>
      <Text style={text}>
       Reply to this email or contact us at{' '}
       <Link href="mailto:support@buzentry.com" style={link}>
        support@buzentry.com
       </Link>
      </Text>
     </Section>

     <Text style={footer}>
      BuzEntry - Never miss a delivery again
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

const codeBox = {
 background: '#eff6ff',
 borderRadius: '8px',
 border: '2px solid #bfdbfe',
 padding: '24px',
 margin: '32px 0',
 textAlign: 'center' as const,
};

const codeTitle = {
 color: '#1e40af',
 fontSize: '14px',
 fontWeight: '600',
 margin: '0 0 12px',
 textTransform: 'uppercase' as const,
 letterSpacing: '0.5px',
};

const phoneNumberStyle = {
 color: '#1e3a8a',
 fontSize: '28px',
 fontWeight: '700',
 margin: '0',
 letterSpacing: '1px',
};

const section = {
 margin: '32px 0',
};

const buttonContainer = {
 textAlign: 'center' as const,
 margin: '32px 0',
};

const button = {
 backgroundColor: '#2563eb',
 borderRadius: '8px',
 color: '#fff',
 fontSize: '16px',
 fontWeight: '600',
 textDecoration: 'none',
 textAlign: 'center' as const,
 display: 'inline-block',
 padding: '14px 32px',
};

const infoSection = {
 backgroundColor: '#f9fafb',
 borderRadius: '8px',
 padding: '24px',
 margin: '32px 0',
};

const infoTitle = {
 color: '#1f2937',
 fontSize: '18px',
 fontWeight: '600',
 margin: '0 0 12px',
};

const link = {
 color: '#2563eb',
 textDecoration: 'underline',
};

const footer = {
 color: '#9ca3af',
 fontSize: '14px',
 lineHeight: '24px',
 textAlign: 'center' as const,
 marginTop: '48px',
};
