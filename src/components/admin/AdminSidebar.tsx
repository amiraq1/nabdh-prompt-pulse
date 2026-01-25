import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Settings,
    ShieldAlert,
    Zap,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage, translations } from '@/contexts/LanguageContext';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const { language, isRTL } = useLanguage();
    const t = translations;

    const menuGroups = [
        {
            title: isRTL ? 'عام' : 'General',
            items: [
                { title: t.dashboard[language], path: '/admin', icon: LayoutDashboard },
                { title: isRTL ? 'التحليلات' : 'Analytics', path: '/admin/analytics', icon: BarChart3 },
            ]
        },
        {
            title: isRTL ? 'إدارة المحتوى' : 'Content',
            items: [
                { title: t.prompts[language], path: '/admin/prompts', icon: FileText },
                { title: isRTL ? 'إضافة جديد' : 'Add New', path: '/admin/create', icon: Zap },
            ]
        },
        {
            title: isRTL ? 'المستخدمين والأمان' : 'Users & Security',
            items: [
                { title: isRTL ? 'المستخدمين' : 'Users', path: '/admin/users', icon: Users },
                { title: isRTL ? 'سجلات التدقيق' : 'Audit Logs', path: '/admin/audit', icon: ShieldAlert },
            ]
        },
        {
            title: isRTL ? 'النظام' : 'System',
            items: [
                { title: t.settings[language], path: '/admin/settings', icon: Settings },
            ]
        }
    ];

    return (
        <aside
            className={cn(
                "fixed lg:static inset-y-0 z-50 w-64 bg-card/95 backdrop-blur-xl border-border transition-transform duration-300 ease-in-out border-r",
                isRTL ? "right-0 border-l border-r-0" : "left-0",
                isOpen
                    ? "translate-x-0"
                    : isRTL
                        ? "translate-x-full lg:translate-x-0 lg:w-20"
                        : "-translate-x-full lg:translate-x-0 lg:w-20"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border/50">
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse w-full justify-start")}>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-sm flex-shrink-0">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <span className={cn(
                            "text-lg font-bold text-foreground glow-text transition-opacity duration-300",
                            !isOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                        )}>
                            {isRTL ? 'نبض أدمن' : 'Nabdh Admin'}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-hide">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className={cn(
                                "px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
                                !isOpen && "lg:opacity-0 lg:hidden",
                                isRTL && "text-right"
                            )}>
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/admin'}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                                                isRTL && "flex-row-reverse",
                                                isActive
                                                    ? "bg-primary/10 text-primary glow-sm font-medium"
                                                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                            )
                                        }
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 flex-shrink-0 transition-colors",
                                            !isOpen && "mx-auto"
                                        )} />

                                        <span className={cn(
                                            "transition-all duration-300 whitespace-nowrap",
                                            !isOpen && "lg:opacity-0 lg:w-0 lg:hidden"
                                        )}>
                                            {item.title}
                                        </span>

                                        {!isOpen && (
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap",
                                                isRTL ? "right-full mr-2" : "left-full ml-2"
                                            )}>
                                                {item.title}
                                            </div>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-border/50">
                    <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex-shrink-0" />
                        <div className={cn("overflow-hidden transition-all duration-300", !isOpen && "lg:hidden")}>
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@nabdh.app</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
