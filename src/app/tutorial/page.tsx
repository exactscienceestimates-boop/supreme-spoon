"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

interface TipProps {
  type?: "tip" | "warning" | "info";
  children: React.ReactNode;
}

interface ShortcutRowProps {
  action: string;
  mac: string;
  win: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-navy-800/30 shadow-md">
      <div className="flex items-center justify-between bg-navy-950 px-4 py-2">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#0d1117] text-gray-200 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-500 text-navy-950 font-bold text-sm flex items-center justify-center shadow">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-semibold text-navy-900 mb-2 text-[15px]">{title}</h4>
        <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Tip({ type = "tip", children }: TipProps) {
  const styles = {
    tip:     { bg: "bg-emerald-50 border-emerald-400",  icon: "💡", label: "Pro Tip",  text: "text-emerald-800" },
    warning: { bg: "bg-amber-50 border-amber-400",      icon: "⚠️", label: "Watch Out", text: "text-amber-800" },
    info:    { bg: "bg-blue-50 border-blue-400",        icon: "ℹ️", label: "Note",     text: "text-blue-800" },
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} border-l-4 rounded-r-lg p-4 my-4`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1 ${s.text}`}>
        <span>{s.icon}</span> {s.label}
      </div>
      <div className={`text-sm ${s.text} leading-relaxed`}>{children}</div>
    </div>
  );
}

function ShortcutRow({ action, mac, win }: ShortcutRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-2.5 px-3 text-sm text-gray-700">{action}</td>
      <td className="py-2.5 px-3">
        <kbd className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs font-mono text-gray-700">{mac}</kbd>
      </td>
      <td className="py-2.5 px-3">
        <kbd className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs font-mono text-gray-700">{win}</kbd>
      </td>
    </tr>
  );
}

function SectionHeader({ id, icon, title, subtitle }: { id: string; icon: string; title: string; subtitle: string }) {
  return (
    <div id={id} className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-bold text-navy-950">{title}</h2>
      </div>
      <p className="text-gray-500 ml-12 text-[15px]">{subtitle}</p>
      <div className="mt-4 h-px bg-gradient-to-r from-amber-400 via-amber-200 to-transparent" />
    </div>
  );
}

