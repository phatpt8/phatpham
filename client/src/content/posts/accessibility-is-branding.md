---
title: Accessibility Isn't Charity — It's Your Best Growth Hack
date: 2025-02-10
tags: [accessibility, ux, product]
excerpt: We treated accessibility as a compliance checkbox for years. Then we actually looked at the data. Turns out, making your product usable for everyone makes everyone use your product more.
---

# Accessibility Isn't Charity — It's Your Best Growth Hack

I used to skip the accessibility ticket. You know the one — it sits at the bottom of the backlog, tagged "nice-to-have", slowly gathering dust while we ship "real features."

Then one day our PM showed me a stat: 15% of our mobile users had font scaling enabled. Fifteen percent. Our app looked like a ransom note at 1.5x. Buttons overlapped. Text got clipped. CTAs disappeared.

We were losing customers and didn't even know it.

## The mindset shift

Here's what nobody tells you: accessibility isn't about helping a small group of people. It's about removing friction for *everyone*.

Think about it:
- Captions help deaf users, sure. But they also help people watching on mute in the train.
- Keyboard navigation helps blind users. But it also helps power users who hate touching their mouse.
- High contrast helps low-vision users. But it also helps anyone using their phone in direct sunlight.

Every accessibility improvement is a UX improvement in disguise.

## How it builds your brand

When your product just *works* — regardless of how someone uses it — people notice. Not consciously. They don't think "wow, great ARIA labels." They think "this app feels good."

That feeling is what makes people come back. It's the difference between an app you tolerate and one you recommend to friends.

I've seen this pattern at every company I've worked for:

1. **Reduce friction** → people complete more flows
2. **Complete more flows** → people build habits
3. **Build habits** → people become loyal
4. **Loyal users** → organic growth through word-of-mouth

Accessibility is step one in that chain, and most teams skip it entirely.

## The practical stuff that actually matters

You don't need to boil the ocean. Start with these:

**Semantic HTML**: Stop using `<div onClick>` for everything. Use `<button>`. Use `<nav>`. Use headings in order. Your future self (and screen readers) will thank you.

**Focus management**: When a modal opens, focus should go there. When it closes, focus should return. Simple concept, broken in 90% of SPAs.

**Color isn't information**: If the only way to know something is an error is "it's red" — you've excluded 8% of men who have some form of color blindness.

**Touch targets**: 44x44 pixels minimum. Your thumb isn't a pixel-perfect laser pointer, especially on a moving bus.

## The business case nobody argues with

We ran an experiment: made our checkout flow fully accessible (proper labels, keyboard nav, error announcements). Conversion went up 4% across *all* users. Not just users with assistive tech — everyone.

Why? Because accessible design forced us to make the flow clearer. Better labels meant less confusion. Proper error handling meant fewer abandoned carts. Keyboard support meant faster completion for power users.

The accessibility work paid for itself in two weeks.

## The honest truth

I'm not gonna pretend I write perfect ARIA attributes on the first try. I still forget `alt` text sometimes. But the shift from "accessibility is extra work" to "accessibility is how I build" changed the quality of everything I ship.

Your product is a habit machine. The easier you make it to use — for everyone, in every context — the stickier it becomes. That's not charity. That's just good engineering.

---

*Next time you're about to skip that accessibility ticket, ask yourself: "What if 15% of my users are hitting this wall right now?"*
