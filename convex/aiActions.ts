import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';

export const generateAiResponse = action({
  args: {
    lessonId: v.id('lessons'),
    breakpointIndex: v.number(),
    context: v.string(), // The lesson script or segment
    userResponse: v.optional(v.string()),
    interactionType: v.union(
      v.literal('question'),
      v.literal('hint'),
      v.literal('correction'),
      v.literal('encouragement'),
      v.literal('explanation')
    ),
  },
  handler: async (ctx, args) => {
    // This is where you would call OpenAI, Claude, or another LLM
    // For now, we simulate a response based on the interaction type.
    
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const response = await openai.chat.completions.create({...});
    
    let aiResponse = "";
    let isCorrect = undefined;
    let scoreDelta = 0;

    // Build a simple but meaningful response tied to the context provided.
    // Replace these with a real LLM call (OpenAI / Claude) when ready.
    const contextSnippet = args.context.slice(0, 300);

    switch (args.interactionType) {
      case 'encouragement':
        aiResponse = args.userResponse
          ? `Great answer! "${args.userResponse}" is correct. Keep it up — you're really understanding this material!`
          : 'Great job! Keep it up!';
        isCorrect = true;
        scoreDelta = 10;
        break;

      case 'correction':
        aiResponse = args.userResponse
          ? `Not quite — "${args.userResponse}" isn't right here. Let's go over it: ${contextSnippet}. Try to recall the key idea and give it another go!`
          : `That wasn't correct. Let's revisit the concept: ${contextSnippet}. Take your time and try again.`;
        isCorrect = false;
        scoreDelta = 0;
        break;

      case 'question':
        aiResponse = args.userResponse
          ? `Interesting thought! You said: "${args.userResponse}". Let's dig deeper — ${contextSnippet}.`
          : `Good question to pause on. The key idea here is: ${contextSnippet}.`;
        break;

      case 'hint':
        aiResponse = `Here's a hint: focus on this part of the lesson — "${contextSnippet}". Does that help?`;
        break;

      case 'explanation':
        aiResponse = `Here's a quick recap: ${contextSnippet}. Make sure this is clear before moving on.`;
        break;
    }

    return {
      aiResponse,
      isCorrect,
      scoreDelta,
    };
  },
});
