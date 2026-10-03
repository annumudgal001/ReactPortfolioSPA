import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';

import { Profile, Project } from '../../../core/models/portfolio.models';
import { Theme, ThemeService } from '../../../core/services/theme.service';
import { socialLinks } from '../../../core/utils/socials';

type LineKind = 'cmd' | 'out' | 'link' | 'error';

interface Line {
  kind: LineKind;
  text: string;
  href?: string;
}

const COMMANDS = [
  { name: 'help', help: 'list all commands' },
  { name: 'about', help: 'short introduction' },
  { name: 'whoami', help: 'who is this?' },
  { name: 'skills', help: 'tech stack by category' },
  { name: 'projects', help: 'things I have built' },
  { name: 'experience', help: 'work history' },
  { name: 'education', help: 'degrees and scores' },
  { name: 'services', help: 'what I can do for you' },
  { name: 'contact', help: 'how to reach me' },
  { name: 'socials', help: 'links to my profiles' },
  { name: 'jargon', help: 'random developer humour' },
  { name: 'resume', help: 'open my resume' },
  { name: 'theme <name>', help: 'light | dark | terminal' },
  { name: 'clear', help: 'clear the screen (Ctrl + L)' },
];

const THEMES: Theme[] = ['light', 'dark', 'terminal'];

@Component({
  selector: 'app-terminal',
  template: `
    <div class="window terminal" (click)="focus()">
      <div class="window__bar">
        <div class="window__dots"><span></span><span></span><span></span></div>
        <span class="window__title">{{ user() }}&#64;portfolio — zsh</span>
      </div>

      <div class="terminal__screen" #screen aria-live="polite">
        @for (line of lines(); track $index) {
          @switch (line.kind) {
            @case ('cmd') {
              <p class="t-line t-cmd"><span class="t-prompt">❯</span>{{ line.text }}</p>
            }
            @case ('link') {
              <p class="t-line">
                <a [href]="line.href" target="_blank" rel="noopener noreferrer">{{ line.text }}</a>
              </p>
            }
            @case ('error') {
              <p class="t-line t-error">{{ line.text }}</p>
            }
            @default {
              <p class="t-line">{{ line.text }}</p>
            }
          }
        }

        <label class="t-input">
          <span class="t-prompt">❯</span>
          <input
            #field
            type="text"
            [value]="value()"
            (input)="onInput($event)"
            (keydown)="onKey($event)"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-label="Terminal command"
          />
        </label>
      </div>

      <div class="t-chips">
        @for (command of quick; track command) {
          <button type="button" class="chip" (click)="exec(command)">{{ command }}</button>
        }
      </div>
    </div>
  `,
})
export class Terminal implements OnInit {
  readonly profile = input.required<Profile>();
  readonly projects = input<Project[]>([]);

  private readonly themeService = inject(ThemeService);
  private readonly screen = viewChild<ElementRef<HTMLDivElement>>('screen');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly lines = signal<Line[]>([]);
  protected readonly value = signal('');
  protected readonly quick = ['help', 'about', 'skills', 'projects', 'contact', 'theme terminal'];

  private readonly history: string[] = [];
  private cursor = 0;

  ngOnInit(): void {
    this.lines.set([
      { kind: 'out', text: `Welcome to ${this.profile().name}'s portfolio terminal.` },
      { kind: 'out', text: "Type 'help' to see available commands." },
    ]);
  }

  protected user(): string {
    return this.profile().name.split(' ')[0].toLowerCase();
  }

  protected focus(): void {
    if (!window.getSelection()?.toString()) {
      this.field()?.nativeElement.focus();
    }
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.step(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.step(1);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      this.lines.set([]);
    }
  }

  protected exec(raw: string): void {
    const [command, ...args] = raw.trim().split(/\s+/);
    const key = command.toLowerCase();

    if (key === 'clear') {
      this.lines.set([]);
      return;
    }

    this.lines.update((lines) => [
      ...lines,
      { kind: 'cmd', text: raw },
      ...this.respond(key, args),
    ]);
    this.scrollToEnd();
  }

  private submit(): void {
    const raw = this.value().trim();
    this.value.set('');

    if (!raw) {
      return;
    }

    this.history.push(raw);
    this.cursor = this.history.length;
    this.exec(raw);
  }

  private step(direction: -1 | 1): void {
    if (!this.history.length) {
      return;
    }

    this.cursor = Math.min(Math.max(this.cursor + direction, 0), this.history.length);
    this.value.set(this.history[this.cursor] ?? '');
  }

  private scrollToEnd(): void {
    const element = this.screen()?.nativeElement;

    if (element) {
      setTimeout(() => (element.scrollTop = element.scrollHeight));
    }
  }

  private respond(command: string, args: string[]): Line[] {
    const p = this.profile();
    const out = (text: string): Line => ({ kind: 'out', text });

    switch (command) {
      case 'help':
        return [
          out('Available commands:'),
          ...COMMANDS.map((c) => out(`  ${c.name.padEnd(14)}${c.help}`)),
        ];

      case 'whoami':
        return [out(p.name), out(p.headline)];

      case 'about':
        return [out(p.summary)];

      case 'skills':
        return p.skillGroups.map((g) =>
          out(`${g.category}: ${g.items.map((i) => i.name).join(', ')}`),
        );

      case 'projects':
        return this.projects().length
          ? this.projects().map((x, i) =>
              out(`• ${x.title} [${x.technologies.join(', ')}]`),
            )
          : [out('No projects found.')];

      case 'experience':
        return p.experience.map((e) => out(`${e.role} @ ${e.company} (${e.period})`));

      case 'education':
        return p.education.map((e) => out(`${e.degree}, ${e.institution}: ${e.score}`));

      case 'services':
        return p.services.map((s) => out(`• ${s.title}`));

      case 'contact':
        return [
          { kind: 'link', text: p.email, href: `mailto:${p.email}` },
          out(p.phone),
          out(p.location),
        ];

      case 'socials':
        return socialLinks(p.socials).map((l) => ({
          kind: 'link' as const,
          text: `${l.label}: ${l.url}`,
          href: l.url,
        }));

      case 'resume':
        return [{ kind: 'link', text: 'Open resume (PDF)', href: p.resumeUrl }];

      case 'jargon': {
        const list = p.jargon ?? [];
        return [out(list.length ? list[Math.floor(Math.random() * list.length)] : 'No jargon loaded.')];
      }

      case 'theme': {
        const wanted = args[0]?.toLowerCase() as Theme | undefined;

        if (wanted && THEMES.includes(wanted)) {
          this.themeService.set(wanted);
          return [out(`Theme set to ${wanted}.`)];
        }

        return [{ kind: 'error', text: 'Usage: theme light | dark | terminal' }];
      }

      case 'sudo':
        return args.join(' ') === 'hire-me'
          ? [out('Permission granted. Excellent decision. Run "contact" to take the next step.')]
          : [{ kind: 'error', text: 'sudo: nice try.' }];

      default:
        return [{ kind: 'error', text: `command not found: ${command}. Type 'help'.` }];
    }
  }
}
