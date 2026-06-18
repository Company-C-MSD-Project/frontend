import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Sign Up
        </Link>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Effective date: June 18, 2026</span>
          <span>Version 1.2</span>
        </div>

        <div className="mt-10 space-y-12 text-base leading-relaxed text-foreground/85">
          <Section title="1. Acceptance of Terms">
            These Terms of Service govern your access to and use of the FixItNow platform, including our website and mobile applications. By accessing or using FixItNow, you agree to these terms and our Privacy Policy.
          </Section>
          <Section title="2. Our Service">
            FixItNow is a technology platform that connects homeowners with independent service providers. We do not provide home services directly. Providers who appear on the platform are independent contractors and not employees or agents of FixItNow.
          </Section>
          <Section title="3. Account Responsibilities">
            You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information and notify us promptly of any unauthorized use.
          </Section>
          <Section title="4. Booking, Payment, and Fees">
            All bookings are subject to the terms visible in checkout. Fees are collected through our payment processor and may include service charges, taxes, or other applicable fees. Payment is due at the time of booking unless otherwise agreed.
          </Section>
          <Section title="5. Provider Conduct and Quality">
            Providers are responsible for delivering services in a professional, safe, and compliant manner. FixItNow may remove providers who violate our policies or fail to meet service standards.
          </Section>
          <Section title="6. User Conduct">
            You agree not to misuse the platform. Prohibited conduct includes harassment, fraud, attempting to evade fees, misrepresenting information, and making unlawful requests of providers.
          </Section>
          <Section title="7. Intellectual Property">
            All FixItNow content, including text, images, designs, and software, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
          </Section>
          <Section title="8. Disclaimer of Warranties and Limitation of Liability">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. FIXITNOW'S LIABILITY IS LIMITED TO THE AMOUNT PAID FOR THE SERVICE GIVING RISE TO A CLAIM TO THE EXTENT PERMITTED BY LAW.
          </Section>
          <Section title="9. Changes to These Terms">
            We may update these Terms at any time. Material changes will be communicated by email or within the platform. Continued use of FixItNow after the effective date of changes means you accept the updated Terms.
          </Section>
          <Section title="10. Contact">
            If you have questions about these Terms, please email <a className="font-medium text-primary hover:underline" href="mailto:fixitnow@gmail.com">fixitnow@gmail.com</a>.
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
