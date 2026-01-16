/**
 * NFC Demo Section — Interactive animated demonstration
 * Apple-style with realistic tap animation sequence
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, User, Mail, Phone, Linkedin } from "lucide-react";
import { APPLE } from "@/lib/applePalette";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

export function NFCDemoSection() {
  const { t } = useTranslation();
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'approaching' | 'tapping' | 'connected' | 'profile'>('idle');

  // Animation loop
  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Idle
      await new Promise(r => setTimeout(r, 1000));
      setAnimationPhase('approaching');
      
      // Phase 2: Card approaching phone
      await new Promise(r => setTimeout(r, 1200));
      setAnimationPhase('tapping');
      
      // Phase 3: NFC connection
      await new Promise(r => setTimeout(r, 800));
      setAnimationPhase('connected');
      
      // Phase 4: Profile appears
      await new Promise(r => setTimeout(r, 600));
      setAnimationPhase('profile');
      
      // Hold profile view
      await new Promise(r => setTimeout(r, 2500));
      
      // Reset
      setAnimationPhase('idle');
    };

    sequence();
    const interval = setInterval(sequence, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: APPLE.background }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <div 
            className="rounded-3xl p-8 sm:p-16 overflow-hidden"
            style={{ 
              backgroundColor: APPLE.backgroundPure,
              boxShadow: APPLE.shadowLg
            }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Animated Demo */}
              <div className="relative h-80 flex items-center justify-center">
                
                {/* iPhone Frame */}
                <div 
                  className="relative w-44 h-72 rounded-[2.5rem] overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(145deg, #1D1D1F, #2D2D2F)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Screen bezel */}
                  <div 
                    className="absolute inset-2 rounded-[2rem] overflow-hidden"
                    style={{ backgroundColor: APPLE.background }}
                  >
                    {/* Dynamic Island */}
                    <div 
                      className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full z-20"
                      style={{ backgroundColor: '#1D1D1F' }}
                    />
                    
                    {/* Screen content */}
                    <div className="h-full pt-10 px-3 pb-3 flex flex-col">
                      <AnimatePresence mode="wait">
                        {/* Idle / Lock screen */}
                        {(animationPhase === 'idle' || animationPhase === 'approaching') && (
                          <motion.div 
                            key="lockscreen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center"
                          >
                            <div 
                              className="text-3xl font-light mb-1"
                              style={{ color: APPLE.text }}
                            >
                              9:41
                            </div>
                            <div 
                              className="text-xs"
                              style={{ color: APPLE.textSecondary }}
                            >
                              Thursday, January 16
                            </div>
                          </motion.div>
                        )}
                        
                        {/* NFC Detection */}
                        {animationPhase === 'tapping' && (
                          <motion.div 
                            key="detecting"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex-1 flex flex-col items-center justify-center"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5, repeat: 2 }}
                              className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                              style={{ backgroundColor: APPLE.accentSubtle }}
                            >
                              <svg 
                                className="w-8 h-8" 
                                viewBox="0 0 24 24" 
                                fill="none"
                                style={{ color: APPLE.accent }}
                              >
                                <path 
                                  d="M2 8.5C2 5 5 2 8.5 2M8.5 5C6.5 5 5 6.5 5 8.5M8.5 8C8 8 8 8.5 8 8.5M15.5 2C19 2 22 5 22 8.5M19 8.5C19 6.5 17.5 5 15.5 5M16 8.5C16 8 15.5 8 15.5 8M12 22C12 22 7 17 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 17 12 22 12 22Z" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </motion.div>
                            <div 
                              className="text-xs font-medium"
                              style={{ color: APPLE.text }}
                            >
                              NFC Detected
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Connected state */}
                        {animationPhase === 'connected' && (
                          <motion.div 
                            key="connected"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle2 
                                className="w-12 h-12 mb-2" 
                                style={{ color: '#34C759' }} 
                              />
                            </motion.div>
                            <div 
                              className="text-xs font-medium"
                              style={{ color: APPLE.text }}
                            >
                              Opening Profile...
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Profile View */}
                        {animationPhase === 'profile' && (
                          <motion.div 
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col"
                          >
                            {/* Profile header */}
                            <div className="text-center mb-3">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                                style={{ backgroundColor: APPLE.accent }}
                              >
                                <User className="w-6 h-6 text-white" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <div 
                                  className="text-sm font-semibold"
                                  style={{ color: APPLE.text }}
                                >
                                  Alex Morgan
                                </div>
                                <div 
                                  className="text-[10px]"
                                  style={{ color: APPLE.textSecondary }}
                                >
                                  CEO · IWASP
                                </div>
                              </motion.div>
                            </div>
                            
                            {/* Contact buttons */}
                            <div className="space-y-2">
                              {[
                                { icon: Phone, label: 'Call' },
                                { icon: Mail, label: 'Email' },
                                { icon: Linkedin, label: 'LinkedIn' },
                              ].map((item, i) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + i * 0.1 }}
                                  className="flex items-center gap-2 p-2 rounded-lg"
                                  style={{ backgroundColor: APPLE.accentSubtle }}
                                >
                                  <item.icon className="w-3 h-3" style={{ color: APPLE.accent }} />
                                  <span className="text-[10px] font-medium" style={{ color: APPLE.text }}>
                                    {item.label}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Side button */}
                  <div 
                    className="absolute right-0 top-24 w-1 h-10 rounded-l"
                    style={{ backgroundColor: '#3D3D3F' }}
                  />
                </div>

                {/* NFC Card */}
                <motion.div 
                  className="absolute z-20"
                  initial={{ x: -120, y: 20, rotate: -15 }}
                  animate={{
                    x: animationPhase === 'idle' ? -120 : 
                       animationPhase === 'approaching' ? -40 :
                       animationPhase === 'tapping' ? -20 :
                       animationPhase === 'connected' ? -30 :
                       -80,
                    y: animationPhase === 'idle' ? 20 :
                       animationPhase === 'approaching' ? 0 :
                       animationPhase === 'tapping' ? 0 :
                       animationPhase === 'connected' ? 10 :
                       30,
                    rotate: animationPhase === 'idle' ? -15 :
                            animationPhase === 'approaching' ? -5 :
                            animationPhase === 'tapping' ? 0 :
                            animationPhase === 'connected' ? -5 :
                            -10,
                    opacity: animationPhase === 'profile' ? 0.6 : 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                >
                  <div 
                    className="w-52 h-32 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 50%, #3D3D3F 100%)',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Card shine effect */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{
                        background: [
                          'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          'linear-gradient(110deg, transparent 50%, rgba(255,255,255,0.1) 70%, transparent 90%)',
                          'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-white/90 text-xl font-semibold tracking-wider">IWASP</span>
                    
                    {/* NFC chip icon */}
                    <div className="absolute top-3 right-3 opacity-60">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M2 8.5C2 5 5 2 8.5 2M8.5 5C6.5 5 5 6.5 5 8.5M15.5 2C19 2 22 5 22 8.5M19 8.5C19 6.5 17.5 5 15.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* NFC Waves Animation */}
                <AnimatePresence>
                  {(animationPhase === 'tapping' || animationPhase === 'connected') && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full"
                          style={{ 
                            border: `2px solid ${APPLE.accent}`,
                            width: 60 + i * 40,
                            height: 60 + i * 40,
                          }}
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ 
                            scale: 1.5, 
                            opacity: 0 
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Content */}
              <div>
                <h2 
                  className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
                  style={{ color: APPLE.text }}
                >
                  {t('nfcDemo.title')}
                </h2>
                <p 
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: APPLE.textSecondary }}
                >
                  {t('nfcDemo.description')}
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {[
                    t('nfcDemo.benefit1'),
                    t('nfcDemo.benefit2'),
                    t('nfcDemo.benefit3'),
                  ].map((benefit, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle2 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: APPLE.accent }} 
                      />
                      <span 
                        className="text-base"
                        style={{ color: APPLE.text }}
                      >
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
