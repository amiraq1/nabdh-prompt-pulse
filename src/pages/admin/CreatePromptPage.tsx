import CreatePromptForm from '@/components/admin/CreatePromptForm';
import { useLanguage, translations } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';
import BackButton from '@/components/BackButton';

const CreatePromptPage = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <div className="max-w-2xl">
      <BackButton />
      <div className={cn("mb-6", isRTL && "text-right")}>
        <h1 className="text-2xl font-bold text-foreground">{t.createNewPrompt[language]}</h1>
        <p className="text-muted-foreground">{t.addPulseToLibrary[language]}</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <CreatePromptForm />
      </div>
    </div>
  );
};

export default CreatePromptPage;

