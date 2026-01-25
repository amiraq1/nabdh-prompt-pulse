import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your admin preferences</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">RTL Mode</Label>
                <p className="text-sm text-muted-foreground">Enable right-to-left layout for Arabic content</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Show Arabic Titles</Label>
                <p className="text-sm text-muted-foreground">Display Arabic translations when available</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">New Submission Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when users submit new prompts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm">
            Save Changes
          </Button>
          <Button variant="outline" className="border-border hover:bg-secondary">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
