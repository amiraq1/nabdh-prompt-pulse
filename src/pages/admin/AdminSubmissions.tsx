import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/useLanguage';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export default function AdminSubmissions() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. جلب الطلبات المعلقة
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompt_submissions')
        .select('*')
        .eq('status', 'pending') // نجلب المعلقة فقط
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // 2. دالة الموافقة/الرفض
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('prompt_submissions')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] }); // تحديث القائمة الرئيسية لأن الموافقة تضيف موجه جديد

      toast({
        title: variables.status === 'approved'
          ? (isRTL ? 'تم النشر!' : 'Published!')
          : (isRTL ? 'تم الرفض' : 'Rejected'),
        description: variables.status === 'approved'
          ? (isRTL ? 'تمت إضافة الموجه للمكتبة العامة.' : 'Prompt added to public library.')
          : (isRTL ? 'تم رفض الطلب.' : 'Submission rejected.'),
        variant: variables.status === 'approved' ? 'default' : 'destructive',
      });
    },
  });

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Clock className="w-8 h-8 text-primary" />
          {isRTL ? 'طلبات المراجعة' : 'Submission Queue'}
          <Badge variant="secondary" className="text-lg px-3">
            {submissions?.length || 0}
          </Badge>
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : submissions?.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl">
            <Check className="w-16 h-16 mx-auto text-green-500 mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              {isRTL ? 'لا توجد طلبات معلقة' : 'No pending submissions'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isRTL ? 'كل شيء نظيف! استرح قليلاً ☕' : 'All caught up! Take a break ☕'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissions?.map((sub) => (
              <Card key={sub.id} className="flex flex-col border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{sub.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(sub.created_at), {
                        addSuffix: true,
                        locale: isRTL ? ar : enUS
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2 line-clamp-2" dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? (sub.title_ar || sub.title) : sub.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="bg-secondary/30 p-3 rounded-md text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                    {sub.content}
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{sub.ai_model}</Badge>
                    {sub.tags && sub.tags.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        + {sub.tags.length} tags
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3 pt-4 border-t bg-secondary/10">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction(sub.id, 'approved')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <Check className="w-4 h-4 me-2" />
                    {isRTL ? 'موافقة' : 'Approve'}
                  </Button>

                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAction(sub.id, 'rejected')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <X className="w-4 h-4 me-2" />
                    {isRTL ? 'رفض' : 'Reject'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
