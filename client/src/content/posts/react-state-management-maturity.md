---
title: React's State Management Finally Grew Up
date: 2025-03-18
tags: [react, state-management, frontend]
excerpt: Remember when choosing a state management library felt like picking a religion? Redux vs MobX vs Context vs whatever-ships-this-week. The ecosystem has matured, and the answers are surprisingly simple now.
---

# React's State Management Finally Grew Up

I remember 2019. Starting a new React project meant spending three days arguing about state management. Redux? MobX? Context with useReducer? Roll your own with event emitters like a maniac?

Everyone had opinions. Nobody had answers. The "right" choice depended on which blog post you read last.

Fast forward to 2025, and something beautiful happened: the community collectively figured it out. Not with one winner, but with clear categories and obvious choices for each.

## The great unbundling

The biggest mental shift? **There is no "one state manager to rule them all."** That was always a trap.

State comes in flavors:

- **Server state**: Data from your API. Async, cacheable, shared.
- **Client state**: UI state. Tabs, modals, form inputs, theme preferences.
- **URL state**: What page you're on. Filters. Search params.

Using one tool for all three is like using a Swiss Army knife to cook dinner. Technically possible. Practically miserable.

## The stack that actually works

Here's what I reach for on every project now, and why:

### TanStack Query for server state

This library single-handedly killed 80% of my Redux code. All that boilerplate for fetching, caching, refetching, loading states, error states? Gone.

```javascript
const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
```

That's it. It handles caching, background refetching, stale-while-revalidate, pagination, infinite scroll — all the stuff I used to write manually with sagas and thunks and tears.

The moment I stopped treating server data as "state I manage" and started treating it as "a cache I keep fresh," everything got simpler.

### Zustand for client state

Zustand is what I wished Redux was. Zero boilerplate. No providers. No context. Just a store.

```javascript
const useThemeStore = create((set) => ({
  theme: 'dark',
  toggle: () => set((s) => ({ 
    theme: s.theme === 'dark' ? 'light' : 'dark' 
  })),
}));
```

Use it anywhere. No wrapping your app in seventeen providers. No "prop drilling vs context" debates. Just import and use.

It's 1KB gzipped. It has middleware for persistence, devtools, immer. And it took me 5 minutes to learn.

### URL state for... URL state

This one sounds obvious but I see teams get it wrong all the time. If a user should be able to share a link and see the same view — that's URL state. Not React state.

Filters? URL. Sort order? URL. Active tab? Probably URL. 

React Router or TanStack Router handles this. Stop storing shareable state in useState.

## What about Redux?

Redux isn't bad. Redux Toolkit actually made it quite nice. But for most apps? It's solving a problem you don't have anymore.

If your app needs complex client-side state machines with time-travel debugging and middleware chains — sure, Redux. If you're building a normal web app that fetches data and shows it to people — you're overengineering.

I'm not trying to start a holy war. I've shipped Redux apps that worked great. But I've also spent too many hours writing action creators for what should have been a simple `useState`.

## The elephant in the room: state pollution

Here's something that still bugs me about React SPAs — and nobody talks about it enough.

As users navigate around your app, state accumulates. Every page they visit leaves residue: cached queries, store slices, subscriptions, mounted contexts. The user is on screen B, but the memory still holds everything from screens A, C, D, and E.

On desktop with 16GB RAM? Whatever. On a mobile device with 3GB shared across 40 browser tabs? This kills performance silently.

I've profiled apps where navigating through 10 screens grew the JS heap by 80MB. Most of it was stale data the user would never see again. Abandoned query caches. Zustand stores holding form state from three screens ago. Event listeners nobody cleaned up.

### The real problem

React's model encourages global-ish state. Your providers wrap the entire app. Your stores persist for the app lifetime. TanStack Query's cache is global by default. Everything stays alive.

But what users actually need is **state scoped to what's on screen right now**. When I leave a page, that page's data should be eligible for cleanup. Not immediately — maybe after 30 seconds or a few navigations — but eventually.

### What I think we need

A state model that's **screen-aware**. Keep what's relevant. Release what's not. Something like:

- Query cache with aggressive garbage collection tied to route visibility
- Stores that auto-dispose when their associated route unmounts
- Component trees that fully unmount (not just hide) when navigated away from

TanStack Query's `gcTime` gets close, but it's time-based, not navigation-based. Zustand stores live forever by design. React's concurrent features help with rendering but don't solve memory.

I don't have the full answer yet. But I think the next evolution of React state management isn't about *how* we manage state — it's about *when we let it go*.

## The maturity moment

What makes React's ecosystem feel "mature" now isn't any single library. It's that the community stopped searching for silver bullets and started choosing the right tool for each job.

The arguments got quieter. The patterns got clearer. New developers can actually get productive without reading 400 pages of documentation.

That's maturity. Not one winner — clarity about when to use what. But we're not done yet — the memory problem is the next frontier.

## My current starter recipe

For anyone starting a new React project today:

- **TanStack Query** for anything from an API
- **Zustand** for client UI state (auth, theme, modals)
- **URL params** for anything shareable
- **useState/useReducer** for component-local stuff

You'll cover 95% of apps with this. No debates needed.

---

*The best state management is the one your whole team understands in 10 minutes. Complexity isn't a feature.*
