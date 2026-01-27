import { Sparkles, ArrowDown } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Effects - Reduced on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-2xl sm:blur-3xl" />
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-primary/10 rounded-full blur-xl sm:blur-2xl animate-float" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-primary/8 rounded-full blur-xl sm:blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6 animate-fade-in",
            isRTL && "flex-row-reverse"
          )}>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-primary font-medium">
              {isRTL ? 'مكتبة موجهات الذكاء الاصطناعي' : 'AI Prompt Library'}
            </span>
          </div>

          {/* Title - Responsive sizing */}
          <h1 className={cn(
            "hero-title font-bold mb-4 sm:mb-6 animate-fade-in leading-tight",
            "font-display",
            isRTL && "font-arabic"
          )} style={{ animationDelay: '0.1s' }}>
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

          {/* Subtitle - Responsive text */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 animate-fade-in px-2 text-measure mx-auto" style={{ animationDelay: '0.2s' }}>
            {t.heroSubtitle[language]}
            <br className="hidden sm:block" />
            <span className="hidden sm:inline">{t.boostProductivity[language]}</span>
          </p>

          {/* Stats - Responsive layout */}
          <div className={cn(
            "flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 animate-fade-in",
            isRTL && "flex-row-reverse"
          )} style={{ animationDelay: '0.3s' }}>
            <div className="text-center min-w-[60px] sm:min-w-[80px]">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.prompts[language]}</div>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-border" />
            <div className="text-center min-w-[60px] sm:min-w-[80px]">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.aiModels[language]}</div>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-border" />
            <div className="text-center min-w-[60px] sm:min-w-[80px]">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t.users[language]}</div>
            </div>
          </div>

          {/* Scroll indicator - Hidden on very small screens */}
          <div className="mt-8 sm:mt-12 md:mt-16 animate-fade-in hidden sm:block" style={{ animationDelay: '0.4s' }}>
            <div className="inline-flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs sm:text-sm">{t.explorePrompts[language]}</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
