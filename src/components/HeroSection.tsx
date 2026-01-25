import { Sparkles, ArrowDown } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in",
            isRTL && "flex-row-reverse"
          )}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              {isRTL ? 'مكتبة موجهات الذكاء الاصطناعي' : 'AI Prompt Library'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {isRTL ? (
              <>
                <span className="text-foreground">اكتشف </span>
                <span className="text-primary glow-text">نبض</span>
                <br />
                <span className="text-foreground">الإبداع</span>
              </>
            ) : (
              <>
                <span className="text-foreground">Find the </span>
                <span className="text-primary glow-text">Pulse</span>
                <br />
                <span className="text-foreground">of Creativity</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t.heroSubtitle[language]}
            <br className="hidden md:block" />
            {t.boostProductivity[language]}
          </p>

          {/* Stats */}
          <div className={cn(
            "flex items-center justify-center gap-8 md:gap-12 animate-fade-in",
            isRTL && "flex-row-reverse"
          )} style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">{t.prompts[language]}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">{t.aiModels[language]}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">{t.users[language]}</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="inline-flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-sm">{t.explorePrompts[language]}</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
