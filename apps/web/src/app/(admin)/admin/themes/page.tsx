"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiPaletteLine } from "@remixicon/react";

import { getSettings, updateSettings } from "@/actions/setting";
import { BUILT_IN_THEMES, type ThemePlugin } from "@/data/themes";
import { useMainColor } from "@/components/client/layout/ThemeProvider";
import { Button } from "@/ui/Button";
import { useToast } from "@/ui/Toast";
import { LoadingIndicator } from "@/ui/LoadingIndicator";

export default function ThemesPage() {
    const [loading, setLoading] = useState(false);
    const [activatingId, setActivatingId] = useState<string | null>(null);
    const [currentThemeState, setCurrentThemeState] = useState<string>("");
    const { light, dark } = useMainColor();
    const toast = useToast();

    useEffect(() => {
        // A heuristic to determine active theme by checking current primary colors against our registry
        const matchActiveTheme = () => {
            let matchedId = "neutral-default";
            for (const theme of BUILT_IN_THEMES) {
                if (theme.colorTokens.light.primary === light.primary) {
                    matchedId = theme.id;
                    break;
                }
            }
            setCurrentThemeState(matchedId);
        };

        matchActiveTheme();
    }, [light]);

    const handleActivateTheme = async (theme: ThemePlugin) => {
        setActivatingId(theme.id);
        try {
            const result = await updateSettings({
                settings: [
                    {
                        key: "site.color",
                        value: { default: theme.colorTokens },
                    },
                ],
            });
            if (result.success) {
                toast.success("应用成功", `已成功切换到 ${theme.name} 主题`);
                setCurrentThemeState(theme.id);
                // Force reload to ensure theme completely applies across all contexts if needed
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error("应用失败", result.message || "无法保存主题配置");
            }
        } catch (error) {
            toast.error("发生错误", error instanceof Error ? error.message : "未知错误");
        } finally {
            setActivatingId(null);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full mb-8 pt-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <RiPaletteLine className="w-8 h-8 text-primary" />
                    主题与外观
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl">
                    管理您的站点外观。NeutralPress 提供了多套内置精选主题，轻轻一点，即可为您和您的访客带来全新的色彩体验。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                {BUILT_IN_THEMES.map((theme) => {
                    const isActive = currentThemeState === theme.id;
                    const isActivating = activatingId === theme.id;

                    return (
                        <div
                            key={theme.id}
                            className={`group flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 ${isActive
                                ? "border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]"
                                : "border-border hover:border-primary/50 hover:shadow-lg bg-background"
                                }`}
                        >
                            {/* Theme Preview Card Top */}
                            <div
                                className="h-48 w-full p-6 relative flex flex-col justify-between items-start transition-colors"
                                style={{
                                    backgroundColor: theme.colorTokens.light.background,
                                    color: theme.colorTokens.light.foreground,
                                    borderBottomColor: theme.colorTokens.light.border,
                                    borderBottomWidth: "1px",
                                }}
                            >
                                {isActive && (
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-10 animate-fade-in">
                                        <RiCheckLine className="w-3 h-3" /> 使用中
                                    </div>
                                )}

                                <div className="w-full flex justify-between items-start z-10">
                                    <div
                                        className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: theme.colorTokens.light.primary, color: theme.colorTokens.light.primaryForeground }}
                                    >
                                        <RiPaletteLine className="w-6 h-6" />
                                    </div>

                                    {/* Mini "dark mode" preview floating bubble */}
                                    <div
                                        className="w-10 h-10 rounded-full shadow-sm shadow-black/20 flex flex-col"
                                        style={{ backgroundColor: theme.colorTokens.dark.background, border: `1px solid ${theme.colorTokens.dark.border}` }}
                                    >
                                        <div className="w-full h-1/2 flex items-center justify-center rounded-t-full">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colorTokens.dark.primary }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 z-10 w-full mt-auto">
                                    <div
                                        className="w-3/4 h-3 rounded"
                                        style={{ backgroundColor: theme.colorTokens.light.muted }}
                                    />
                                    <div className="flex gap-2">
                                        <div
                                            className="w-1/3 h-4 rounded-md"
                                            style={{ backgroundColor: theme.colorTokens.light.primary }}
                                        />
                                        <div
                                            className="w-1/4 h-4 rounded-md"
                                            style={{ backgroundColor: theme.colorTokens.light.secondary }}
                                        />
                                    </div>
                                </div>

                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] pattern-diagonal-lines pattern-bg-transparent pattern-size-4" style={{ color: theme.colorTokens.light.foreground }} />
                            </div>

                            {/* Theme Information Bottom */}
                            <div className="p-5 flex flex-col flex-1 bg-card">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-foreground leading-tight">
                                        {theme.name}
                                    </h3>
                                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md font-mono">
                                        v{theme.version}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6 flex-1">
                                    {theme.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                                    <span className="text-xs text-muted-foreground flex flex-col">
                                        <span className="uppercase text-[10px] tracking-wider opacity-60">作者</span>
                                        <span className="font-medium text-foreground">{theme.author}</span>
                                    </span>

                                    <Button
                                        variant={isActive ? "outline" : "primary"}
                                        size="sm"
                                        className="rounded-full px-5 transition-transform active:scale-95"
                                        disabled={isActive || isActivating}
                                        loading={isActivating}
                                        onClick={() => handleActivateTheme(theme)}
                                    >
                                        {isActive ? "已应用" : "立即应用"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