function ExtensionCard({ name, id, desc, why }: { name: string; id: string; desc: string; why: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-amber-300 transition-all">
      <div className="flex items-start justify-between mb-1">
        <span className="font-semibold text-navy-900 text-[15px]">{name}</span>
      </div>
      <code className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">{id}</code>
      <p className="text-gray-500 text-sm mt-2">{desc}</p>
      <p className="text-gray-700 text-sm mt-1"><span className="font-medium text-navy-800">Why:</span> {why}</p>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <li
      className={`flex items-start gap-3 py-2 cursor-pointer select-none group ${checked ? "opacity-60" : ""}`}
      onClick={() => setChecked(!checked)}
    >
      <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 transition-all ${checked ? "bg-amber-500 border-amber-500" : "border-gray-300 group-hover:border-amber-400"} flex items-center justify-center`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className={`text-sm text-gray-700 ${checked ? "line-through text-gray-400" : ""}`}>{text}</span>
    </li>
  );
}

// ─── Sections data ────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  { id: "vscode",  title: "VS Code Setup",      icon: "🖥️",  color: "blue" },
  { id: "repos",   title: "Managing Repos",     icon: "📁",  color: "green" },
  { id: "skills",  title: "Skills & Extensions",icon: "🧠",  color: "purple" },
  { id: "maps",    title: "Maps & Navigation",  icon: "🗺️",  color: "orange" },
  { id: "workflow",title: "Power Workflow",     icon: "⚡",  color: "amber" },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TutorialPage() {
  const [activeSection, setActiveSection] = useState("vscode");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleSectionClick = useCallback((id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-navy-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-400 text-sm font-medium">Developer Toolkit Tutorial</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Master Your <span className="text-amber-400">VS Code</span> Workspace
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            A complete guide to managing VS Code, downloaded repositories, developer skills, and code navigation maps — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSectionClick(s.id)}
                className="flex items-center gap-2 bg-white/10 hover:bg-amber-500 hover:text-navy-950 border border-white/20 hover:border-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
              >
                <span>{s.icon}</span> {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8 relative">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-amber-500 text-navy-950 rounded-full w-12 h-12 flex items-center justify-center shadow-xl font-bold text-lg"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-20 left-0 lg:left-auto h-screen lg:h-auto w-72 lg:w-56 xl:w-64
            bg-white lg:bg-transparent z-40 shadow-2xl lg:shadow-none
            transform transition-transform lg:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            p-6 lg:p-0 overflow-y-auto lg:overflow-visible
            lg:flex-shrink-0 lg:self-start
          `}
        >
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Contents</p>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSectionClick(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeSection === s.id
                      ? "bg-amber-500 text-navy-950 shadow"
                      : "text-gray-600 hover:bg-gray-100 hover:text-navy-900"
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-navy-950 text-white rounded-xl">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Quick Reference</p>
              <ul className="text-xs text-gray-300 space-y-1.5">
                <li>⌘ = Cmd (Mac) / Ctrl (Win)</li>
                <li>⇧ = Shift</li>
                <li>⌥ = Alt / Option</li>
                <li>⌃ = Ctrl</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-20">

          {/* ── MODULE 1: VS CODE ─────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="vscode"
              icon="🖥️"
              title="VS Code Setup & Configuration"
              subtitle="Install, configure, and personalize your editor for maximum productivity."
            />

            {/* Installation */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">1.1 — Installation & First Launch</h3>
              <Step number={1} title="Download VS Code">
                <p>Go to <strong>code.visualstudio.com</strong> and download the installer for your OS. Choose the <em>System Installer</em> on Windows (adds it to PATH automatically).</p>
              </Step>
              <Step number={2} title="Add to PATH (Mac)">
                <p>Open VS Code → press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → type <strong>Shell Command: Install code command in PATH</strong> → press Enter. Now you can open any folder from Terminal:</p>
                <CodeBlock code={`code .          # open current folder
code myproject/ # open specific folder
code file.js    # open single file`} language="bash" />
              </Step>
              <Step number={3} title="Sign in & Sync Settings">
                <p>Click the person icon in the bottom-left → <strong>Turn on Settings Sync</strong>. Sign in with GitHub or Microsoft. Your extensions, keybindings, and settings will sync across all machines.</p>
              </Step>
            </div>

            {/* Settings */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">1.2 — Essential Settings (settings.json)</h3>
              <p className="text-gray-600 text-sm mb-4">Open with <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → <em>Preferences: Open User Settings (JSON)</em></p>
              <CodeBlock code={`{
  // Editor look & feel
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,

  // Auto-save & formatting
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // Workbench
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",

  // Terminal
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.defaultProfile.osx": "zsh",

  // Git
  "git.autofetch": true,
  "git.confirmSync": false,

  // Explorer
  "explorer.confirmDelete": false,
  "explorer.compactFolders": false
}`} language="json" />
              <Tip type="tip">Download the <strong>JetBrains Mono</strong> font for free at jetbrains.com/mono. It has ligatures that turn <code>{`=>`}</code> and <code>{`!==`}</code> into elegant glyphs.</Tip>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">1.3 — Keyboard Shortcuts Cheat Sheet</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left bg-white">
                  <thead>
                    <tr className="bg-navy-950 text-white text-xs uppercase tracking-wide">
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Mac</th>
                      <th className="py-3 px-3">Windows / Linux</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ShortcutRow action="Command Palette"      mac="⌘ ⇧ P" win="Ctrl+Shift+P" />
                    <ShortcutRow action="Quick File Open"      mac="⌘ P"   win="Ctrl+P" />
                    <ShortcutRow action="Toggle Terminal"      mac="⌃ `"   win="Ctrl+`" />
                    <ShortcutRow action="Multi-cursor"         mac="⌥ Click" win="Alt+Click" />
                    <ShortcutRow action="Select all occurrences" mac="⌘ ⇧ L" win="Ctrl+Shift+L" />
                    <ShortcutRow action="Move line up/down"   mac="⌥ ↑/↓"  win="Alt+↑/↓" />
                    <ShortcutRow action="Duplicate line"       mac="⇧ ⌥ ↓" win="Shift+Alt+↓" />
                    <ShortcutRow action="Find in files"        mac="⌘ ⇧ F" win="Ctrl+Shift+F" />
                    <ShortcutRow action="Go to Definition"     mac="F12"   win="F12" />
                    <ShortcutRow action="Peek Definition"      mac="⌥ F12" win="Alt+F12" />
                    <ShortcutRow action="Rename symbol"        mac="F2"    win="F2" />
                    <ShortcutRow action="Format document"      mac="⇧ ⌥ F" win="Shift+Alt+F" />
                    <ShortcutRow action="Comment line"         mac="⌘ /"   win="Ctrl+/" />
                    <ShortcutRow action="Split editor"         mac="⌘ \\"   win="Ctrl+\\" />
                    <ShortcutRow action="Close tab"            mac="⌘ W"   win="Ctrl+W" />
                    <ShortcutRow action="Zen Mode"             mac="⌘ K Z" win="Ctrl+K Z" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workspace */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">1.4 — Workspaces vs. Folders</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-2">📂 Folder (Simple)</h4>
                  <p className="text-blue-800 text-sm">Open a single directory. Great for one-repo projects. File → Open Folder or <code className="bg-blue-100 px-1 rounded text-xs">code .</code></p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                  <h4 className="font-bold text-purple-900 mb-2">🗂️ Workspace (Multi-root)</h4>
                  <p className="text-purple-800 text-sm">Group multiple repos/folders into one window. File → Add Folder to Workspace → Save Workspace As <code className="bg-purple-100 px-1 rounded text-xs">.code-workspace</code></p>
                </div>
              </div>
              <CodeBlock code={`// my-projects.code-workspace
{
  "folders": [
    { "path": "~/projects/frontend", "name": "🎨 Frontend" },
    { "path": "~/projects/backend",  "name": "⚙️ Backend" },
    { "path": "~/projects/docs",     "name": "📚 Docs" }
  ],
  "settings": {
    "editor.fontSize": 14
  }
}`} language="json" />
              <Tip type="info">Save your <code>.code-workspace</code> file in a shared drive or repo so your whole team opens the same multi-root setup.</Tip>
            </div>

            {/* Setup checklist */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-4">VS Code Setup Checklist</h3>
              <ul className="space-y-0.5">
                {[
                  "Downloaded and installed VS Code",
                  "Added 'code' command to PATH",
                  "Enabled Settings Sync",
                  "Set formatOnSave: true in settings.json",
                  "Installed a ligature font (JetBrains Mono / Fira Code)",
                  "Picked a color theme",
                  "Learned Command Palette (⌘⇧P / Ctrl+Shift+P)",
                ].map((item) => <ChecklistItem key={item} text={item} />)}
              </ul>
            </div>
          </section>

          {/* ── MODULE 2: REPOS ──────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="repos"
              icon="📁"
              title="Managing Downloaded Repos"
              subtitle="Clone, organize, navigate, and keep your repositories clean and up to date."
            />

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">2.1 — Folder Structure Strategy</h3>
              <p className="text-gray-600 text-sm mb-3">A consistent folder layout prevents the &ldquo;where did I clone that?&rdquo; problem. Here&rsquo;s a battle-tested structure:</p>
              <CodeBlock code={`~/
├── projects/
│   ├── work/          # employer or client repos
│   │   ├── company-api/
│   │   └── company-frontend/
│   ├── personal/      # your own side projects
│   │   ├── portfolio/
│   │   └── scripts/
│   ├── oss/           # open-source contributions
│   │   └── some-library/
│   └── learn/         # tutorials, courses, experiments
│       └── vscode-demo/
└── sandbox/           # throwaway experiments`} language="bash" />
              <Tip type="tip">Create this structure once: <code>mkdir -p ~/projects/{"{"}work,personal,oss,learn{"}"}</code></Tip>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">2.2 — Cloning Repos</h3>
              <Step number={1} title="Via terminal (fastest)">
                <CodeBlock code={`# Navigate to the right category first
cd ~/projects/work

# Clone with HTTPS (no SSH key needed)
git clone https://github.com/org/repo.git

# Clone with SSH (recommended if you have a key set up)
git clone git@github.com:org/repo.git

# Clone and rename the folder
git clone git@github.com:org/repo.git my-local-name

# Clone a specific branch
git clone -b feature/my-branch git@github.com:org/repo.git`} language="bash" />
              </Step>
              <Step number={2} title="Via VS Code UI">
                <p>Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → <strong>Git: Clone</strong> → paste URL → pick your destination folder.</p>
              </Step>
              <Step number={3} title="Via GitHub Extension">
                <p>Install the <strong>GitHub Repositories</strong> extension → click the Remote Explorer icon in the sidebar → open any repo directly without cloning to disk.</p>
              </Step>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">2.3 — Everyday Git Commands in VS Code</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-navy-800 mb-3 text-[15px]">Terminal Workflow</h4>
                  <CodeBlock code={`# Check what's changed
git status

# See line-level diff
git diff

# Stage all changes
git add .

# Stage specific file
git add src/app/page.tsx

# Commit
git commit -m "feat: add tutorial page"

# Push to origin
git push origin main

# Pull latest
git pull origin main

# Create & switch branch
git checkout -b feat/my-feature

# Switch existing branch
git checkout main

# View branch list
git branch -a

# Merge branch into current
git merge feat/my-feature

# Stash changes temporarily
git stash
git stash pop`} language="bash" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-800 mb-3 text-[15px]">Source Control Panel</h4>
                  <div className="bg-navy-950 rounded-xl p-5 text-sm text-gray-300 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">①</span>
                      <div><strong className="text-white">Click the Source Control icon</strong> (Ctrl+Shift+G) to open the panel. Changed files appear here.</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">②</span>
                      <div><strong className="text-white">Stage files</strong> by clicking the <code className="text-amber-400">+</code> next to each file, or stage all with the <code className="text-amber-400">+</code> in the header.</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">③</span>
                      <div><strong className="text-white">Type a message</strong> in the box and press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">⌘ Enter</kbd> to commit.</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">④</span>
                      <div><strong className="text-white">Click the ⋯ menu</strong> for Push, Pull, Create Branch, and other git actions.</div>
                    </div>
                  </div>
                  <Tip type="info">The Status Bar at the bottom shows your current branch and sync status. Click it to switch branches instantly.</Tip>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">2.4 — Keeping Repos Clean</h3>
              <CodeBlock code={`# See all remote branches
git fetch --prune

# Delete a local branch (after merging)
git branch -d feat/old-feature

# Delete remote branch
git push origin --delete feat/old-feature

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Show commit log (pretty)
git log --oneline --graph --decorate

# See who changed what line (blame)
git blame src/app/page.tsx

# Find which commit introduced a bug
git bisect start
git bisect bad            # current is broken
git bisect good v1.0.0    # last known good`} language="bash" />
              <Tip type="warning">Never force-push to <code>main</code> or <code>master</code> on a shared repo — it rewrites history for your whole team.</Tip>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-4">Repo Management Checklist</h3>
              <ul className="space-y-0.5">
                {[
                  "Created ~/projects/ with work/personal/oss/learn subfolders",
                  "Set up SSH key for GitHub (ssh-keygen -t ed25519)",
                  "Enabled git autofetch in VS Code settings",
                  "Learned how to stage & commit from Source Control panel",
                  "Can create and switch branches from the Status Bar",
                  "Added .gitignore for node_modules, .env, dist",
                ].map((item) => <ChecklistItem key={item} text={item} />)}
              </ul>
            </div>
          </section>

          {/* ── MODULE 3: SKILLS ─────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="skills"
              icon="🧠"
              title="Skills & Extensions"
              subtitle="The right extensions turn VS Code into a full IDE. Here are the ones that matter."
            />

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">3.1 — Installing Extensions</h3>
              <p className="text-gray-600 text-sm mb-3">Three ways to install:</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-navy-800 mb-1">Extensions Panel</div>
                  <p className="text-gray-600">Click the puzzle icon or press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⌘ ⇧ X</kbd></p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-navy-800 mb-1">Command Palette</div>
                  <p className="text-gray-600"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → <em>Install Extensions</em></p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-navy-800 mb-1">Terminal (fastest)</div>
                  <CodeBlock code={`code --install-extension \
  esbenp.prettier-vscode`} language="bash" />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">3.2 — Essential Extensions by Category</h3>

              <h4 className="font-semibold text-gray-700 uppercase text-xs tracking-widest mb-3 mt-6">Code Quality</h4>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <ExtensionCard name="Prettier" id="esbenp.prettier-vscode" desc="Auto-formats JS, TS, JSON, HTML, CSS on save." why="Consistent code style across your whole team, zero debates." />
                <ExtensionCard name="ESLint" id="dbaeumer.vscode-eslint" desc="Highlights JavaScript/TypeScript linting errors inline." why="Catches bugs before you run the code." />
                <ExtensionCard name="Error Lens" id="usernamehw.errorlens" desc="Shows errors and warnings inline at the end of each line." why="No more missing a squiggle — errors are impossible to ignore." />
                <ExtensionCard name="SonarLint" id="SonarSource.sonarlint-vscode" desc="Deep code analysis for security and quality issues." why="Catches SQL injection, XSS, and other security bugs automatically." />
              </div>

              <h4 className="font-semibold text-gray-700 uppercase text-xs tracking-widest mb-3">Git & Collaboration</h4>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <ExtensionCard name="GitLens" id="eamodio.gitlens" desc="Supercharges git: inline blame, commit history, file diff timeline." why="See WHO changed a line and WHY without leaving the editor." />
                <ExtensionCard name="Git Graph" id="mhutchie.git-graph" desc="Visual branch graph like SourceTree, inside VS Code." why="Understand complex merge/rebase histories at a glance." />
                <ExtensionCard name="GitHub Pull Requests" id="GitHub.vscode-pull-request-github" desc="Review and manage PRs from inside VS Code." why="Comment, approve, and merge PRs without switching to the browser." />
              </div>

              <h4 className="font-semibold text-gray-700 uppercase text-xs tracking-widest mb-3">AI & Productivity</h4>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <ExtensionCard name="GitHub Copilot" id="GitHub.copilot" desc="AI code completion and chat for every language." why="Writes boilerplate, generates tests, explains complex code." />
                <ExtensionCard name="Tabnine" id="TabNine.tabnine-vscode" desc="Local-first AI completion — no data leaves your machine." why="Privacy-focused teams that can't use cloud AI." />
              </div>

              <h4 className="font-semibold text-gray-700 uppercase text-xs tracking-widest mb-3">Language-Specific</h4>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <ExtensionCard name="Tailwind CSS IntelliSense" id="bradlc.vscode-tailwindcss" desc="Autocomplete and preview for Tailwind class names." why="Stop memorizing class names — just type and pick." />
                <ExtensionCard name="Prisma" id="Prisma.prisma" desc="Syntax highlighting and formatting for Prisma schema files." why="Makes database schema editing much cleaner." />
                <ExtensionCard name="REST Client" id="humao.rest-client" desc="Send HTTP requests directly from .http files in VS Code." why="Test APIs without leaving the editor — no Postman needed." />
                <ExtensionCard name="Thunder Client" id="rangav.vscode-thunder-client" desc="Lightweight Postman alternative built into VS Code." why="Full REST client with collections and environments." />
              </div>

              <h4 className="font-semibold text-gray-700 uppercase text-xs tracking-widest mb-3">Themes & Look</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExtensionCard name="One Dark Pro" id="zhuangtongfa.material-theme" desc="The most popular dark theme for VS Code." why="Easy on the eyes for long coding sessions." />
                <ExtensionCard name="Material Icon Theme" id="PKief.material-icon-theme" desc="Colorful file icons that match file types." why="Navigate the Explorer panel 2x faster with visual cues." />
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">3.3 — Code Snippets</h3>
              <p className="text-gray-600 text-sm mb-3">Create your own snippets: <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → <em>Snippets: Configure User Snippets</em> → pick language</p>
              <CodeBlock code={`// typescript.json — your TypeScript snippets
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "export default function \${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ],
    "description": "React functional component"
  },
  "Console log": {
    "prefix": "cl",
    "body": "console.log('\${1:label}:', \${2:value});",
    "description": "console.log with label"
  },
  "Try/catch": {
    "prefix": "tc",
    "body": [
      "try {",
      "  \${1:// code}",
      "} catch (error) {",
      "  console.error(error);",
      "}"
    ]
  }
}`} language="json" />
              <Tip type="tip">Type the prefix (e.g. <code>rfc</code>) and press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">Tab</kbd> to expand the snippet. Use <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">Tab</kbd> again to jump between placeholder positions.</Tip>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">3.4 — Sync Extensions Across Machines</h3>
              <p className="text-gray-600 text-sm mb-3">Generate an extension list to share with your team or back up:</p>
              <CodeBlock code={`# List all installed extensions
code --list-extensions

# List with version numbers
code --list-extensions --show-versions

# Save to a file
code --list-extensions > extensions.txt

# Install from a file (great for new machine setup)
cat extensions.txt | xargs -L 1 code --install-extension`} language="bash" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-4">Skills & Extensions Checklist</h3>
              <ul className="space-y-0.5">
                {[
                  "Installed Prettier and set as default formatter",
                  "Installed ESLint and Error Lens",
                  "Installed GitLens for inline blame",
                  "Created at least 3 custom code snippets",
                  "Picked a theme and icon pack",
                  "Exported extension list with code --list-extensions",
                ].map((item) => <ChecklistItem key={item} text={item} />)}
              </ul>
            </div>
          </section>

          {/* ── MODULE 4: MAPS ───────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="maps"
              icon="🗺️"
              title="Maps & Navigation"
              subtitle="Navigate large codebases instantly — find anything, understand everything."
            />

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">4.1 — Built-in Navigation Tools</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Breadcrumbs</h4>
                  <p className="text-sm text-gray-600 mb-2">Shows your path: <code className="text-xs bg-gray-100 px-1 rounded">File &gt; Class &gt; Function</code> at the top of each editor.</p>
                  <p className="text-xs text-gray-500">Enable: <code className="bg-gray-100 px-1 rounded">"breadcrumbs.enabled": true</code></p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Outline View</h4>
                  <p className="text-sm text-gray-600 mb-2">See all functions, classes, and variables in the current file in a tree view. Explorer panel → OUTLINE.</p>
                  <p className="text-xs text-gray-500">Shortcut: <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⌘ ⇧ O</kbd> to jump to a symbol</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Go to Definition</h4>
                  <p className="text-sm text-gray-600 mb-2">Jump to where a function/type is defined — even across files.</p>
                  <p className="text-xs text-gray-500"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">F12</kbd> or <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">Ctrl+Click</kbd></p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Find All References</h4>
                  <p className="text-sm text-gray-600 mb-2">See everywhere a function or variable is used across the entire codebase.</p>
                  <p className="text-xs text-gray-500"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⇧ F12</kbd> or right-click → Find All References</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Peek Definition</h4>
                  <p className="text-sm text-gray-600 mb-2">View a definition inline without navigating away from your current file.</p>
                  <p className="text-xs text-gray-500"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⌥ F12</kbd></p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-navy-900 mb-1">Go to Symbol in Workspace</h4>
                  <p className="text-sm text-gray-600 mb-2">Search for any function, class, or type across ALL files in the project.</p>
                  <p className="text-xs text-gray-500"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">⌘ T</kbd></p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">4.2 — Quick Navigation Patterns</h3>
              <CodeBlock code={`# In the Quick Open bar (⌘P), special prefixes unlock superpowers:

@functionName    → Jump to symbol in current file
#functionName    → Search symbols across all files
:42              → Jump to line 42 in current file
>command         → Run a command (same as ⌘⇧P)

# Examples:
⌘P → @handleSubmit     → jumps to handleSubmit in this file
⌘P → #UserProfile      → finds UserProfile component anywhere
⌘P → :150             → jumps to line 150`} language="bash" />
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">4.3 — Project Structure Map (Tree View)</h3>
              <p className="text-gray-600 text-sm mb-3">Visualize and document your project structure with the <code>tree</code> command:</p>
              <CodeBlock code={`# Install tree (Mac)
brew install tree

# Install tree (Linux/WSL)
sudo apt install tree

# Print your project structure
tree -I 'node_modules|.git|.next|dist' -L 3

# Save it for documentation
tree -I 'node_modules|.git|.next|dist' -L 3 > PROJECT_STRUCTURE.txt`} language="bash" />
              <p className="text-gray-600 text-sm my-3">Example output for a Next.js project:</p>
              <CodeBlock code={`supreme-spoon/
├── src/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── claims/       # Claims page
│   │   ├── estimate/     # Estimate page
│   │   ├── tutorial/     # This tutorial
│   │   └── layout.tsx    # Root layout
│   ├── components/       # Shared UI components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── scripts/              # Build/automation scripts
└── CLAUDE.md             # AI assistant instructions`} language="bash" />
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">4.4 — Code Map Extensions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExtensionCard
                  name="CodeMap"
                  id="oleg-shilo.codemap"
                  desc="Side panel showing a visual code map / miniature outline of your file."
                  why="Orient yourself in huge files without scrolling."
                />
                <ExtensionCard
                  name="Dependency Cruiser"
                  id="juanallo.vscode-dependency-cruiser"
                  desc="Generates a visual graph of how your modules depend on each other."
                  why="Spot circular dependencies and understand module relationships."
                />
                <ExtensionCard
                  name="Import Cost"
                  id="wix.vscode-import-cost"
                  desc="Shows the bundle size of each import inline."
                  why="Immediately see when you accidentally import a massive library."
                />
                <ExtensionCard
                  name="Bookmarks"
                  id="alefragnani.bookmarks"
                  desc="Mark lines across files and jump between them with a shortcut."
                  why="Navigate between key points in large codebases without losing your place."
                />
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">4.5 — Dependency Mapping (package.json)</h3>
              <CodeBlock code={`# See your full dependency tree
npm ls

# See only top-level dependencies
npm ls --depth=0

# Find what uses a specific package
npm ls react

# Check for outdated packages
npm outdated

# Visualize the dependency tree (install globally)
npm install -g npm-why
npm-why lodash       # why is lodash in my project?

# Security audit
npm audit
npm audit fix`} language="bash" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-4">Navigation & Maps Checklist</h3>
              <ul className="space-y-0.5">
                {[
                  "Enabled Breadcrumbs (breadcrumbs.enabled: true)",
                  "Used Go to Definition (F12) to jump to source code",
                  "Used Find All References (Shift+F12) on a function",
                  "Tried the @ prefix in Quick Open to jump to a symbol",
                  "Ran 'tree' to map your project structure",
                  "Installed Import Cost to monitor bundle sizes",
                  "Installed Bookmarks extension for navigation markers",
                ].map((item) => <ChecklistItem key={item} text={item} />)}
              </ul>
            </div>
          </section>

          {/* ── MODULE 5: WORKFLOW ───────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="workflow"
              icon="⚡"
              title="Power Workflow"
              subtitle="Advanced techniques that separate good developers from great ones."
            />

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">5.1 — Multi-Cursor Editing</h3>
              <p className="text-gray-600 text-sm mb-3">Edit multiple places simultaneously — one of VS Code&rsquo;s most powerful features.</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left bg-white">
                  <thead>
                    <tr className="bg-navy-950 text-white text-xs uppercase tracking-wide">
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Mac</th>
                      <th className="py-3 px-3">Windows</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ShortcutRow action="Add cursor above/below"     mac="⌥ ⌘ ↑/↓"   win="Ctrl+Alt+↑/↓" />
                    <ShortcutRow action="Add cursor at click"        mac="⌥ Click"    win="Alt+Click" />
                    <ShortcutRow action="Select next occurrence"     mac="⌘ D"        win="Ctrl+D" />
                    <ShortcutRow action="Select all occurrences"     mac="⌘ ⇧ L"      win="Ctrl+Shift+L" />
                    <ShortcutRow action="Column selection"           mac="⇧ ⌥ Drag"   win="Shift+Alt+Drag" />
                    <ShortcutRow action="Split into lines (multi)"   mac="⌘ ⇧ L"      win="Ctrl+Shift+L" />
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">5.2 — Tasks & Automation (tasks.json)</h3>
              <p className="text-gray-600 text-sm mb-3">Create tasks.json in <code>.vscode/</code> to run any shell command from VS Code:</p>
              <CodeBlock code={`// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": { "reveal": "always", "panel": "new" }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm test",
      "group": "test"
    },
    {
      "label": "Lint & Format",
      "type": "shell",
      "command": "npm run lint && npx prettier --write .",
      "problemMatcher": ["$eslint-stylish"]
    }
  ]
}`} language="json" />
              <p className="text-gray-600 text-sm mt-3">Run tasks: <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">⌘ ⇧ P</kbd> → <em>Tasks: Run Task</em></p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">5.3 — Debugging Like a Pro</h3>
              <CodeBlock code={`// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "\${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug: current file",
      "type": "node",
      "request": "launch",
      "program": "\${file}",
      "console": "integratedTerminal"
    }
  ]
}`} language="json" />
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 border rounded-xl p-3 text-sm">
                  <strong className="block text-navy-800 mb-1">Set Breakpoint</strong>
                  <p className="text-gray-600">Click left of line number, or press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">F9</kbd></p>
                </div>
                <div className="bg-gray-50 border rounded-xl p-3 text-sm">
                  <strong className="block text-navy-800 mb-1">Start Debugging</strong>
                  <p className="text-gray-600">Press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">F5</kbd> or Run → Start Debugging</p>
                </div>
                <div className="bg-gray-50 border rounded-xl p-3 text-sm">
                  <strong className="block text-navy-800 mb-1">Step Through</strong>
                  <p className="text-gray-600"><kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">F10</kbd> step over · <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">F11</kbd> step into</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">5.4 — .env & Secrets Management</h3>
              <CodeBlock code={`# .env.local  (never commit this!)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_secret_here
ZOHO_REFRESH_TOKEN=your_refresh_token

# .gitignore — make sure these are excluded
.env
.env.local
.env.*.local`} language="bash" />
              <Tip type="warning">Add the <strong>DotENV</strong> extension (<code>mikestead.dotenv</code>) for syntax highlighting in .env files. Never commit real secrets — use environment variable injection in CI/CD.</Tip>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-900 mb-4">5.5 — Terminal Multiplexing</h3>
              <CodeBlock code={`# VS Code lets you run multiple terminals simultaneously
# Use the + button in the terminal panel, or:

# Split terminal (run two side-by-side)
⌘ \ (Mac) / Ctrl+\ (Windows)

# Create named terminal profiles in settings.json:
"terminal.integrated.profiles.osx": {
  "Dev Server": {
    "command": "npm",
    "args": ["run", "dev"],
    "icon": "server"
  },
  "Git": {
    "command": "bash",
    "icon": "git-branch"
  }
}`} language="bash" />
            </div>

            {/* Final summary card */}
            <div className="bg-navy-950 text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-amber-400 mb-6">🎯 Your Complete Power Workflow Checklist</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 uppercase text-xs tracking-widest">Daily Habits</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {[
                      "Open projects with code . from terminal",
                      "Use ⌘P to find files (never click the tree)",
                      "⌘D to select and rename all occurrences",
                      "⌘⇧P for any action you can't remember",
                      "Git pull before starting work each day",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 uppercase text-xs tracking-widest">Weekly Habits</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {[
                      "npm outdated — check for stale packages",
                      "npm audit — check for security issues",
                      "git fetch --prune — clean dead branches",
                      "Review and close stale browser tabs / editors",
                      "Back up settings via Settings Sync",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="text-center py-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-navy-950 mb-2">You&rsquo;re ready to ship.</h2>
            <p className="text-gray-500 mb-6">Bookmark this page and come back whenever you need a reference.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Back to Top
              </button>
              <a
                href="https://code.visualstudio.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 hover:border-navy-800 text-gray-700 hover:text-navy-900 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                VS Code Official Docs ↗
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
