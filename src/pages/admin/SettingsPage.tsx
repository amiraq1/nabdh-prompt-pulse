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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { user, session } = useAuth();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const getErrorMessage = useCallback((error: unknown) => {
  if (error instanceof Error) return error.message;
  return isRTL ? "ÕœÀ Œÿ√ €Ì— „⁄—Ê›" : "An unknown error occurred";
}, [isRTL]);

  // 1. Ã·» »Ì«‰«  «·»—Ê›«Ì· ⁄‰œ «· Õ„Ì·
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("username, website, avatar_url, full_name, bio")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

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
    };

    void getProfile();
  }, [user, navigate, getErrorMessage]);

  // 2.  ÕœÌÀ «·»—Ê›«Ì·
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

  // 3. —›⁄ «·’Ê—… «·—„“Ì…
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

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // «·Õ’Ê· ⁄·Ï «·—«»ÿ
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "≈⁄œ«œ«  «·Õ”«»" : "Account Settings"}</CardTitle>
            <CardDescription>
              {isRTL ? "ﬁ„ »≈œ«—… „·›ﬂ «·‘Œ’Ì ÊﬂÌ› Ì—«ﬂ «·¬Œ—Ê‰." : "Manage your profile and how others see you."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-6">
              {/* ﬁ”„ «·’Ê—… */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl || ""} objectFit="cover" />
                  <AvatarFallback><UserIcon className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline bg-secondary px-4 py-2 rounded-md">
                      <Upload className="h-4 w-4" />
                      {isRTL ? " €ÌÌ— «·’Ê—…" : "Change Avatar"}
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

              {/* «·ÕﬁÊ· «·‰’Ì… */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{isRTL ? "«·»—Ìœ «·≈·ﬂ —Ê‰Ì" : "Email"}</Label>
                  <Input id="email" value={session?.user.email} disabled className="bg-muted" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullName">{isRTL ? "«·«”„ «·ﬂ«„·" : "Full Name"}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isRTL ? "«”„ﬂ «·ﬂ«„·" : "Your full name"}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">{isRTL ? "«”„ «·„” Œœ„" : "Username"}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">{isRTL ? "‰»–… ⁄‰ﬂ" : "Bio"}</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={isRTL ? "«ﬂ » ﬁ·Ì·« ⁄‰ ‰›”ﬂ..." : "Write a little bit about yourself..."}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updating}>
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isRTL ? "Õ›Ÿ «· €ÌÌ—« " : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}



