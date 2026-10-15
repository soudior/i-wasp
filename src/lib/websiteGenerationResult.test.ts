import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { websiteGenerationNotice } from './websiteGenerationResult';
describe('truthful Web Studio delivery notices', () => {
 it('shows no warning for confirmed success',()=>expect(websiteGenerationNotice({blogEditorAvailable:true,emailSent:true})).toBeNull());
 it('explains unverified delivery on completed retry',()=>expect(websiteGenerationNotice({alreadyGenerated:true,notificationRetried:false})).toContain('n’ont pas été revérifiés'));
 it('asks for manual blog recovery',()=>expect(websiteGenerationNotice({blogEditorAvailable:false,emailSent:true})).toContain('contactez l’équipe'));
 it('does not promise an email after failure',()=>expect(websiteGenerationNotice({emailSent:false})).toContain('n’a pas été envoyé'));
 it('reports both missing steps',()=>{const n=websiteGenerationNotice({blogEditorAvailable:false,emailSent:false});expect(n).toContain('blog');expect(n).toContain('email');});
 it.each(['StepRecapitulatif','WebStudioAI'])('%s persists the notice and forwards the capability',page=>{const s=readFileSync(`src/pages/web-studio/${page}.tsx`,'utf8');expect(s).toContain('websiteGenerationNotice(genData)');expect(s).toContain('role="status"');expect(s).toContain('{generationNotice}');expect(s).toContain('generationToken: orderData.generationToken');});
});
