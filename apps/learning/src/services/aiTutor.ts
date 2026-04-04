import * as Speech from 'expo-speech';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

// If you need direct API calls for speech-to-text or text-to-speech,
// you can add those here too. For now, we focus on generating AI responses.

export class AiTutorService {
    private static instance: AiTutorService;
    private convex: ConvexHttpClient;

    private constructor() {
        // Use the official Convex URL (from .env)
        const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || '';
        this.convex = new ConvexHttpClient(convexUrl);
    }

    public static getInstance(): AiTutorService {
        if (!AiTutorService.instance) {
            AiTutorService.instance = new AiTutorService();
        }
        return AiTutorService.instance;
    }

    /**
     * Generates a context-aware AI response for a lesson breakpoint.
     * 
     * @param lessonId - The lesson ID
     * @param breakpointIndex - The breakpoint index
     * @param context - The context (script or segment)
     * @param interactionType - Interaction type (e.g. question, hint)
     * @param userResponse - Optional user response text
     * @returns AI response text and metadata
     */
    public async generateResponse(
        lessonId: any,
        breakpointIndex: number,
        context: string,
        interactionType: 'question' | 'hint' | 'correction' | 'encouragement' | 'explanation',
        userResponse?: string
    ) {
        try {
            const result = await this.convex.action(api.aiActions.generateAiResponse, {
                lessonId,
                breakpointIndex,
                context,
                userResponse,
                interactionType,
            });

            return result;
        } catch (error) {
            console.error('Error in AiTutorService.generateResponse:', error);
            return {
                aiResponse: "I'm sorry, I'm having a little trouble thinking clearly right now. Let's try again!",
                isCorrect: false,
                scoreDelta: 0,
            };
        }
    }

    /**
     * Logs the interaction to the database for progress tracking.
     * This can also be done directly in the screen using useMutation.
     */
    public async logInteraction(
        kidProfileId: any,
        lessonId: any,
        breakpointIndex: number,
        interactionType: 'question' | 'hint' | 'correction' | 'encouragement' | 'explanation',
        question: string,
        aiResponse: string,
        userResponse?: string,
        isCorrect?: boolean,
        scoreDelta?: number
    ) {
        // We typically use the frontend mutation hook for this, but this is an alternative
        // if we want to log from the service directly.
    }

    /**
     * Speaks the given text using on-device TTS.
     * @param text - The text to speak
     * @param options - Optional speech options including callbacks
     */
    public speak(text: string, options: Speech.SpeechOptions = {}) {
        Speech.stop(); // Stop any current speech
        Speech.speak(text, {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.9, // Slightly slower for better clarity in learning
            ...options,
        });
    }

    /**
     * Stops any ongoing speech.
     */
    public stopSpeech() {
        Speech.stop();
    }
}

export const aiTutor = AiTutorService.getInstance();
export default aiTutor;
