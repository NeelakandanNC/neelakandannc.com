---
title: "Agents that touch atoms"
date: 2026-05-28
excerpt: "Most agent demos move bits around. Agentronics is about agents that reason over the physical world."
tags: [ai, agentronics, hardware]
---

Almost every agent demo I see does the same thing: it reads some text, calls some APIs, writes some text back. Useful — but it lives entirely inside the screen.

My electronics background keeps nagging at me with a different question: **what happens when the agent has to reason about a sensor that's lying to it?**

## The bits-to-atoms gap

Software agents fail gracefully. You retry the API call. Hardware agents fail *physically* — a misread sensor, a timing race, a motor that didn't move. The feedback loop is noisier, slower, and far less forgiving.

That gap is exactly why it's interesting. The teams who figure out agentic systems for the physical world will have a moat that pure-software teams can't easily copy.

## Where Agentronics sits

Agentronics is my bet on that thesis. Concretely, I'm working on:

1. Agents that **interpret sensor streams** with explicit uncertainty.
2. Control loops where the LLM proposes and a deterministic layer disposes.
3. A debugging surface for when the physical world disagrees with the model.

It's early. No big claims yet. But the next frontier is agents that touch atoms, not just bits — and I'd rather be early and wrong than late and right.
