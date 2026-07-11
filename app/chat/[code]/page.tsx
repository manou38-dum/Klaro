"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Send, Users } from "lucide-react";

export default function ChatRoomPage() {
  const { code } = useParams();
  const { user } = useUser();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger le salon + historique
  useEffect(() => {
    async function init() {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("invite_code", code)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setRoom(data);

      // Historique
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", data.id)
        .order("created_at", { ascending: true });

      if (msgs) setMessages(msgs);

      // Realtime
      const channel = supabase
        .channel(`room_${data.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${data.id}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      setLoading(false);
      return () => {
        supabase.removeChannel(channel);
      };
    }
    init();
  }, [code]);

  // Scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envoyer message
  const sendMessage = async () => {
    if (!input.trim() || !user || !room) return;
    const text = input.trim();
    setInput("");

    await supabase.from("chat_messages").insert({
      room_id: room.id,
      user_id: user.id,
      user_name: user.fullName || user.username || "Anonyme",
      message: text,
    });
  };

  if (loading) return <div className="text-center py-12">Chargement du salon...</div>;
  if (!room) return <div className="text-center py-12 text-red-500">Salon introuvable ou expiré.</div>;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white flex items-center gap-3">
        <Users className="w-6 h-6" />
        <div>
          <h1 className="font-bold">Salon Commérage</h1>
          <p className="text-xs opacity-80">Code: {room.invite_code}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-slate-400 mt-8">Personne n'a encore parlé... Lance-toi !</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.user_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.user_id === user?.id ? "bg-pink-500 text-white rounded-br-none" : "bg-white border border-slate-200 rounded-bl-none"}`}>
                <div className="text-xs opacity-70 mb-1">{msg.user_name}</div>
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écris ton message..."
          className="flex-1 px-4 py-2 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500"
        />
        <button onClick={sendMessage} className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}