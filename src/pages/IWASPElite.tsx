import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, LayoutDashboard, CreditCard, BarChart3, Save, MessageCircle, Linkedin, Instagram, Globe, ChevronRight, ChevronDown, Cpu, Database, Zap, Users, Eye, Edit, Trash2, CreditCard as CardIcon, Mail, Lock, Check, Crown, Phone, MapPin, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Images
import heroBackground from '@/assets/hero-background.jpg';
import profilePhoto from '@/assets/profile-photo.jpg';

// ============================================
// VALIDATION SCHEMAS
// ============================================
const signupSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50, 'Le prénom est trop long'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom est trop long'),
  email: z.string().email('Email invalide').max(255, 'Email trop long'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

type SignupFormData = z.infer<typeof signupSchema>;

// ============================================
// DESIGN SYSTEM - i-wasp ELITE
// ============================================
const ELITE = {
  midnight: '#0A1931',
  midnightLight: '#162a4a',
  gold: '#D4AF37',
  emerald: '#00D9A3',
  offwhite: '#FBFBFB',
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

// ============================================
// NAVIGATION
// ============================================
const EliteNavbar = () => {
  const [activeSection, setActiveSection] = useState('vision');

  const navItems = [
    { id: 'vision', label: 'Vision' },
    { id: 'auth', label: "S'inscrire" },
    { id: 'dashboard', label: 'Dashboard Client' },
    { id: 'profile', label: 'Rendu Profil' },
    { id: 'admin', label: 'Console Admin 👑' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1931] border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
              <span className="text-[#0A1931] font-black text-sm">iW</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">I-WASP</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 py-1 ${
                  activeSection === item.id 
                    ? 'text-[#D4AF37]' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// SECTION: VISION
// ============================================
const VisionSection = () => (
  <section id="vision" className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="max-w-4xl mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
          L'Écosystème Elite i-wasp
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Découvrez l'interface de présentation de la marque. Cette section est le point d'entrée pour les futurs clients, expliquant la fusion entre l'IA et le networking physique haute performance.
        </p>
      </motion.div>

      {/* Hero Card */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-8 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Background Image */}
        <motion.div 
          variants={fadeInUp}
          className="relative rounded-[2rem] overflow-hidden h-64 lg:h-auto min-h-[300px]"
        >
          <img 
            src={heroBackground} 
            alt="i-wasp Elite Hero Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-[2rem] p-10 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-10 right-10 text-[200px] font-black text-white/5 leading-none pointer-events-none">
            iW
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-6 relative z-10">
            Maîtrisez votre<br />
            <span className="text-[#D4AF37]">Aura Digitale.</span>
          </h1>
          <Link
            to="/commander"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-[#0A1931] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 w-fit"
          >
            Déployer mon Aura
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {[
          { emoji: '🤖', title: 'IA Native', desc: 'Rédaction et optimisation de profil assistée par l\'intelligence artificielle i-wasp.' },
          { emoji: '✨', title: 'Matériel de Luxe', desc: 'Cartes en métal ou bois précieux avec puces NFC i-wasp cryptées.' },
          { emoji: '📈', title: 'Analytics Pro', desc: 'Suivi précis des scans et de l\'engagement de votre réseau sur votre profil.' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100"
          >
            <span className="text-4xl mb-4 block">{feature.emoji}</span>
            <h3 className="text-xl font-black text-[#0A1931] tracking-tight mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ============================================
// SECTION: AUTH (Login / Register)
// ============================================
const AuthSection = () => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Password reset state
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Register state
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: loginEmail, 
        password: loginPassword 
      });
      if (error) throw error;
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    
    setIsResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion Google');
    }
  };

  const validateField = (field: keyof SignupFormData, value: string) => {
    try {
      signupSchema.shape[field].parse(value);
      setSignupErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setSignupErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleSignupChange = (field: keyof SignupFormData, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const result = signupSchema.safeParse(signupForm);
    if (!result.success) {
      const errors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof SignupFormData;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setSignupErrors(errors);
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSignupLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: signupForm.firstName,
            last_name: signupForm.lastName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Cet email est déjà utilisé. Essayez de vous connecter.');
        }
        throw error;
      }

      toast.success('Compte créé avec succès ! Bienvenue chez i-wasp Elite 🎉');
      navigate('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du compte');
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <section id="auth" className="py-24 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="max-w-4xl mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
            Accès à l'Expérience i-wasp
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Comment vos clients rejoignent l'aventure. Cette section simule le processus d'authentification et de démarrage pour un nouvel utilisateur qui vient d'acquérir sa carte.
          </p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Login Card */}
          <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
            {!showResetForm ? (
              <>
                <div className="text-center mb-8">
                  <span className="text-5xl mb-4 block">👋</span>
                  <h3 className="text-2xl font-black text-[#0A1931] tracking-tight">Ravi de vous revoir</h3>
                  <p className="text-gray-500">Connectez-vous pour gérer votre aura i-wasp</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="mehdi@email.com"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Mot de passe</label>
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-xs text-[#D4AF37] hover:underline font-medium"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="w-full py-4 bg-[#0A1931] text-white font-bold rounded-2xl hover:bg-[#162a4a] transition-colors disabled:opacity-50"
                  >
                    {isLoginLoading ? 'Connexion...' : 'Se Connecter'}
                  </button>
                </form>

                {/* Google Login */}
                <div className="mt-6">
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-gray-200 w-full"></div>
                    <span className="bg-white px-4 text-gray-400 text-sm">ou</span>
                    <div className="border-t border-gray-200 w-full"></div>
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all font-medium text-[#0A1931]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <span className="text-5xl mb-4 block">{resetSent ? '✅' : '🔐'}</span>
                  <h3 className="text-2xl font-black text-[#0A1931] tracking-tight">
                    {resetSent ? 'Email envoyé !' : 'Réinitialiser le mot de passe'}
                  </h3>
                  <p className="text-gray-500">
                    {resetSent 
                      ? 'Vérifiez votre boîte mail pour le lien de réinitialisation'
                      : 'Entrez votre email pour recevoir un lien de réinitialisation'
                    }
                  </p>
                </div>

                {!resetSent ? (
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="mehdi@email.com"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isResetLoading}
                      className="w-full py-4 bg-[#D4AF37] text-[#0A1931] font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50"
                    >
                      {isResetLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-5 h-5 border-2 border-[#0A1931]/30 border-t-[#0A1931] rounded-full animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        'Envoyer le lien'
                      )}
                    </button>
                  </form>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setResetSent(false);
                    setResetEmail('');
                  }}
                  className="w-full mt-4 py-3 text-gray-500 text-sm hover:text-[#0A1931] transition-colors"
                >
                  ← Retour à la connexion
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Register Card */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-10 right-10 text-[150px] font-black text-white/5 leading-none pointer-events-none">
              ⚡
            </div>
            
            {!showSignupForm ? (
              <>
                <div className="text-center mb-8 relative z-10">
                  <span className="text-5xl mb-4 block">🏆</span>
                  <h3 className="text-2xl font-black text-[#D4AF37] tracking-tight">Devenir Membre Elite</h3>
                  <p className="text-gray-400">Prêt à dominer votre secteur ?</p>
                </div>

                <div className="space-y-4 mb-8 relative z-10">
                  {[
                    'Activez votre carte physique en 30 secondes',
                    'Laissez l\'IA rédiger votre présentation pro',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                        <CardIcon className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowSignupForm(true)}
                  className="block w-full py-4 bg-[#D4AF37] text-[#0A1931] font-bold rounded-2xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all relative z-10"
                >
                  CRÉER MON PROFIL I-WASP
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-[#D4AF37] tracking-tight">Créer mon compte Elite</h3>
                  <p className="text-gray-400 text-sm">Rejoignez le réseau d'influence i-wasp</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* First Name */}
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={signupForm.firstName}
                        onChange={(e) => handleSignupChange('firstName', e.target.value)}
                        placeholder="Prénom"
                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37] outline-none ${
                          signupErrors.firstName ? 'border-red-400' : 'border-white/20'
                        }`}
                      />
                    </div>
                    {signupErrors.firstName && (
                      <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signupErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={signupForm.lastName}
                        onChange={(e) => handleSignupChange('lastName', e.target.value)}
                        placeholder="Nom"
                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37] outline-none ${
                          signupErrors.lastName ? 'border-red-400' : 'border-white/20'
                        }`}
                      />
                    </div>
                    {signupErrors.lastName && (
                      <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signupErrors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => handleSignupChange('email', e.target.value)}
                        placeholder="Email"
                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37] outline-none ${
                          signupErrors.email ? 'border-red-400' : 'border-white/20'
                        }`}
                      />
                    </div>
                    {signupErrors.email && (
                      <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signupErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        placeholder="Mot de passe"
                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37] outline-none ${
                          signupErrors.password ? 'border-red-400' : 'border-white/20'
                        }`}
                      />
                    </div>
                    {signupErrors.password && (
                      <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {signupErrors.password}
                      </p>
                    )}
                    <p className="mt-1 text-gray-500 text-xs">
                      8 caractères min, 1 majuscule, 1 chiffre
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSignupLoading}
                    className="w-full py-4 bg-[#D4AF37] text-[#0A1931] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50"
                  >
                    {isSignupLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-[#0A1931]/30 border-t-[#0A1931] rounded-full animate-spin" />
                        Création...
                      </span>
                    ) : (
                      'CRÉER MON COMPTE'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSignupForm(false)}
                    className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    ← Retour
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// SECTION: CLIENT DASHBOARD
// ============================================
const ClientDashboardSection = () => {
  const chartData = [
    { day: 'Lun', value: 120 },
    { day: 'Mar', value: 180 },
    { day: 'Mer', value: 150 },
    { day: 'Jeu', value: 280 },
    { day: 'Ven', value: 320 },
    { day: 'Sam', value: 380 },
    { day: 'Dim', value: 450 },
  ];

  return (
    <section id="dashboard" className="py-24 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="max-w-4xl mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
            Votre Tour de Contrôle Personnelle
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            L'interface de gestion pour le client. C'est ici qu'il voit ses statistiques de visite et personnalise son profil digital i-wasp.
          </p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Left Column - Score & Social */}
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* Aura Score */}
            <div className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-[2rem] p-6">
              <h3 className="text-[#D4AF37] font-bold text-sm mb-4">Score Aura ⚡</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke="#D4AF37" 
                    strokeWidth="10" 
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${92 * 3.52} ${100 * 3.52}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">92%</span>
                </div>
              </div>
              <button className="w-full py-3 bg-[#D4AF37]/20 text-[#D4AF37] font-medium rounded-xl text-sm hover:bg-[#D4AF37]/30 transition-colors">
                Aperçu de mon profil
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
              <h3 className="text-[#0A1931] font-bold mb-4">Réseaux Sociaux 🔗</h3>
              <div className="space-y-3">
                {[
                  { icon: Linkedin, name: 'LinkedIn', status: 'Connecté', color: '#0077B5' },
                  { icon: Instagram, name: 'Instagram', status: 'Connecté', color: '#E4405F' },
                ].map((social, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <social.icon className="w-5 h-5" style={{ color: social.color }} />
                      <span className="font-medium text-[#0A1931]">{social.name}</span>
                    </div>
                    <span className="text-[#00D9A3] text-sm font-medium">{social.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats & Chart */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <div className="text-gray-500 text-sm mb-2">Visiteurs ce mois 👥</div>
                <div className="text-4xl font-black text-[#0A1931]">1,204</div>
              </div>
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <div className="text-gray-500 text-sm mb-2">Contacts enregistrés 📱</div>
                <div className="text-4xl font-black text-[#0A1931]">342</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-black text-[#0A1931] mb-6">Tendances des Visites sur i-wasp 📈</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D9A3" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D9A3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1931', border: 'none', borderRadius: '12px' }}
                      labelStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#00D9A3" strokeWidth={3} fill="url(#colorVisits)" dot={{ fill: '#fff', stroke: '#00D9A3', strokeWidth: 3, r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// SECTION: PROFILE RENDER
// ============================================
const ProfileRenderSection = () => (
  <section id="profile" className="py-24 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <motion.div 
        className="text-center max-w-4xl mx-auto mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-4">
          Le Rendu Final
        </h2>
        <p className="text-gray-600 text-lg">
          C'est l'interface que vos partenaires voient en scannant votre carte i-wasp.
        </p>
      </motion.div>

      {/* Phone Mockup */}
      <motion.div 
        className="flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="w-[320px] bg-[#0A1931] rounded-[3rem] p-3 shadow-2xl">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 text-white text-sm">
            <span className="font-semibold">14:30</span>
            <span className="text-xs">📶 🔋</span>
          </div>
          
          {/* Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Cover Image */}
            <div className="h-28 relative overflow-hidden">
              <img 
                src={heroBackground} 
                alt="Cover" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    src={profilePhoto} 
                    alt="Mehdi El Alami" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="pt-14 pb-4 px-6 text-center">
              <h3 className="text-xl font-black text-[#0A1931]">Mehdi El Alami</h3>
              <p className="text-[#D4AF37] font-medium text-sm">CEO i-wasp Elite 🚀</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 px-6 mb-4">
              <button className="flex-1 py-3 bg-[#0A1931] text-white rounded-xl font-bold text-sm">Enregistrer</button>
              <button className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm">WhatsApp</button>
            </div>

            {/* Links */}
            <div className="px-6 pb-6 space-y-2">
              {[
                { icon: Linkedin, name: 'LinkedIn Profile' },
                { icon: Globe, name: 'Site Officiel' },
              ].map((link, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <link.icon className="w-5 h-5 text-[#0A1931]" />
                  <span className="text-[#0A1931] font-medium text-sm">{link.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// SECTION: ADMIN CONSOLE
// ============================================
const AdminConsoleSection = () => {
  const adminStats = [
    { label: 'Total Utilisateurs', value: '15,482' },
    { label: 'Cartes Actives', value: '12,104' },
    { label: 'CA Mensuel (estimé)', value: '1.2M MAD' },
    { label: 'Alertes Système', value: '0' },
  ];

  const members = [
    { initials: 'MK', name: 'Mehdi K.', id: 'IW-4820', card: 'Or 24K Edition', status: 'Actif', activity: 'Il y a 2 min' },
    { initials: 'SB', name: 'Sarah B.', id: 'IW-9201', card: 'Métal Noir', status: 'Actif', activity: 'Hier, 18:45' },
    { initials: 'RM', name: 'Rayan M.', id: 'IW-1102', card: 'Standard PVC', status: 'Suspendu', activity: 'Jamais connecté' },
  ];

  const growthData = [
    { month: 'Jan', users: 5000 },
    { month: 'Fév', users: 7500 },
    { month: 'Mar', users: 9000 },
    { month: 'Avr', users: 11000 },
    { month: 'Mai', users: 13500 },
    { month: 'Juin', users: 15482 },
  ];

  return (
    <section id="admin" className="py-24 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-4">
            Console Admin Centrale 👑
          </h2>
          <p className="text-gray-600 text-lg italic">
            "Votre tour de contrôle pour gérer le réseau i-wasp au Maroc et à l'international."
          </p>
        </motion.div>

        {/* Admin Stats */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {adminStats.map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 text-center"
            >
              <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
              <div className="text-3xl font-black text-[#0A1931]">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Members Table */}
        <motion.div 
          className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-[#0A1931]">Gestion des Membres i-wasp Elite</h3>
              <p className="text-gray-500 text-sm">Gérez, activez ou révoquez les accès à distance.</p>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="px-4 py-2 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-4">Membre</th>
                  <th className="pb-4">Type de Carte</th>
                  <th className="pb-4">Statut NFC</th>
                  <th className="pb-4">Dernière Activité</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#0A1931] font-bold text-sm">
                          {member.initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#0A1931]">{member.name}</div>
                          <div className="text-gray-400 text-xs">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-[#0A1931]">{member.card}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        member.status === 'Actif' ? 'text-[#00D9A3]' : 'text-orange-500'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'Actif' ? 'bg-[#00D9A3]' : 'bg-orange-500'
                        }`}></span>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 text-sm">{member.activity}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Growth Chart */}
        <motion.div 
          className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="text-xl font-black text-[#0A1931] mb-6">Croissance du Réseau i-wasp 🚀</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1931', border: 'none', borderRadius: '12px' }}
                  labelStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value.toLocaleString()} utilisateurs`, 'Total']}
                />
                <Area type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={3} fill="url(#colorGrowth)" dot={{ fill: '#fff', stroke: '#D4AF37', strokeWidth: 3, r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const EliteFooter = () => (
  <footer className="py-16 bg-[#0A1931]">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
              <span className="text-[#0A1931] font-black text-sm">iW</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">i-wasp</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Établir le standard mondial de l'identité digitale de prestige au Maroc.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-4">Exploration</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#vision" className="hover:text-[#D4AF37] transition-colors">Vision</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Intelligence IA</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Boutique Elite</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4">Réseau i-wasp</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Casablanca / Monde
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              prestige@i-wasp.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© 2026 i-wasp. Console de Gestion Unifiée.</p>
        <div className="flex gap-6 text-gray-400 text-sm">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Conditions d'Elite</a>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN PAGE
// ============================================
const IWASPElite = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans">
      <EliteNavbar />
      <VisionSection />
      <AuthSection />
      <ClientDashboardSection />
      <ProfileRenderSection />
      <AdminConsoleSection />
      <EliteFooter />
    </div>
  );
};

export default IWASPElite;
