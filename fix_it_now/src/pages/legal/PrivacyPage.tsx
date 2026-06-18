import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Sign Up
        </Link>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Effective date: June 18, 2026</span>
          <span>Version 1.2</span>
        </div>

        <div className="mt-10 space-y-12 text-base leading-relaxed text-foreground/85">
          <Section title="1. Information We Collect">
            We collect the data you provide directly, such as name, email, phone, address, booking details, and messages. We also collect technical data like IP address, browser type, and device information.
          </Section>
          <Section title="2. How We Use Your Data">
            Your information is used to provide and improve our services, process bookings and payments, communicate with you, prevent fraud, and personalize your experience.
          </Section>
          <Section title="3. Sharing with Providers and Partners">
            When you request a service, we share only the information needed for the provider to complete the job. We will not share your payment details with service providers.
          </Section>
          <Section title="4. Cookies and Tracking Technologies">
            We use cookies and similar technologies to support login, performance, and analytics. You may manage cookie settings through your browser, but disabling cookies may affect site functionality.
          </Section>
          <Section title="5. Data Retention">
            We retain data while your account is active and as needed to comply with legal obligations, resolve disputes, and enforce agreements. You may request access, correction, or deletion of your personal data.
          </Section>
          <Section title="6. Your Rights">
            You may request to access, update, or delete your personal information. Contact us if you want to exercise your privacy rights or if you have questions about our practices.
          </Section>
          <Section title="7. Security">
            We use administrative, technical, and physical safeguards to protect your data. No system can be completely secure, so please keep your account credentials private.
          </Section>
          <Section title="8. Third-Party Services">
            We may use third-party service providers for payment processing, analytics, and hosting. Those third parties are contractually bound to protect your data in accordance with this policy.
          </Section>
          <Section title="9. Changes to This Policy">
            We may update this Privacy Policy periodically. If we make material changes, we will notify you through the app or by email before they become effective.
          </Section>
          <Section title="10. Contact">
            For privacy questions or requests, please email <a className="font-medium text-primary hover:underline" href="mailto:fixitnow@gmail.com">fixitnow@gmail.com</a>.
          </Section>
        </div>
      </article>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}
