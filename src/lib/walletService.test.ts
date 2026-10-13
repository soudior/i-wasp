import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ invoke:vi.fn(), error:vi.fn(), info:vi.fn(), download:vi.fn(), assign:vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({supabase:{functions:{invoke:mocks.invoke}}}));
vi.mock('sonner', () => ({ toast:{error:mocks.error,info:mocks.info} }));
vi.mock('@/lib/vcard', () => ({downloadVCard:mocks.download}));
import { addToAppleWallet, addToGoogleWallet } from './walletService';
const card = {id:'test-card',slug:'test-card',firstName:'Test',lastName:'Fixture'};
beforeEach(()=>{vi.clearAllMocks();vi.stubGlobal('window',{location:{assign:mocks.assign}});});
describe('Wallet feedback never claims installation',()=>{
  it.each([{error:new Error('offline'),data:null},{error:null,data:{fallback:true}},{error:null,data:{success:true}},{error:null,data:{success:true,saveUrl:'javascript:alert(1)'}},{error:null,data:{success:true,saveUrl:'https://evil.invalid/gp/v/save/test'}}])('rejects unavailable or unsafe response %j',async response=>{
    mocks.invoke.mockResolvedValue(response); expect(await addToGoogleWallet(card)).toBe(false);expect(mocks.assign).not.toHaveBeenCalled();expect(mocks.download).not.toHaveBeenCalled();
  });
  it('offers a deliberate vCard contact fallback',async()=>{mocks.invoke.mockRejectedValue(new Error('offline'));await addToAppleWallet(card);const options=mocks.error.mock.calls[0][1];expect(options.action.label).toContain('.vcf');options.action.onClick();expect(mocks.download).toHaveBeenCalledWith(card);});
  it.each([['google','https://pay.google.com/gp/v/save/TEST-ONLY'],['apple','https://pub1.pskt.io/TEST-ONLY']])('requests %s navigation only',async(type,url)=>{
    mocks.invoke.mockResolvedValue({data:{success:true,saveUrl:url,passUrl:url}});expect(await(type==='google'?addToGoogleWallet(card):addToAppleWallet(card))).toBe(true);expect(mocks.assign).toHaveBeenCalledWith(url);expect(mocks.info.mock.calls[0][0]).toContain('installation n’est pas vérifiée');
  });
  it('reports blocked navigation without success',async()=>{mocks.invoke.mockResolvedValue({data:{success:true,saveUrl:'https://pay.google.com/gp/v/save/TEST-ONLY'}});mocks.assign.mockImplementationOnce(()=>{throw new Error('blocked')});expect(await addToGoogleWallet(card)).toBe(false);});
});
