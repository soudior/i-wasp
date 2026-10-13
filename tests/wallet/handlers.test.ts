// @vitest-environment node
// Providers and identities are mocks. No real credentials or issuer are used.
import { beforeAll, beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
const state = vi.hoisted(()=>({handler:null as null | ((req:Request)=>Promise<Response>)}));
vi.mock('https://deno.land/std@0.168.0/http/server.ts',()=>({serve:(handler:(req:Request)=>Promise<Response>)=>{state.handler=handler;}}));
let apple:(req:Request)=>Promise<Response>;let google:typeof apple;
beforeAll(async()=>{await import('../../supabase/functions/apple-wallet/index');apple=state.handler!;await import('../../supabase/functions/google-wallet/index');google=state.handler!;});
const card={id:'test-card',slug:'test-slug-',user_id:'test-user',is_active:true,first_name:'Élodie',last_name:'Test',email:'hidden@example.invalid',phone:'00000000',custom_styles:{wallet:{showEmail:false,showPhone:false}}};
let env:Record<string,string>;let calls: ReturnType<typeof vi.fn>;
const request=()=>new Request('https://test.invalid/wallet',{method:'POST',headers:{authorization:'Bearer test-only'},body:JSON.stringify({cardData:{id:card.id,slug:card.slug,email:'forged@example.invalid'}})});
beforeEach(()=>{
 env={SUPABASE_URL:'https://test.invalid',SUPABASE_ANON_KEY:'test-only'};
 vi.stubGlobal('Deno',{env:{get:(k:string)=>env[k]}});
 calls=vi.fn(async(url:string)=>{
  if(url.includes('/auth/'))return Response.json({id:'test-user'});
  if(url.includes('/digital_cards?'))return Response.json([card]);
  if(url.includes('/subscriptions?'))return Response.json([{user_id:'test-user',plan:'gold',status:'active'}]);
  return Response.json({passUrl:'https://pub1.pskt.io/TEST-ONLY'});
 });vi.stubGlobal('fetch',calls);
});
afterEach(()=>vi.unstubAllGlobals());
describe('Wallet handlers',()=>{
 it('rejects anonymous Apple before touching provider',async()=>{const response=await apple(new Request('https://test.invalid',{method:'POST',body:JSON.stringify({cardData:{id:'test'}})}));expect(response.status).toBe(401);expect(calls).not.toHaveBeenCalled();});
 it('rejects anonymous Google before signing',async()=>{expect((await google(new Request('https://test.invalid',{method:'POST',body:'{}'}))).status).toBe(401);});
 it('handles preflight and rejects unsupported methods',async()=>{expect((await apple(new Request('https://test.invalid',{method:'OPTIONS'}))).status).toBe(200);expect((await google(new Request('https://test.invalid'))).status).toBe(405);expect(calls).not.toHaveBeenCalled();});
 it('reports missing Apple configuration without provider calls',async()=>{const response=await apple(request());expect(await response.json()).toMatchObject({fallback:true});expect(calls).toHaveBeenCalledTimes(3);});
 it('reports missing Google configuration without signing',async()=>{const response=await google(request());expect(await response.json()).toMatchObject({fallback:true});expect(calls).toHaveBeenCalledTimes(3);});
 it('requires an explicit Google issuer',async()=>{env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON='{}';expect((await google(request())).status).toBe(503);expect(calls).toHaveBeenCalledTimes(3);});
 it('requires explicit PassKit template configuration',async()=>{env.PASSKIT_JWT_TOKEN='ey.TEST-ONLY';expect((await apple(request())).status).toBe(503);});
 it('omits hidden contact details and preserves stable identity and canonical URL',async()=>{
  Object.assign(env,{PASSKIT_JWT_TOKEN:'ey.TEST-ONLY',PASSKIT_PROGRAM_ID:'TEST-ONLY',PASSKIT_TIER_ID:'TEST-ONLY'});
  expect((await apple(request())).status).toBe(200);const payload=JSON.parse(calls.mock.calls[3][1].body);
  expect(payload.externalId).toBe('test-card');expect(payload.metaData.digitalCardUrl).toBe('https://i-wasp.com/card/test-slug-');expect(JSON.stringify(payload)).not.toMatch(/hidden@example|forged@example|00000000/);
 });
 it('does not expose provider errors or claim success on failure',async()=>{
  Object.assign(env,{PASSKIT_JWT_TOKEN:'ey.TEST-ONLY',PASSKIT_PROGRAM_ID:'TEST-ONLY',PASSKIT_TIER_ID:'TEST-ONLY'});
  calls.mockImplementationOnce(async()=>Response.json({id:'test-user'})).mockImplementationOnce(async()=>Response.json([card])).mockImplementationOnce(async()=>Response.json([{user_id:'test-user',plan:'gold',status:'active'}])).mockImplementationOnce(async()=>new Response('private provider details',{status:500}));
  const response=await apple(request());const result=await response.json();expect(result.success).not.toBe(true);expect(JSON.stringify(result)).not.toContain('private provider details');
 });
});
