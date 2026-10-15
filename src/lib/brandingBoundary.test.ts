import {it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {browserAuthStorage} from '../integrations/supabase/browserAuthStorage';
it('keeps browser sessions in existing first-party localStorage',()=>{
 const storage=browserAuthStorage();expect(storage).toBe(window.localStorage);
 storage!.setItem('test-only-branding','test');expect(storage!.getItem('test-only-branding')).toBe('test');storage!.removeItem('test-only-branding');
});
it('removes the editor bridge and obsolete favicon from distributable assets',()=>{
 expect(existsSync('src/integrations/supabase/previewAuthStorage.ts')).toBe(false);
 expect(existsSync('public/favicon.ico')).toBe(false);
 const html=readFileSync('index.html','utf8');expect(html).toContain('/favicon.svg');expect(html.toLowerCase()).not.toContain('lovable');
 expect(readFileSync('src/integrations/supabase/client.ts','utf8')).not.toContain('brokeredPreviewStorage');
});
