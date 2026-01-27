import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { useLanguage } from "@/contexts/useLanguage";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, User as UserIcon, Lock, Palette, Globe, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Seo from "@/components/Seo";
import BackButton from "@/components/BackButton";

export default function SettingsPage() {
  const { user, session } = useAuth();
  const { isRTL, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const pageTitle = isRTL ? "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" : "Settings";
  const pageDescription = isRTL
    ? "\u0642\u0645 \u0628\u0625\u062f\u0627\u0631\u0629 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062e\u0635\u064a \u0648\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0623\u0645\u0627\u0646 \u0648\u0627\u0644\u0644\u063a\u0629 \u0641\u064a \u0646\u0628\u0636."
    : "Manage your profile, security, and language preferences in Nabdh.";

  const getErrorMessage = useCallback((error: unknown) => {
    if (error instanceof Error) return error.message;
    return isRTL ? "ÕœÀ Œÿ√ €Ì— „⁄—Ê›" : "An unknown error occurred";
  }, [isRTL]);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, website, avatar_url, full_name, bio")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setUsername(data.username || "");
        setWebsite(data.website || "");
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
      }
    } catch (error) {
      console.error("Error loading user data!", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user, getErrorMessage]);

  // 1. Fetch Profile Data
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    void getProfile();
  }, [user, navigate, getProfile]);

  // 2. Update Profile Function
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        website,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      toast({
        title: isRTL ? " „ «·Õ›Ÿ" : "Profile updated",
        description: isRTL ? " „  ÕœÌÀ »Ì«‰« ﬂ »‰Ã«Õ." : "Your profile has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: isRTL ? "Œÿ√" : "Error",
        description: getErrorMessage(error),
      });
    } finally {
      setUpdating(false);
    }
  };

  // 3. Update Password Function
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: isRTL ? "Œÿ√" : "Error",
        description: isRTL ? "ﬂ·„«  «·„—Ê— €Ì— „ ÿ«»ﬁ…" : "Passwords do not match",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: isRTL ? "Œÿ√" : "Error",
        description: isRTL ? "ﬂ·„… «·„—Ê— ﬁ’Ì—… Ãœ«" : "Password is too short",
      });
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: isRTL ? " „ «· ÕœÌÀ" : "Success",
        description: isRTL ? " „  €ÌÌ— ﬂ·„… «·„—Ê— »‰Ã«Õ" : "Password updated successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: isRTL ? "Œÿ√" : "Error",
        description: getErrorMessage(error),
      });
    } finally {
      setUpdating(false);
    }
  };

  // 4. Upload Avatar Function
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUpdating(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: isRTL ? "›‘· «·—›⁄" : "Upload failed",
        description: getErrorMessage(error),
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <Seo title={pageTitle} description={pageDescription} noIndex />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">{isRTL ? "«·≈⁄œ«œ« " : "Settings"}</h1>

        <Tabs defaultValue="profile" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4" /> {isRTL ? "«·„·› «·‘Œ’Ì" : "Profile"}
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Lock className="h-4 w-4" /> {isRTL ? "«·√„«‰ Ê«·Õ”«»" : "Account & Security"}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" /> {isRTL ? "«·„ŸÂ— Ê«··€…" : "Appearance"}
            </TabsTrigger>
          </TabsList>

          {/* --- TAB 1: PROFILE --- */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "«·„⁄·Ê„«  «·‘Œ’Ì…" : "Personal Information"}</CardTitle>
                <CardDescription>{isRTL ? "Â–Â «·„⁄·Ê„«  ” ŸÂ— ··⁄«„… ›Ì „Ã „⁄ ‰»÷." : "This information will be displayed publicly."}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-secondary/20 rounded-lg border border-border">
                    <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
                      <AvatarImage src={avatarUrl || ""} objectFit="cover" />
                      <AvatarFallback>
                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-start space-y-2">
                      <p className="text-sm font-medium">{isRTL ? "’Ê—… «·„·› «·‘Œ’Ì" : "Profile Picture"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? "‰ﬁ»· JPG, PNG √Ê GIF. »Õœ √ﬁ’Ï 2MB." : "Supports JPG, PNG or GIF. Max 2MB."}
                      </p>
                      <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex">
                        <div className="flex items-center gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors shadow-sm">
                          <Upload className="h-4 w-4" />
                          {isRTL ? "—›⁄ ’Ê—… ÃœÌœ…" : "Upload New"}
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={uploadAvatar}
                          disabled={updating}
                        />
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{isRTL ? "«·«”„ «·ﬂ«„·" : "Full Name"}</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isRTL ? "«”„ﬂ «·ﬂ«„·" : "Your full name"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">{isRTL ? "«”„ «·„” Œœ„" : "Username"}</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">{isRTL ? "‰»–… ⁄‰ﬂ" : "Bio"}</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={isRTL ? "«ﬂ » ﬁ·Ì·« ⁄‰ ‰›”ﬂ..." : "Tell us about yourself..."}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">{isRTL ? "«·„Êﬁ⁄ «·≈·ﬂ —Ê‰Ì" : "Website"}</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={updating} className="gap-2">
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {isRTL ? "Õ›Ÿ «· €ÌÌ—« " : "Save Changes"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- TAB 2: ACCOUNT & SECURITY --- */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Email Section (Read Only) */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "«·»—Ìœ «·≈·ﬂ —Ê‰Ì" : "Email Address"}</CardTitle>
                  <CardDescription>{isRTL ? "«·»—Ìœ «·„” Œœ„ · ”ÃÌ· «·œŒÊ·." : "The email address used to log in."}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input value={session?.user.email} disabled className="bg-muted max-w-md" />
                </CardContent>
              </Card>

              {/* Password Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? " €ÌÌ— ﬂ·„… «·„—Ê—" : "Change Password"}</CardTitle>
                  <CardDescription>{isRTL ? "«Œ — ﬂ·„… „—Ê— ﬁÊÌ… · √„Ì‰ Õ”«»ﬂ." : "Choose a strong password to secure your account."}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">{isRTL ? "ﬂ·„… «·„—Ê— «·ÃœÌœ…" : "New Password"}</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{isRTL ? " √ﬂÌœ ﬂ·„… «·„—Ê—" : "Confirm Password"}</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="outline" disabled={updating || !newPassword}>
                      {isRTL ? " ÕœÌÀ ﬂ·„… «·„—Ê—" : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">{isRTL ? "„‰ÿﬁ… «·Œÿ—" : "Danger Zone"}</CardTitle>
                  <CardDescription>{isRTL ? "Â–Â «·≈Ã—«¡«  ·« Ì„ﬂ‰ «· —«Ã⁄ ⁄‰Â«." : "Irreversible actions."}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{isRTL ? "Õ–› «·Õ”«»" : "Delete Account"}</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? "Õ–› Õ”«»ﬂ ÊÃ„Ì⁄ »Ì«‰« ﬂ ‰Â«∆Ì«." : "Permanently delete your account and all data."}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: isRTL ? "ﬁ—Ì»«" : "Coming soon",
                        description: isRTL
                          ? "Õ–› «·Õ”«» Ì ÿ·» «· Ê«’· „⁄ «·œ⁄„ Õ«·Ì«."
                          : "Account deletion requires contacting support currently.",
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRTL ? "Õ–› «·Õ”«»" : "Delete Account"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- TAB 3: APPEARANCE --- */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "«··€… Ê«·„‰ÿﬁ…" : "Language & Region"}</CardTitle>
                <CardDescription>{isRTL ? " Œ’Ì’ ·€… Ê«ÃÂ… «· ÿ»Ìﬁ." : "Customize your interface language."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{isRTL ? "·€… «·Ê«ÃÂ…" : "Interface Language"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "«·⁄—»Ì… (Arabic)" : "«·≈‰Ã·Ì“Ì… (English)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button
                      variant={language === "ar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("ar")}
                    >
                      «·⁄—»Ì…
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

