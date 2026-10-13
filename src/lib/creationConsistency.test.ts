import { describe, it, expect } from 'vitest';
import { expressPublicProfile, normalizeExpressPhone } from './expressPublicProfile';
import { ORDER_PALETTES, orderPalette } from './orderPalette';
import { orderProfileFields, EMPTY_IDENTITY } from './orderIdentity';
const shipping = {firstName:' Camille ',lastName:' Test ',email:'private@example.invalid',phone:'+33 6 00 00 00 00',address:'TEST ONLY',city:'Test'};
describe('Express privacy boundary', () => {
  it('does not publish legacy drafts or unchecked choices',()=>{
    expect(expressPublicProfile(shipping)).toBeNull();
    expect(expressPublicProfile({...shipping,publishNameOnly:false})).toBeNull();
  });
  it('only publishes confirmed names, never delivery contacts',()=>{
    expect(expressPublicProfile({...shipping,publishNameOnly:true})).toEqual({first_name:'Camille',last_name:'Test',email:null,phone:null,template:'signature'});
  });
  it('refuses blank confirmed names',()=>expect(()=>expressPublicProfile({...shipping,firstName:' ',publishNameOnly:true})).toThrow());
  it('does not invent a country code or truncate international numbers',()=>{
    expect(normalizeExpressPhone('06 12 34 56 78')).toBe('0612345678');
    expect(normalizeExpressPhone('+44 (20) 1234-5678')).toBe('+442012345678');
  });
});
describe('Order palette persisted for recipient renderer',()=>{
  for(const id of Object.keys(ORDER_PALETTES)) it(`persists ${id} styles`,()=>{
    const fields=orderProfileFields({...EMPTY_IDENTITY,firstName:'Camille',lastName:'Test',profileVisibilityConfirmed:true},id);
    expect(fields.custom_styles).toEqual(orderPalette(id));
    expect(fields.custom_styles?.backgroundColor).toBe(ORDER_PALETTES[id as keyof typeof ORDER_PALETTES].backgroundColor);
    expect(fields.template).toBe(id);
  });
  it('does not impose styles on unknown or client templates',()=>expect(orderPalette('dark-luxury-business')).toBeUndefined());
});
