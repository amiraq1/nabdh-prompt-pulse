import { useState } from 'react';
import { useLanguage } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert, Clock, User, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AuditLogsPage = () => {
    const { isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data
    const logs = [
        { id: 1, action: 'User Login', user: 'ahmed@example.com', ip: '192.168.1.5', status: 'success', time: '2 mins ago' },
        { id: 2, action: 'Update Prompt', user: 'admin@nabdh.app', ip: '10.0.0.12', status: 'success', time: '15 mins ago' },
        { id: 3, action: 'Failed Login', user: 'unknown@hacker.com', ip: '45.33.22.11', status: 'failed', time: '1 hour ago' },
        { id: 4, action: 'Delete User', user: 'admin@nabdh.app', ip: '10.0.0.12', status: 'warning', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-6">
            <div className={cn("flex flex-col gap-2", isRTL && "text-right")}>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                    {isRTL ? 'سجلات التدقيق والأمان' : 'Security Audit Logs'}
                </h1>
                <p className="text-muted-foreground">
                    {isRTL ? 'تتبع جميع الإجراءات الحساسة ومحاولات الوصول' : 'Track all sensitive actions and access attempts'}
                </p>
            </div>

            {/* Filters */}
            <div className={cn("flex items-center gap-4 bg-card p-4 rounded-xl border border-border", isRTL && "flex-row-reverse")}>
                <div className="relative flex-1 max-w-md">
                    <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                    <Input
                        placeholder={isRTL ? "بحث في السجلات..." : "Search logs..."}
                        className={cn(isRTL ? "pr-10" : "pl-10")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'الإجراء' : 'Action'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'المستخدم' : 'User'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'المصدر' : 'Source IP'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'التوقيت' : 'Time'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-secondary/30 border-b border-border/50">
                                <TableCell className={cn("font-medium", isRTL && "text-right")}>
                                    {log.action}
                                </TableCell>
                                <TableCell className={cn(isRTL && "text-right")}>
                                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                        <User className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm">{log.user}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(isRTL && "text-right")}>
                                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                        <Globe className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm font-mono">{log.ip}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(isRTL && "text-right")}>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "capitalize",
                                            log.status === 'success' && "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
                                            log.status === 'failed' && "text-red-500 border-red-500/30 bg-red-500/10",
                                            log.status === 'warning' && "text-amber-500 border-amber-500/30 bg-amber-500/10",
                                        )}
                                    >
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className={cn("text-muted-foreground text-sm", isRTL && "text-right")}>
                                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                        <Clock className="w-3 h-3" />
                                        {log.time}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AuditLogsPage;

