import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Command } from 'cmdk';
import {
  AppWindow,
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Layers,
  Mail,
  Network,
  Search,
  User,
} from 'lucide-react';
import { CONTACTS, PROJECTS, SITE_META } from '@/data/portfolio-content';
import { scrollToTarget } from '@/lib/motion/engine';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewMode?: 'workbench' | 'graph' | 'list';
  onChangeViewMode?: (mode: 'workbench' | 'graph' | 'list') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  viewMode,
  onChangeViewMode,
}) => {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const runCommand = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(SITE_META.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      window.location.href = `mailto:${SITE_META.email}`;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Workspace command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
      className="fixed inset-0 z-[900] bg-[#040507]/75 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
    >
      <div className="w-full max-w-[560px] rounded-[8px] workbench-window-active overflow-hidden animate-popover-in">
        <Command
          label="Global Workbench Command Menu"
          className="flex flex-col bg-[#111317] text-[#F2F0EB]"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(242,240,235,0.09)]">
            <Search
              className="w-4 h-4 text-[#9A9DA6] shrink-0"
              aria-hidden="true"
            />
            <Command.Input
              autoFocus
              placeholder="Jump to a project, workspace mode, or contact..."
              className="w-full bg-transparent text-sm text-[#F2F0EB] placeholder:text-[#9A9DA6]/70 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="shrink-0 rounded-[4px] border border-[rgba(242,240,235,0.12)] bg-[#171A20] px-2 py-1 font-mono text-[10px] text-[#9A9DA6] hover:text-[#F2F0EB] cursor-pointer"
            >
              ESC
            </button>
          </div>

          <Command.List className="max-h-[360px] overflow-y-auto p-2 space-y-2 scrollbar-hide">
            <Command.Empty className="py-10 text-center font-mono text-xs text-[#9A9DA6]">
              No matching systems or commands found.
            </Command.Empty>

            {/* Engineering Projects */}
            <Command.Group
              heading="Engineering Systems"
              className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9A9DA6]"
            >
              {PROJECTS.map((project, idx) => (
                <Command.Item
                  key={project.slug}
                  value={`${project.name} ${project.brief} ${project.technologies.join(' ')}`}
                  onSelect={() =>
                    runCommand(() =>
                      navigate({
                        to: '/project/$slug',
                        params: { slug: project.slug },
                      })
                    )
                  }
                  className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-[#1D212A] aria-selected:text-[#F2F0EB] text-[#F2F0EB]/85 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[11px] text-[#5E8BFF] tabular-nums shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="font-medium block truncate">
                        {project.name}
                      </span>
                      <span className="text-xs text-[#9A9DA6] block truncate">
                        {project.role} · {project.technologies.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-[#9A9DA6] shrink-0"
                    aria-hidden="true"
                  />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Workspace Mode Switching */}
            {onChangeViewMode && (
              <Command.Group
                heading="Workspace Views"
                className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9A9DA6]"
              >
                <Command.Item
                  value="Switch to Spatial Workbench"
                  onSelect={() =>
                    runCommand(() => {
                      onChangeViewMode('workbench');
                      scrollToTarget('#work-graph', { duration: 0.7 });
                    })
                  }
                  className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
                >
                  <div className="flex items-center gap-3">
                    <AppWindow className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                    <span>Spatial Workbench</span>
                  </div>
                  {viewMode === 'workbench' && (
                    <span className="font-mono text-[10px] text-[#5E8BFF]">ACTIVE</span>
                  )}
                </Command.Item>

                <Command.Item
                  value="Switch to Kernel Node Graph"
                  onSelect={() =>
                    runCommand(() => {
                      onChangeViewMode('graph');
                      scrollToTarget('#work-graph', { duration: 0.7 });
                    })
                  }
                  className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
                >
                  <div className="flex items-center gap-3">
                    <Network className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                    <span>Kernel Node Graph</span>
                  </div>
                  {viewMode === 'graph' && (
                    <span className="font-mono text-[10px] text-[#5E8BFF]">ACTIVE</span>
                  )}
                </Command.Item>

                <Command.Item
                  value="Switch to Structured Index"
                  onSelect={() =>
                    runCommand(() => {
                      onChangeViewMode('list');
                      scrollToTarget('#work-graph', { duration: 0.7 });
                    })
                  }
                  className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                    <span>Structured List Index</span>
                  </div>
                  {viewMode === 'list' && (
                    <span className="font-mono text-[10px] text-[#5E8BFF]">ACTIVE</span>
                  )}
                </Command.Item>
              </Command.Group>
            )}

            {/* Navigation & Direct Utilities */}
            <Command.Group
              heading="Sections & Actions"
              className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9A9DA6]"
            >
              <Command.Item
                value="About Samin Yeasar Experience Profile"
                onSelect={() =>
                  runCommand(() => scrollToTarget('#about', { duration: 0.9 }))
                }
                className="flex items-center gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
              >
                <User className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                <span>Engineering Profile &amp; Experience</span>
              </Command.Item>

              <Command.Item
                value="Copy Email Address Contact"
                onSelect={handleCopyEmail}
                className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
              >
                <div className="flex items-center gap-3">
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-[#5E8BFF]" aria-hidden="true" />
                  ) : (
                    <Mail className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                  )}
                  <span>
                    {copiedEmail ? 'Copied email to clipboard' : `Copy Email (${SITE_META.email})`}
                  </span>
                </div>
                <Copy className="w-3.5 h-3.5 text-[#9A9DA6]" aria-hidden="true" />
              </Command.Item>

              <Command.Item
                value="Download Resume Curriculum Vitae PDF"
                onSelect={() =>
                  runCommand(() =>
                    window.open(SITE_META.resumeUrl, '_blank', 'noopener,noreferrer')
                  )
                }
                className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
                  <span>Curriculum Vitae (PDF)</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9A9DA6]" aria-hidden="true" />
              </Command.Item>

              {CONTACTS.slice(0, 3).map((c) => (
                <Command.Item
                  key={c.platform}
                  value={`${c.platform} ${c.handle}`}
                  onSelect={() =>
                    runCommand(() => window.open(c.url, '_blank', 'noopener,noreferrer'))
                  }
                  className="flex items-center justify-between gap-3 rounded-[5px] px-3 py-2 text-sm cursor-pointer aria-selected:bg-[#1D212A] text-[#F2F0EB]/85"
                >
                  <span>
                    {c.platform} ({c.handle})
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#9A9DA6]" aria-hidden="true" />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Hints */}
          <div className="px-4 py-2.5 border-t border-[rgba(242,240,235,0.08)] bg-[#0C0D10] flex items-center justify-between font-mono text-[10px] text-[#9A9DA6]">
            <span>Up/Down to select · Enter to open</span>
            <span>SOLEZ WORKBENCH</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
