import { generatedIcons } from './skill-icons.generated';

export interface SkillIcon {
  /** `tile`: o SVG já é um quadrado colorido (AWS). `logo`: logo sobre fundo claro. */
  kind: 'logo' | 'tile';
  svg: string;
}

export function skillIcon(name: string): SkillIcon | undefined {
  return generatedIcons[name];
}
