# Lynq Email Assistant Landing Page - Design Guidelines

## Design Approach
**Reference-Based: Modern SaaS Landing Page**
This is a pixel-perfect recreation of the Lynq landing page, inspired by contemporary SaaS aesthetics with warm, inviting visuals and clean product mockups. The design emphasizes trust, efficiency, and modern email management.

## Core Design Elements

### Typography System
**Headings:**
- Hero headline: Large serif font (e.g., Playfair Display, Libre Baskerville) - 60-72px, bold weight
- Section headings: Same serif font - 40-48px, bold
- Feature card titles: Sans-serif (e.g., Inter, DM Sans) - 20-24px, semibold

**Body Text:**
- Primary: Sans-serif - 16-18px, regular weight, 1.6 line-height
- Secondary/captions: 14-16px, medium weight
- Navigation: 15px, medium weight

**Color Palette:**
- Background: Warm cream/beige (#FAF8F5, #FFF9F3)
- Primary text: Deep black (#0A0A0A, #1A1A1A)
- Accent: Bright blue asterisk (#2563EB)
- Gradient: Orange (#FF6B35, #FF8A65) to Pink (#FF4D8F, #FF6BA8)
- Label colors: Blue (#3B82F6), Green (#10B981), Purple (#8B5CF6), Red (#EF4444), Yellow (#F59E0B), Gray (#6B7280)

### Layout System
**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, gap-8, py-20, etc.)

**Container Structure:**
- Max-width: 1280px (max-w-7xl)
- Section padding: py-16 md:py-24
- Component gaps: gap-6 to gap-12
- Edge padding: px-6 md:px-12

## Navigation Bar
- Fixed width container with logo (left), menu items (center), action buttons (right)
- Height: 80px
- Menu items: Pricing, Security, Compare, Docs - spaced with gap-8
- Buttons: "Sign In" (ghost/outline), "Get Started" (solid with rounded corners)
- Subtle border-bottom or shadow for separation

## Hero Section
**Layout:** Single column, centered alignment, max-width 800px

**Content Stack (top to bottom):**
1. Tagline: "AI Email Assistant" - small caps, tracking-wide, 14px
2. Blue asterisk decoration before headline
3. Main headline: "Email Handled Save 6+ hours a week" - serif, 60-72px
4. Description paragraph: 2-3 lines explaining the service - 18px
5. Integration badges row: "Sign in with Gmail" and "Sign in with Outlook" buttons side-by-side
6. Primary CTA: "Get Started Free" button - large, prominent

**Spacing:** gap-6 between elements, pt-24 from navbar

## Email Mockup Component
**Container:** Rounded-3xl card with gradient background (orange-to-pink diagonal), shadow-2xl

**Left Sidebar (30% width):**
- White background, rounded-l-3xl
- Folder list: Inbox (bold), Starred, Snoozed, Sent, Drafts - each with icon
- Labels section with colored dots + names + counts:
  - Needs Reply (Blue, 3), Admin (Green, 5), PR (Purple, 2)
  - Urgent (Red, 1), Payments (Yellow, 4), Newsletter (Gray, 8)
  - Marketing (Orange, 6), Other (Gray, 3)

**Main Preview (70% width):**
- White card (rounded-2xl, shadow-lg) showing email conversation
- "Drafted by Emilia" AI badge (blue, rounded-full, top-right)
- Email header with sender/subject
- Formatted email body with paragraphs
- Action buttons at bottom: "Send" (primary), "Schedule" (secondary)

**Positioning:** Center of page below hero, large scale (min-height 600px)

## Security Badges Section
Horizontal row of three badges, centered below email mockup:
- "Private & Secure" with lock icon
- "SOC2 Certified" with shield icon
- "GDPR Certified" with checkmark icon
Each badge: rounded-full, border, padding px-6 py-3, gap-2

## Feature Cards Section
**Header:** "Inbox chaos steals your time" - serif, 48px, centered
**Subtitle:** Descriptive text explaining pain points

**Card Grid:** 2-3 columns (responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

**5 Feature Cards:**
1. Slow Response Times
2. Endless Back & Forth Booking Meetings
3. Hours Wasted Managing Email
4. Slow Replies Leading to Ghosted Leads
5. Leads Lost in the Noise

**Card Structure:**
- White background, rounded-2xl, border, padding p-8
- Icon or emoji at top
- Title (20px, semibold)
- Description text (16px)
- Statistic or time metric highlighted
- Hover: subtle lift (translate-y-1) and shadow increase

## Component Library

**Buttons:**
- Primary: Rounded-lg, px-8 py-4, semibold text, solid background
- Secondary: Outlined with border-2, same padding
- Ghost: No border, hover background change
- Integration buttons: White with brand logos, border

**Cards:**
- Border radius: rounded-2xl to rounded-3xl
- Shadows: shadow-lg for elevated, shadow-xl for hero elements
- Padding: p-6 to p-10 depending on content

**Badges/Pills:**
- Rounded-full, px-4 py-2, small text (12-14px)
- Colored backgrounds at 10% opacity with solid text

**Icons:**
Use Heroicons or Lucide Icons via CDN for folders, labels, security badges

## Images
**Hero Section:** No large background image - uses clean cream/beige solid background
**Email Mockup:** Custom gradient background (not an image) - implement with Tailwind gradients
**Icons/Logos:** Use SVG icons for folders, integration badges (Gmail/Outlook logos), security badges

## Animations
**Minimal, purposeful animations only:**
- Email mockup: Gentle fade-in on load (opacity + translate-y)
- Feature cards: Hover lift effect (transition-transform duration-300)
- Buttons: Scale on hover (hover:scale-105)
- NO scroll-triggered or parallax effects

## Accessibility
- Maintain WCAG AA contrast ratios (dark text on cream background)
- Buttons have clear focus states with ring-2 ring-offset-2
- All interactive elements keyboard navigable
- Labels and badges have sufficient color contrast

## Responsive Behavior
- Mobile (base): Single column, stack all elements, reduce font sizes by 20-30%
- Tablet (md): 2-column feature grid, maintain email mockup scale
- Desktop (lg): Full 3-column grid, hero max-width centered
- Email mockup: Scales proportionally, sidebar stacks above on mobile

This design creates a warm, trustworthy, modern SaaS landing page with emphasis on the product mockup as the visual centerpiece.