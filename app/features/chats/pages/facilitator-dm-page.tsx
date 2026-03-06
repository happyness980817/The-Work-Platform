import { useOutletContext } from "react-router";
import type { ChatContext } from "../layouts/chat-layout";

export default function FacilitatorDmPage() {
  const chatContext = useOutletContext<ChatContext>();

  return null;
}
