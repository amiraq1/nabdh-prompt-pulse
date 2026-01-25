import CreatePromptForm from '@/components/admin/CreatePromptForm';

const CreatePromptPage = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create New Prompt</h1>
        <p className="text-muted-foreground">Add a new pulse to your library</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <CreatePromptForm />
      </div>
    </div>
  );
};

export default CreatePromptPage;
