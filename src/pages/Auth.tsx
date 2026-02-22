import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Egg, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inscription réussie", description: "Vérifiez votre email pour confirmer votre compte." });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-emerald/20 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-gold-dark/15 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Brand header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex"
          >
            <div className="gradient-gold p-4 rounded-2xl glow-gold">
              <Egg className="h-10 w-10 text-primary-foreground" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
            BIOVOLAILLES
          </h1>
          <p className="text-lg font-semibold uppercase tracking-[0.25em] text-gold">
            Union Trace
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-emerald-light" />
            Traçabilité de la ferme à la fourchette
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-card rounded-2xl p-1 glow-gold">
          <Tabs defaultValue="login" className="w-full">
            <div className="p-5 pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                  Inscription
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login" className="p-5 pt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground/80">Email</Label>
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="bg-secondary/50 border-border focus:border-gold-dark focus:ring-gold-dark/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground/80">Mot de passe</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="bg-secondary/50 border-border focus:border-gold-dark focus:ring-gold-dark/30" />
                </div>
                <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity" disabled={submitting}>
                  {submitting ? "Connexion…" : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="p-5 pt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-foreground/80">Nom complet</Label>
                  <Input id="reg-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                    className="bg-secondary/50 border-border focus:border-gold-dark focus:ring-gold-dark/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-foreground/80">Email</Label>
                  <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="bg-secondary/50 border-border focus:border-gold-dark focus:ring-gold-dark/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-foreground/80">Mot de passe</Label>
                  <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                    className="bg-secondary/50 border-border focus:border-gold-dark focus:ring-gold-dark/30" />
                </div>
                <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity" disabled={submitting}>
                  {submitting ? "Inscription…" : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
