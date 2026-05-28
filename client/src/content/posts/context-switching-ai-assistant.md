---
title: The Art of Context Switching (and Why AI Is My Secret Weapon)
date: 2025-05-12
tags: [productivity, ai, platform-engineering]
cover: covers/cover-context-switching.png
excerpt: Platform engineers don't get the luxury of deep focus on one thing. You're debugging a payment failure, then reviewing a PR, then firefighting a deploy. Here's how I stay sane and fast.
---

# The Art of Context Switching (and Why AI Is My Secret Weapon)

It's 10:30am on a Tuesday. In the last hour I've:

1. Investigated why a payment webhook is failing silently
2. Reviewed a PR that touches our auth middleware
3. Answered a Slack thread about why staging is down
4. Started designing a new caching layer

This is normal. This is platform engineering.

And for the longest time, I thought the goal was to *eliminate* context switching. "Protect your focus time!" every productivity guru shouts. Block your calendar! Turn off notifications! Deep work!

Cool advice. Doesn't work when your pager goes off.

## The reframe that changed everything

I stopped trying to eliminate context switching and started trying to get *good* at it. Like a muscle. The faster I can load context, do the thing, and unload, the less it costs me.

The secret? It's not about holding everything in your head. It's about having systems that let you *reload* quickly.

## My context-switching toolkit

### 1. Breadcrumbs everywhere

When I'm deep in a problem and get interrupted, I take 30 seconds to write a breadcrumb: what I was doing, where I was, what my next step was going to be.

```
// investigating: webhook 500s on /payments/confirm
// found: request body empty when Content-Type missing
// next: check if nginx strips the header on the proxy
```

That tiny note saves 15 minutes of "wait, where was I?" when I come back.

### 2. AI as context loader

This is where AI became game-changing for me. When I switch to a new problem, I paste the relevant context (error logs, code snippet, Slack thread) and ask: "Summarize what's happening here and suggest where to look."

Instead of spending 10 minutes re-reading a thread to understand the issue, I get a 30-second summary. That's not laziness, that's efficiency. My brain's pattern-matching is still the one making decisions. AI just compresses the loading time.

### 3. Decision queues, not decision fatigue

When multiple things land on my plate simultaneously, I don't try to hold them all. I triage in 60 seconds:

- **Urgent + I'm the only one who can do it**: Do it now
- **Urgent + someone else can start**: Delegate with context
- **Important but not burning**: Add to today's list with a one-liner
- **Everything else**: It'll come back around if it actually matters

This sounds obvious written down. But in the heat of the moment, without a system, you end up doing whatever's loudest instead of whatever's most important.

### 4. The "5-minute rule" for interruptions

If someone asks me something and I can answer in 5 minutes, I just do it. Right now. No "let me get back to you." The cost of context-switching back to answer it later is *higher* than the cost of answering now.

This seems counterintuitive but it's true. A 5-minute interruption now saves a 15-minute context reload later.

## How AI fits into daily platform work

Platform engineering is uniquely suited for AI assistance because the problems are *wide* but often *shallow*. You need to touch many systems, understand many domains, but rarely go deeper than "find the bug, fix the bug, move on."

Here's my actual daily AI usage:

**Morning**: "Here are 5 alerts from overnight. Which ones are related? What's the likely root cause?" Saves 20 minutes of log correlation.

**Code review**: "What are the security implications of this change?" Catches things I'd miss when reviewing my 8th PR of the day.

**Debugging**: "This error message is from library X. What typically causes it?" Faster than Stack Overflow because I can provide *my* specific context.

**Communication**: "Turn these bullet points into a stakeholder update that a non-technical PM can understand." Because I've already context-switched 6 times and my writing brain is fried.

## The uncomfortable truth about "flow state"

Here's what nobody in platform engineering wants to admit: you might get 2 hours of uninterrupted focus per day. Maybe. On a good day.

And that's... fine? 

The engineers I admire most aren't the ones who need 4 hours of silence to be productive. They're the ones who can do meaningful work in 25-minute bursts between interruptions. They ship just as much. They just do it differently.

Flow state is great when you can get it. But building your entire productivity system around *needing* it is fragile. Build one that works without it.

## The daily rhythm

My day looks something like this:

- **8:30-9:00**: Check alerts, triage, quick fixes
- **9:00-10:30**: Focus block (whatever's most important)
- **10:30-12:00**: Reviews, meetings, Slack, firefighting
- **13:00-14:30**: Focus block two
- **14:30-17:00**: Collaboration, pairing, more context-switching

I protect those two focus blocks. Everything else? I lean into the chaos. With AI compressing my context-loading time, those chaotic hours are way more productive than they used to be.

## The meta-skill

Context switching isn't a weakness to overcome. For platform engineers, it's literally the job. The skill isn't avoiding it. It's making each switch cheaper.

AI made each switch about 50% cheaper for me. That adds up to hours per week. Hours I now spend on the interesting problems instead of re-reading logs I already read yesterday.

---

*What's your context-switching trick? I'm collecting strategies like Pokémon. The weirder, the better.*
