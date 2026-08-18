import React from 'react';

type Variant = 'featured' | 'card' | 'archive';

interface EditorialCoverProps {
  category: string;
  variant: Variant;
  editorialNumber?: string;
  title?: string;
}

const PATTERNS = {
  nationalSecurity: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  history: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%2317283F' fill-opacity='0.05'/%3E%3C/svg%3E")`,
  internationalRelations: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l20 20M20 0L0 20' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E")`,
  governance: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2317283F' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  default: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L0 20' stroke='%2317283F' stroke-width='0.5' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E")`,
};

function getTheme(category: string) {
  const normalized = category.toLowerCase();
  
  if (normalized.includes('security')) {
    return {
      bg: 'bg-navy',
      textPrimary: 'text-[#F4F1EA]',
      textSecondary: 'text-gold',
      pattern: PATTERNS.nationalSecurity,
      border: 'border-[#F4F1EA]/10',
    };
  }
  
  if (normalized.includes('history')) {
    return {
      bg: 'bg-[#F4F1EA]',
      textPrimary: 'text-navy',
      textSecondary: 'text-navy/60',
      pattern: PATTERNS.history,
      border: 'border-navy/10',
    };
  }
  
  if (normalized.includes('international') || normalized.includes('diplomacy')) {
    return {
      bg: 'bg-navy',
      textPrimary: 'text-[#F4F1EA]',
      textSecondary: 'text-gold',
      pattern: PATTERNS.internationalRelations,
      border: 'border-[#F4F1EA]/10',
    };
  }
  
  if (normalized.includes('governance') || normalized.includes('politics')) {
    return {
      bg: 'bg-[#F4F1EA]',
      textPrimary: 'text-navy',
      textSecondary: 'text-navy/60',
      pattern: PATTERNS.governance,
      border: 'border-navy/10',
    };
  }
  
  // Default (Contemporary Issues, etc.)
  return {
    bg: 'bg-[#F4F1EA]',
    textPrimary: 'text-navy',
    textSecondary: 'text-navy/60',
    pattern: PATTERNS.default,
    border: 'border-navy/10',
  };
}

export function EditorialCover({ category, variant, editorialNumber, title }: EditorialCoverProps) {
  const theme = getTheme(category);
  
  const containerClasses = {
    featured: "aspect-[16/10] p-8 md:p-14",
    card: "aspect-[4/3] p-6",
    archive: "aspect-[4/3] md:aspect-square lg:aspect-[4/3] p-6",
  };
  
  const titleClasses = {
    featured: "text-2xl md:text-3xl tracking-[0.2em]",
    card: "text-lg tracking-[0.15em]",
    archive: "text-lg md:text-xl tracking-[0.15em]",
  };
  
  const postTitleClasses = {
    featured: "text-3xl md:text-5xl font-serif leading-[1.15]",
    card: "text-xl md:text-2xl font-serif leading-snug",
    archive: "text-xl md:text-2xl font-serif leading-snug",
  };

  return (
    <div 
      className={`w-full flex flex-col items-center justify-between text-center transition-transform duration-700 ${theme.bg} ${theme.border} border ${containerClasses[variant]}`}
      style={{ backgroundImage: theme.pattern }}
    >
      <div className={`w-full uppercase font-medium ${theme.textPrimary} ${titleClasses[variant]}`}>
        {category}
      </div>
      
      {title && (
        <div className={`my-auto w-full px-4 md:px-8 ${theme.textPrimary} ${postTitleClasses[variant]}`}>
          {title}
        </div>
      )}
      
      <div className="w-full flex justify-between items-end">
        <div className={`text-left ${theme.textPrimary}`}>
          <div className="font-serif italic text-sm md:text-base opacity-80">Foluso Ajibulu</div>
          <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1 font-semibold opacity-60">Commentary</div>
        </div>
        
        {editorialNumber ? (
          <div className={`font-serif italic text-2xl md:text-3xl ${theme.textSecondary}`}>
            {editorialNumber}
          </div>
        ) : null}
      </div>
    </div>
  );
}
