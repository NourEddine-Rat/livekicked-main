# Football Data Website Design Guidelines

## Design Decision Framework

**Approach**: Reference-Based Design inspired by **ESPN, BBC Sport, and The Athletic**
- **Rationale**: Sports data platforms prioritize information density, real-time updates, and visual hierarchy for quick scanning
- **Key Patterns**: Dark themes for extended viewing, card-based layouts for matches, clear status indicators, and efficient use of space

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (Default):
- Background: `222 15% 8%` (Deep charcoal)
- Surface: `222 15% 12%` (Card backgrounds)
- Primary: `142 76% 36%` (Football green for live matches)
- Secondary: `210 40% 60%` (Cool blue for general UI)
- Text Primary: `210 40% 98%`
- Text Secondary: `215 20% 65%`

**Accent Colors**:
- Live Match: `0 84% 60%` (Vibrant red for live indicators)
- Finished Match: `142 69% 58%` (Success green)
- Upcoming Match: `43 96% 56%` (Warning amber)

### B. Typography
**Fonts**: Inter (primary), JetBrains Mono (match times/scores)
- **Headers**: 600 weight, tight tracking for league names
- **Body**: 400 weight, comfortable line height for readability
- **Match Data**: 500 weight, tabular numbers for scores/times

### C. Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16
- Consistent `p-4` for cards, `gap-6` for sections
- `m-2` for tight spacing, `p-8` for major containers

### D. Component Library

**Top Leagues Sidebar**:
- Fixed width sidebar (300px) with league cards
- League logo + name in horizontal layout
- Subtle hover states with background elevation
- Popular leagues prominently displayed first

**Match Cards**:
- Compact horizontal layout: Team logos, names, score, time
- Status indicators with color-coded backgrounds
- League badge prominently displayed
- Clear visual hierarchy: Team names > Score > Time > League

**Navigation & Filters**:
- Date picker with prev/today/next buttons
- Live matches toggle with red indicator dot
- Clean button styling with outline variants
- Sticky positioning for persistent access

**Match Status Indicators**:
- Live: Pulsing red dot + "LIVE" badge
- Finished: Green checkmark + final score emphasis
- Upcoming: Clock icon + kickoff time
- Half-time: Orange pause icon + "HT" text

### E. Interactions
**Minimal Animations**:
- Subtle card hover elevations (shadow transitions)
- Live match pulse animation (2s interval)
- Smooth color transitions for status changes
- No page transitions or complex animations

## Visual Hierarchy

**Information Priority**:
1. Live matches (prominent red indicators)
2. Match scores and team names (largest text)
3. Match times and league names (secondary text)
4. Navigation and filters (subtle, accessible)

**Scanning Patterns**:
- Vertical list for easy match browsing
- Consistent left-aligned team information
- Right-aligned time/status for quick reference
- League grouping with clear section headers

## Responsive Behavior

**Desktop**: Sidebar + main content layout
**Tablet**: Collapsible sidebar with overlay
**Mobile**: Full-width stack, bottom navigation for filters

## Images
**League Logos**: 32x32px in sidebar, 24x24px in match cards
**Team Logos**: 40x40px in match displays
**No Hero Image**: This is a data-focused application prioritizing content over marketing visuals

The design emphasizes **functional beauty** - clean, scannable layouts that help users quickly find match information while maintaining visual appeal through thoughtful use of color, typography, and spacing.