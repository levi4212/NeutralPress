import {
    RiEye2Line,
    RiFolder2Line,
    RiPriceTagLine,
    RiPushpin2Fill,
    RiTimeLine,
} from "@remixicon/react";

import CMSImage from "@/components/ui/CMSImage";
import Link from "@/components/ui/Link";

interface ClassicPostCardProps {
    title: string | React.ReactNode;
    slug?: string;
    date?: string;
    category?: { name: string; slug: string }[];
    tags?: { name: string; slug: string }[];
    cover?:
    | Array<{
        url: string;
        width?: number;
        height?: number;
        blur?: string;
    }>
    | string;
    summary?: string | React.ReactNode;
    isPinned?: boolean;
    className?: string;
}

export default function ClassicPostCard({
    title,
    slug,
    date,
    category,
    tags,
    cover,
    summary,
    isPinned = false,
    className = "",
}: ClassicPostCardProps) {
    // 格式化日期显示
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    // 处理封面图片数据
    const coverImage = Array.isArray(cover)
        ? cover[0]
        : cover
            ? { url: cover }
            : null;

    return (
        <article
            className={`group w-full bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 relative ${className}`}
        >
            {/* 置顶标识 */}
            {isPinned && (
                <div className="absolute top-0 right-0 z-30 pointer-events-none">
                    <div className="relative">
                        {/* 三角形背景 */}
                        <div className="w-0 h-0 border-t-[4em] border-l-[4em] border-t-primary border-l-transparent" />
                        {/* 置顶文本 */}
                        <div className="absolute top-0 right-0 transform rotate-45 origin-center">
                            <span className="text-primary-foreground text-xs font-bold mt-[6px] mr-[6px] inline-block whitespace-nowrap">
                                <RiPushpin2Fill size={"2em"} />
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col h-full">
                <Link href={"/posts/" + slug} className="block flex-1 relative z-10">
                    {/* 背景图片/Thumbnail */}
                    {coverImage && (
                        <div className="w-full aspect-[21/9] relative overflow-hidden bg-muted/20">
                            <CMSImage
                                src={coverImage.url}
                                alt={typeof title === "string" ? title : "Post cover"}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                optimized={!!(coverImage.width && coverImage.height)}
                                width={coverImage.width}
                                height={coverImage.height}
                                blur={coverImage.blur}
                                priority={false}
                            />
                        </div>
                    )}

                    {/* 内容区域 */}
                    <div className="p-8 md:p-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground/90 group-hover:text-primary transition-colors duration-300 leading-snug">
                            {title}
                        </h2>

                        {summary && (
                            <div className="text-muted-foreground text-lg mb-2 line-clamp-3 leading-relaxed">
                                {summary}
                            </div>
                        )}
                    </div>
                </Link>

                {/* 底部元数据 */}
                <div className="px-8 md:px-10 py-5 bg-muted/40 border-t border-border/40 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-muted-foreground relative z-20">
                    {date && (
                        <div className="flex items-center gap-2">
                            <RiTimeLine size="1.2em" />
                            <span>{formatDate(date)}</span>
                        </div>
                    )}

                    {category && category.length > 0 && (
                        <div className="flex items-center gap-2">
                            <RiFolder2Line size="1.2em" />
                            <div className="flex flex-wrap gap-1">
                                {category.map((cat, index) => (
                                    <span key={cat.slug} className="flex whitespace-nowrap">
                                        <Link
                                            href={`/categories/${cat.slug}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                        {index < category.length - 1 && (
                                            <span className="ml-1">/</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 标签 */}
                    {tags && tags.length > 0 && (
                        <div className="flex items-center gap-2 md:mr-auto">
                            <RiPriceTagLine size="1.2em" />
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.slug}
                                        href={`/tags/${tag.slug}`}
                                        className="hover:text-primary transition-colors whitespace-nowrap"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 访问量 */}
                    <span
                        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap opacity-0 transition-opacity ml-auto md:ml-0"
                        data-viewcount-slug={slug}
                    >
                        <RiEye2Line size="1.2em" />
                        <span>---</span>
                    </span>
                </div>
            </div>
        </article>
    );
}
