import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { publicAiError } from '../../supabase/functions/_shared/publicAiError';
const functions=['adaptive-template','generate-palette','generate-website-code','generate-template','smart-suggestions','generate-image','webstudio-chat','regenerate-text','generate-website'];
describe('AI public error boundary',()=>{
 it.each([new Error('LOVABLE_API_KEY is not configured'),new Error('provider response test-only-private-payload'),null,{toString(){throw Error('must not serialize');}}])('does not expose unhandled diagnostics',error=>{
  expect(publicAiError(error)).toBe('Le service de génération est momentanément indisponible. Réessayez plus tard.');
 });
 for(const name of functions)it(`${name} keeps its provider and routes unexpected errors through the public boundary`,()=>{
  const source=readFileSync(`supabase/functions/${name}/index.ts`,'utf8');
  expect(source).toContain('publicAiError(error)');
  expect(source).toContain('https://ai.gateway.lovable.dev/v1/chat/completions');
  const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true});
  expect(result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error)).toEqual([]);
 });
});
