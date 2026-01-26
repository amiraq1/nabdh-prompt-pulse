import { useState } from 'react';
import { useLanguage } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Shield, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UsersPage = () => {
    const { isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for UI demonstration
    const users = [
        { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', role: 'admin', status: 'active', lastActive: '2 mins ago' },
        { id: 2, name: 'Sara Smith', email: 'sara@example.com', role: 'moderator', status: 'active', lastActive: '1 hour ago' },
        { id: 3, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'inactive', lastActive: '2 days ago' },
    ];

    return (
        <div className="space-y-6">
            <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "sm:flex-row-reverse")}>
                <div>
                    <h1 className={cn("text-2xl font-bold text-foreground", isRTL && "text-right")}>
                        {isRTL ? 'إدارة المستخدمين' : 'User Management'}
                    </h1>
                    <p className={cn("text-muted-foreground", isRTL && "text-right")}>
                        {isRTL ? 'عرض وإدارة صلاحيات الأعضاء' : 'View and manage member permissions'}
                    </p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                    {isRTL ? 'إضافة مستخدم' : 'Add User'}
                </Button>
            </div>

            {/* Filters */}
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className="relative flex-1 max-w-sm">
                    <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                    <Input
                        placeholder={isRTL ? "بحث عن مستخدم..." : "Search users..."}
                        className={cn(isRTL ? "pr-10" : "pl-10")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'المستخدم' : 'User'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'الدور' : 'Role'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                            <TableHead className={cn(isRTL && "text-right")}>{isRTL ? 'آخر نشاط' : 'Last Active'}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-secondary/30 border-b border-border/50">
                                <TableCell className={cn("font-medium", isRTL && "text-right")}>
                                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-semibold">{user.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(isRTL && "text-right")}>
                                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                        {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-primary" />}
                                        <span className="capitalize text-sm">{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(isRTL && "text-right")}>
                                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className={cn("text-muted-foreground text-sm", isRTL && "text-right")}>
                                    {user.lastActive}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UsersPage;

