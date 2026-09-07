import {describe,it,expect} from 'vitest'; import {STUDIONET,isStudionet} from '@/lib/genlayer/network';
describe('production network',()=>{it('is pinned to Studionet 61999',()=>{expect(STUDIONET.id).toBe(61999);expect(STUDIONET.rpcUrl).toBe('https://studio.genlayer.com/api');expect(isStudionet('0xf22f')).toBe(true);expect(isStudionet('0xf22d')).toBe(false)})});
