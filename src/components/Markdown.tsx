const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-ink dark:text-gray-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-sage-deep dark:text-sage-400">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export const RenderMarkdown = ({ content }: { content: string }) => {
  const paragraphs = content.split('\n\n');
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="font-serif text-[1.125rem] text-ink dark:text-white mt-6 mb-2 leading-tight">
              {parseInline(trimmed.replace('### ', ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={i} className="font-medium text-ink dark:text-white mt-4 mb-2">
              {parseInline(trimmed.replace('#### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <div key={i} className="border-l-2 border-sage dark:border-sage-400 pl-4 py-1 my-4 italic text-ink-soft dark:text-gray-400 text-[0.8125rem]">
              {parseInline(trimmed.replace(/^> /gm, ''))}
            </div>
          );
        }
        if (trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(l => l.trim().startsWith('* '));
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 my-3 marker:text-ink-soft dark:marker:text-gray-500">
              {items.map((item, j) => (
                <li key={j} className="text-ink dark:text-gray-200">
                  {parseInline(item.replace(/^\*\s*/, ''))}
                </li>
              ))}
            </ul>
          );
        }
        if (trimmed.includes('\n1. ') || trimmed.startsWith('1. ')) {
          const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1.5 my-3 marker:text-sage-deep dark:marker:text-sage-400 font-medium">
              {items.map((item, j) => (
                <li key={j} className="text-ink dark:text-gray-200 font-normal">
                  {parseInline(item.replace(/^\d+\.\s*/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-ink dark:text-gray-200 leading-relaxed text-[0.875rem]">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
