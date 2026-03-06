import { useOutletContext } from "react-router";
import { AiSuggestionCard } from "../components/ai-suggestion-card";
import type { ChatContext } from "../layouts/chat-layout";

const mockSuggestion =
  "\"Now let's try some turnarounds. Can you turn the thought 'My boss doesn't respect me' around — to the self, to the other, and to the opposite?\"";

export default function FacilitatorChatPage() {
  const { setMessageInput } = useOutletContext() as ChatContext;

  return (
    <AiSuggestionCard
      suggestion={mockSuggestion}
      onUse={(text) => setMessageInput(text)}
      onRegenerate={() => {}}
      onRefine={() => {}}
    />
  );
}
