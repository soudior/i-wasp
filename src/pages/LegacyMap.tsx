import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, MapPin, Users, Globe, Send, MessageSquare, Crown, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LegacyFlag {
  id: string;
  name: string;
  city: string;
  country: string | null;
  x_position: number;
  y_position: number;
  created_at: string;
}

interface AllianceMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function LegacyMap() {
  const { user } = useAuth();
  const [flags, setFlags] = useState<LegacyFlag[]>([]);
  const [messages, setMessages] = useState<AllianceMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<LegacyFlag | null>(null);

  // Fetch legacy flags
  useEffect(() => {
    const fetchFlags = async () => {
      const { data, error } = await supabase
        .from('legacy_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setFlags(data);
      }
      setIsLoading(false);
    };

    fetchFlags();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('legacy-flags-realtime')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'legacy_flags' },
        (payload) => {
          setFlags(prev => [payload.new as LegacyFlag, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch alliance chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('alliance_chat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to realtime chat
    const channel = supabase
      .channel('alliance-chat-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alliance_chat' },
        (payload) => {
          setMessages(prev => [payload.new as AllianceMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Plant flag on map
  const plantFlag = async () => {
    if (!user) {
      toast.error('Connectez-vous pour planter votre drapeau');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Membre IWASP';

    const newFlag = {
      name,
      city: 'Nouveau membre',
      country: null,
      x_position: 20 + Math.random() * 60,
      y_position: 25 + Math.random() * 45,
      user_id: user.id
    };

    const { error } = await supabase
      .from('legacy_flags')
      .insert(newFlag);

    if (error) {
      toast.error('Erreur lors de la plantation du drapeau');
    } else {
      toast.success('🚩 Votre héritage est scellé sur la carte mondiale !');
    }
  };

  // Send chat message
  const sendMessage = async () => {
    if (!chatInput.trim() || !user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Membre';

    const { error } = await supabase
      .from('alliance_chat')
      .insert({
        name,
        message: chatInput.trim(),
        user_id: user.id
      });

    if (!error) {
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050807] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1210]/50 via-transparent to-[#050807]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#A5A9B4]/5 blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] flex items-center justify-center">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Legacy Map</h1>
              <p className="text-sm text-[#A5A9B4]">Alliance Mondiale IWASP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-[#A5A9B4]" />
              <span className="text-sm font-medium">{flags.length} membres</span>
            </div>
            <Button 
              onClick={plantFlag}
              className="bg-[#A5A9B4] text-black hover:bg-white font-semibold px-6"
            >
              <Flag className="w-4 h-4 mr-2" />
              Planter mon drapeau
            </Button>
          </div>
        </motion.div>
      </header>

      <div className="relative z-10 px-6 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* World Map */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#0A1210] border border-white/10"
          >
            {/* Map Grid Effect */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#A5A9B4" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Continents silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Globe className="w-1/2 h-1/2 text-[#A5A9B4]" />
            </div>

            {/* Flags */}
            <AnimatePresence>
              {flags.map((flag, index) => (
                <motion.div
                  key={flag.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute cursor-pointer group"
                  style={{ 
                    left: `${flag.x_position}%`, 
                    top: `${flag.y_position}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                  onClick={() => setSelectedFlag(selectedFlag?.id === flag.id ? null : flag)}
                >
                  {/* Flag Pin */}
                  <div className="relative">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-[#A5A9B4] shadow-[0_0_20px_rgba(165,169,180,0.6)]"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                    />
                    <div className="absolute -bottom-1 left-1/2 w-0.5 h-4 bg-[#A5A9B4]/50 -translate-x-1/2" />
                    
                    {/* Tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-black/90 border border-white/20 backdrop-blur-xl whitespace-nowrap transition-all duration-300 ${selectedFlag?.id === flag.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}>
                      <p className="text-sm font-semibold text-white">{flag.name}</p>
                      <p className="text-xs text-[#A5A9B4]">{flag.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* HQ Marker */}
            <div className="absolute left-[48%] top-[35%] transform -translate-x-1/2 -translate-y-1/2">
              <motion.div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] flex items-center justify-center shadow-[0_0_40px_rgba(165,169,180,0.5)]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="w-4 h-4 text-black" />
              </motion.div>
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#A5A9B4] whitespace-nowrap">
                IWASP HQ
              </p>
            </div>
          </motion.div>
        </div>

        {/* Alliance Chat */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-3xl bg-[#0A1210] border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#A5A9B4]" />
            <h2 className="font-semibold">Alliance Chat</h2>
            <Sparkles className="w-4 h-4 text-[#A5A9B4] ml-auto" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px] custom-scrollbar">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-white/5 border border-white/5"
              >
                <p className="text-xs font-semibold text-[#A5A9B4] mb-1">{msg.name}</p>
                <p className="text-sm text-white/90">{msg.message}</p>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-[#A5A9B4]/50 text-sm py-8">
                Soyez le premier à envoyer un message
              </p>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Votre message..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="bg-[#A5A9B4] text-black hover:bg-white shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-black/80 backdrop-blur-xl border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#A5A9B4]" />
              <span className="text-sm"><strong>{flags.length}</strong> drapeaux plantés</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#A5A9B4]" />
              <span className="text-sm"><strong>{messages.length}</strong> messages</span>
            </div>
          </div>
          <p className="text-xs text-[#A5A9B4]">
            Powered by <span className="font-bold text-white">IWASP</span> Sovereign Network
          </p>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(165, 169, 180, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
