// @vitest-environment node
// TEST-ONLY: all identities, credentials, DB effects, AI and mail are mocked.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { issueWebsiteGenerationToken, verifyWebsiteGenerationToken } from '../../supabase/functions/_shared/websiteGenerationAccess';
const capture = vi.hoisted(() => ({ handler: null as null | ((req: Request) => Promise<Response>), client: {} as object }));
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({ serve: (handler: (req: Request) => Promise<Response>) => { capture.handler = handler; } }));
vi.mock('https://esm.sh/@supabase/supabase-js@2.89.0', () => ({ createClient: () => capture.client }));
const proposalId = '00000000-0000-4000-8000-000000000001';
const otherId = '00000000-0000-4000-8000-000000000002';
const service = 'TEST-ONLY-SERVER-KEY-NOT-A-REAL-CREDENTIAL';
const migration = readFileSync('supabase/migrations/20261014044343_website_generation_statuses.sql', 'utf8');
const statuses = new Set([...migration.matchAll(/'([^']+)'::text/g)].map(match => match[1]));
type Row = Record<string, unknown>;
type Result = { data: Row | null; error: unknown };
let tables: Record<string, Row[]>;
let operations: Array<{ table: string; action: string; payload?: Row; filters: Record<string, unknown> }>;
let auth: ReturnType<typeof vi.fn>, rpc: ReturnType<typeof vi.fn>, fetchMock: ReturnType<typeof vi.fn>;
let env: Record<string,string>;
let failClaim: boolean, raceOnReconcile: boolean, failBlogToken: boolean;
let failWrite: { table: string; status: string } | undefined;
let handler: (req: Request) => Promise<Response>;
function query(table: string) {
 let action='select'; let values:Row={}; const filters:Record<string,unknown>={};
 const run=():Result=>{
  operations.push({table,action,...(action!=='select'?{payload:values}:{}),filters:{...filters}});
  if(table==='website_proposals'&&action==='update'&&typeof values.status==='string'&&!statuses.has(values.status))return {data:null,error:{code:'23514'}};
  if(failClaim&&table==='website_proposals'&&action==='update'&&values.status==='generating')return {data:null,error:Error('TEST-ONLY DB error')};
  if(failWrite&&table===failWrite.table&&action==='update'&&values.status===failWrite.status)return {data:null,error:Error('TEST-ONLY persistence failure')};
  if(raceOnReconcile&&table==='website_proposals'&&action==='update'&&values.status==='site_generated'){tables.website_proposals[0].status='generating';raceOnReconcile=false;}
  const rows=tables[table]||[];
  if(action==='insert'){const row={id:'00000000-0000-4000-8000-000000000003',...values};rows.push(row);tables[table]=rows;return {data:row,error:null};}
  if(action==='upsert'){if(failBlogToken)return {data:null,error:Error('TEST-ONLY BLOG failure')};tables[table]=[values];return {data:values,error:null};}
  const found=rows.find(row=>Object.entries(filters).every(([k,v])=>row[k]===v));
  if(found&&action==='update')Object.assign(found,values);
  return {data:found?{...found}:null,error:null};
 };
 const chain={select:(_fields:string)=>chain,eq:(k:string,v:unknown)=>{filters[k]=v;return chain;},update:(v:Row)=>{action='update';values=v;return chain;},insert:(v:Row)=>{action='insert';values=v;return chain;},upsert:(v:Row,_opts:unknown)=>{action='upsert';values=v;return chain;},single:async()=>run(),maybeSingle:async()=>run(),then:(resolve:(r:Result)=>unknown,reject?:(r:unknown)=>unknown)=>Promise.resolve(run()).then(resolve,reject)};
 return chain;
}
const request=(body:unknown={proposalId},bearer?:string)=>new Request('https://test.invalid/generate',{method:'POST',headers:bearer?{authorization:`Bearer ${bearer}`}:{},body:JSON.stringify(body)});
const writes=()=>operations.filter(op=>op.action!=='select');
const noEffects=()=>{expect(operations).toEqual([]);expect(fetchMock).not.toHaveBeenCalled();};
const addCompleted=()=>tables.generated_websites.push({id:'TEST-ONLY-WEBSITE',proposal_id:proposalId,status:'completed',preview_url:'https://i-wasp.com/s/test-only-existing'});
const allowAdmin=()=>{auth.mockResolvedValue({data:{user:{id:'TEST-ONLY-ADMIN'}},error:null});rpc.mockImplementation(async(name:string)=>({data:name==='has_role'?true:'test-only-site',error:null}));};
beforeAll(async()=>{await import('../../supabase/functions/generate-website-code/index');handler=capture.handler!;});
beforeEach(()=>{
 env={SUPABASE_URL:'https://test.invalid',SUPABASE_SERVICE_ROLE_KEY:service,LOVABLE_API_KEY:'TEST-ONLY-AI',RESEND_API_KEY:'TEST-ONLY-EMAIL'};
 vi.stubGlobal('Deno',{env:{get:(k:string)=>env[k]}});
 tables={website_proposals:[{id:proposalId,status:'pending_payment',user_id:'TEST-ONLY-OWNER',session_id:'PUBLIC-LEGACY-SESSION',form_data:{businessName:'Test Fixture',contactEmail:'test@example.invalid'},proposal:{siteName:'Test Fixture'}}],generated_websites:[],website_blog_tokens:[]};
 operations=[];failClaim=false;raceOnReconcile=false;failBlogToken=false;failWrite=undefined;
 auth=vi.fn(async()=>({data:{user:null as null|{id:string;is_anonymous?:boolean;user_metadata?:Row}},error:Error('TEST-ONLY invalid token') as unknown}));
 rpc=vi.fn(async(name:string)=>({data:(name==='has_role'?false:'test-only-site') as unknown,error:null as unknown}));
 capture.client={auth:{getUser:auth},rpc,from:query};
 fetchMock=vi.fn(async(url:string)=>{
  if(url==='https://ai.gateway.lovable.dev/v1/chat/completions')return Response.json({choices:[{message:{content:JSON.stringify({html:'<html>TEST ONLY</html>',css:'',js:'',fullPage:'<html>TEST ONLY</html>'})}}]});
  if(url==='https://api.resend.com/emails')return Response.json({id:'TEST-ONLY-EMAIL'});
  throw Error(`Unexpected network blocked: ${url}`);
 });vi.stubGlobal('fetch',fetchMock);vi.spyOn(console,'log').mockImplementation(()=>{});vi.spyOn(console,'error').mockImplementation(()=>{});
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('generation capability and SQL contract',()=>{
 it('preserves all old SQL states plus three generator states',()=>{const old=readFileSync('supabase/migrations/20260114033618_bd01b3b9-e126-4a17-bdaf-be117f3ebe9a.sql','utf8');expect([...statuses].sort()).toEqual([...old.matchAll(/'([^']+)'::text/g)].map(m=>m[1]).concat(['generating','generation_failed','site_generated']).sort());expect(migration).not.toMatch(/DISABLE ROW LEVEL SECURITY|GRANT|DROP TABLE/i);});
 it('binds proposal, key, expiry and bounded clock window',async()=>{const now=Date.now(),t=await issueWebsiteGenerationToken(proposalId,service,now);expect(await verifyWebsiteGenerationToken(t,proposalId,service,now)).toBe(true);expect(await verifyWebsiteGenerationToken(t,otherId,service,now)).toBe(false);expect(await verifyWebsiteGenerationToken(t,proposalId,'OTHER-TEST-KEY',now)).toBe(false);expect(await verifyWebsiteGenerationToken(t,proposalId,service,now+900000)).toBe(false);expect(await verifyWebsiteGenerationToken(t,proposalId,service,now-1000)).toBe(false);});
 it.each([null,{},42,'','v2.1234567890.'+'a'.repeat(64),'v1.1234567890.'+'z'.repeat(64),'x'.repeat(10000)])('rejects malformed capability %j',async t=>expect(await verifyWebsiteGenerationToken(t,proposalId,service)).toBe(false));
 it('rejects altered signature',async()=>{const t=await issueWebsiteGenerationToken(proposalId,service);expect(await verifyWebsiteGenerationToken(t.slice(0,-1)+(t.endsWith('0')?'1':'0'),proposalId,service)).toBe(false);});
});
describe('real generation handler with mocked effects',()=>{
 it('handles preflight and disallows other methods',async()=>{expect((await handler(new Request('https://test.invalid',{method:'OPTIONS'}))).status).toBe(200);expect((await handler(new Request('https://test.invalid'))).status).toBe(405);noEffects();});
 it('rejects malformed JSON and non-UUID IDs',async()=>{expect((await handler(new Request('https://test.invalid',{method:'POST',body:'{'}))).status).toBe(400);for(const body of [null,{}, {proposalId:[]},{proposalId:'test'}])expect((await handler(request(body))).status).toBe(400);noEffects();});
 it('rejects ID alone before reading data',async()=>{expect((await handler(request())).status).toBe(401);noEffects();expect(auth).not.toHaveBeenCalled();});
 it.each(['TEST-ONLY-ANON','invalid','eyJhbGciOiJub25lIn0.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.'])('rejects invalid/anon/forged bearer %s',async b=>{expect((await handler(request({proposalId},b))).status).toBe(401);noEffects();});
 it('ignores service key/session/owner in body',async()=>{expect((await handler(request({proposalId,serviceKey:service,user_id:'TEST-ONLY-OWNER',sessionId:'PUBLIC-LEGACY-SESSION'}))).status).toBe(401);noEffects();});
 it('rejects mutable ownership/user_metadata admin claim',async()=>{auth.mockResolvedValue({data:{user:{id:'TEST-ONLY-OWNER',user_metadata:{role:'admin'}}},error:null});expect((await handler(request({proposalId},'TEST-ONLY-USER'))).status).toBe(403);expect(rpc).toHaveBeenCalledWith('has_role',{_user_id:'TEST-ONLY-OWNER',_role:'admin'});noEffects();});
 it('fails closed on role lookup error',async()=>{allowAdmin();rpc.mockResolvedValue({data:true,error:Error('TEST-ONLY')});expect((await handler(request({proposalId},'TEST-ONLY-USER'))).status).toBe(503);noEffects();});
 it('rejects anonymous Auth users',async()=>{auth.mockResolvedValue({data:{user:{id:'TEST-ONLY-USER',is_anonymous:true}},error:null});expect((await handler(request({proposalId},'TEST-ONLY-USER'))).status).toBe(401);noEffects();expect(rpc).not.toHaveBeenCalled();});
 it('rejects wrong proposal and expired capability before DB access',async()=>{for(const t of [await issueWebsiteGenerationToken(otherId,service),await issueWebsiteGenerationToken(proposalId,service,Date.now()-901000)])expect((await handler(request({proposalId,generationToken:t},'TEST-ONLY-ANON'))).status).toBe(403);noEffects();});
 it.each(['capability','service','admin'])('preserves legitimate %s generation/output',async mode=>{allowAdmin();const body={proposalId,...(mode==='capability'?{generationToken:await issueWebsiteGenerationToken(proposalId,service)}:{})};const r=await handler(request(body,mode==='service'?service:mode==='admin'?'TEST-ONLY-ADMIN':'TEST-ONLY-ANON'));expect(r.status).toBe(200);expect(await r.json()).toMatchObject({success:true,previewUrl:'https://i-wasp.com/s/test-only-site',emailSent:true});expect(fetchMock).toHaveBeenCalledTimes(2);expect(tables.website_blog_tokens).toHaveLength(1);expect(tables.website_proposals[0].status).toBe('site_generated');if(mode!=='admin')expect(auth).not.toHaveBeenCalled();expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toContain('blog-editor?token=');const bodyAI=JSON.parse(fetchMock.mock.calls[0][1].body);expect(bodyAI.model).toBe('google/gemini-2.5-pro');expect(bodyAI.max_tokens).toBe(16000);});
 it.each(['capability','service'])('does not regenerate completed on %s retry',async mode=>{tables.website_proposals[0].status='site_generated';addCompleted();const body={proposalId,...(mode==='capability'?{generationToken:await issueWebsiteGenerationToken(proposalId,service)}:{})};const r=await handler(request(body,mode==='service'?service:undefined));expect(r.status).toBe(200);expect(await r.json()).toMatchObject({success:true,alreadyGenerated:true,notificationRetried:false});expect(writes()).toEqual([]);expect(fetchMock).not.toHaveBeenCalled();});
 it('keeps explicit admin regeneration',async()=>{addCompleted();allowAdmin();expect((await handler(request({proposalId},'TEST-ONLY-ADMIN'))).status).toBe(200);expect(fetchMock).toHaveBeenCalledTimes(2);});
 it('allows only one provider call for concurrent retries',async()=>{const rr=await Promise.all([handler(request({proposalId},service)),handler(request({proposalId},service))]);expect(rr.map(r=>r.status).sort()).toEqual([200,409]);expect(fetchMock.mock.calls.filter(([u])=>String(u).includes('ai.gateway'))).toHaveLength(1);expect(tables.generated_websites).toHaveLength(1);});
 it('stops before provider on failed claim',async()=>{failClaim=true;expect((await handler(request({proposalId},service))).status).toBe(500);expect(fetchMock).not.toHaveBeenCalled();expect(tables.generated_websites).toHaveLength(0);});
 it.each([['generated_websites','generating'],['generated_websites','completed'],['website_proposals','site_generated']])('fails closed on %s persistence as %s',async(table,status)=>{failWrite={table,status};if(status==='generating')tables.generated_websites.push({id:'TEST-ONLY-WEBSITE',proposal_id:proposalId,status:'failed'});const r=await handler(request({proposalId},service));expect(r.status).toBe(500);expect(await r.text()).not.toContain('persistence failure');expect(tables.website_blog_tokens).toHaveLength(0);expect(fetchMock.mock.calls.filter(([u])=>String(u).includes('resend.com'))).toHaveLength(0);if(status==='generating')expect(fetchMock).not.toHaveBeenCalled();expect(tables.website_proposals[0].status).toBe('generation_failed');});
 it('reconciles a saved site without another generation',async()=>{tables.website_proposals[0].status='generation_failed';addCompleted();expect((await handler(request({proposalId},service))).status).toBe(200);expect(tables.website_proposals[0].status).toBe('site_generated');expect(fetchMock).not.toHaveBeenCalled();});
 it('does not erase a concurrent claim during reconciliation',async()=>{tables.website_proposals[0].status='generation_failed';raceOnReconcile=true;addCompleted();expect((await handler(request({proposalId},service))).status).toBe(409);expect(tables.website_proposals[0].status).toBe('generating');expect(fetchMock).not.toHaveBeenCalled();});
 it('does not reconcile while admin is regenerating',async()=>{tables.website_proposals[0].status='generating';addCompleted();expect((await handler(request({proposalId},service))).status).toBe(409);expect(writes()).toEqual([]);expect(fetchMock).not.toHaveBeenCalled();});
 it('never exposes a blog token that failed to persist',async()=>{failBlogToken=true;const r=await handler(request({proposalId},service));expect(await r.json()).toMatchObject({success:true,blogEditorUrl:null,blogEditorAvailable:false});const email=fetchMock.mock.calls.find(([u])=>String(u).includes('resend.com'));expect(email).toBeDefined();expect(email![1].body).not.toContain('blog-editor?token=');expect(tables.website_blog_tokens).toHaveLength(0);});
 it('does not claim email sent without configuration',async()=>{delete env.RESEND_API_KEY;expect(await(await handler(request({proposalId},service))).json()).toMatchObject({success:true,emailSent:false});expect(fetchMock).toHaveBeenCalledTimes(1);});
 it('does not claim email sent after provider rejection',async()=>{fetchMock.mockImplementationOnce(async()=>Response.json({choices:[{message:{content:JSON.stringify({html:'<html>TEST ONLY</html>'})}}]})).mockImplementationOnce(async()=>Response.json({error:'TEST-ONLY'},{status:500}));expect(await(await handler(request({proposalId},service))).json()).toMatchObject({success:true,emailSent:false});});
 it('releases claim after unexpected provider failure without leaking diagnostics',async()=>{fetchMock.mockRejectedValue(Error('TEST-ONLY-PRIVATE'));const r=await handler(request({proposalId},service));expect(r.status).toBe(500);expect(await r.text()).not.toContain('PRIVATE');expect(tables.website_proposals[0].status).toBe('generation_failed');expect(tables.generated_websites[0].status).toBe('failed');});
 it('detects cleanup failure and does not claim success',async()=>{failWrite={table:'website_proposals',status:'generation_failed'};fetchMock.mockRejectedValue(Error('TEST-ONLY-PRIVATE'));const r=await handler(request({proposalId},service));expect(r.status).toBe(500);expect(await r.text()).not.toContain('PRIVATE');expect(console.error).toHaveBeenCalledWith('Generation failure cleanup unavailable');expect(tables.generated_websites[0].status).toBe('failed');});
 it.each([402,429])('preserves provider %s and clears state',async status=>{fetchMock.mockResolvedValue(new Response('TEST-ONLY-PRIVATE',{status}));const r=await handler(request({proposalId},service));expect(r.status).toBe(status);expect(await r.text()).not.toContain('PRIVATE');expect(tables.website_proposals[0].status).toBe('generation_failed');expect(tables.website_blog_tokens).toHaveLength(0);});
 it.each([402,429])('reports failed cleanup after provider HTTP %s',async status=>{failWrite={table:'website_proposals',status:'generation_failed'};fetchMock.mockResolvedValue(new Response('TEST-ONLY-PRIVATE',{status}));const r=await handler(request({proposalId},service));expect(r.status).toBe(status);expect(await r.text()).not.toContain('PRIVATE');expect(console.error).toHaveBeenCalledWith('Generation failure cleanup unavailable');expect(tables.website_proposals[0].status).toBe('generating');expect(tables.generated_websites[0].status).toBe('failed');expect(tables.website_blog_tokens).toHaveLength(0);});
});
