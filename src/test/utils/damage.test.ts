import { describe, it, expect } from 'vitest'
import { calculateModifiers, calculateDamage, isCriticalHit, generateRandomValue } from '@/utils/damage'
import type { Thunder, Metagross } from '@/types'

describe('damage utils', () => {
  describe('calculateModifiers', () => {
    const mockThunder: Thunder = {
      species: 'サンダー',
      level: 50,
      nature: 'ひかえめ',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 0, defense: 0, spAttack: 252, spDefense: 0, speed: 4 },
      item: 'じしゃく',
      electricMove: '10まんボルト',
      stats: {
        hp: 196,
        attack: 110,
        defense: 105,
        spAttack: 177,
        spDefense: 110,
        speed: 121,
      },
    }

    const mockMetagross: Metagross = {
      species: 'メタグロス',
      level: 50,
      nature: 'いじっぱり',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 252, defense: 0, spAttack: 0, spDefense: 0, speed: 4 },
      item: 'こだわりハチマキ',
      stats: {
        hp: 187,
        attack: 205,
        defense: 150,
        spAttack: 115,
        spDefense: 110,
        speed: 91,
      },
    }

    it('電気技のタイプ一致ボーナスを正しく計算する', () => {
      const modifier = calculateModifiers(mockThunder, mockMetagross, 'electric', 'special')
      // タイプ一致 1.5 × じしゃく 1.1 = 1.65
      expect(modifier).toBeCloseTo(1.65, 10)
    })

    it('岩技のタイプ相性ボーナスを正しく計算する', () => {
      const modifier = calculateModifiers(mockMetagross, mockThunder, 'rock', 'physical')
      // いわ→ひこう（ばつぐん） 2.0 × こだわりハチマキ 1.5 = 3.0
      expect(modifier).toBe(3.0)
    })

    it('持ち物補正なしの場合の計算', () => {
      const thunderNoItem = { ...mockThunder, item: 'なし' as const }
      const modifier = calculateModifiers(thunderNoItem, mockMetagross, 'electric', 'special')
      // タイプ一致 1.5 のみ
      expect(modifier).toBe(1.5)
    })
  })

  describe('calculateDamage', () => {
    const mockThunder: Thunder = {
      species: 'サンダー',
      level: 50,
      nature: 'ひかえめ',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 0, defense: 0, spAttack: 252, spDefense: 0, speed: 4 },
      item: 'じしゃく',
      electricMove: '10まんボルト',
      stats: {
        hp: 196,
        attack: 110,
        defense: 105,
        spAttack: 177,
        spDefense: 110,
        speed: 121,
      },
    }

    const mockMetagross: Metagross = {
      species: 'メタグロス',
      level: 50,
      nature: 'いじっぱり',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 252, defense: 0, spAttack: 0, spDefense: 0, speed: 4 },
      item: 'こだわりハチマキ',
      stats: {
        hp: 187,
        attack: 205,
        defense: 150,
        spAttack: 115,
        spDefense: 110,
        speed: 91,
      },
    }

    it('ダメージを正しく計算する', () => {
      const damage = calculateDamage(
        mockThunder,
        mockMetagross,
        95, // 10まんボルトの威力
        'special',
        'electric',
        false,
        1.0, // 最大乱数
      )
      
      // 基本ダメージ計算が複雑なため、実際の結果を確認
      expect(damage).toBeGreaterThan(100)
      expect(damage).toBeLessThan(120)
    })

    it('急所時のダメージを正しく計算する', () => {
      const damage = calculateDamage(
        mockThunder,
        mockMetagross,
        95,
        'special',
        'electric',
        true, // 急所
        1.0,
      )
      
      // 急所時は通常ダメージの2倍
      expect(damage).toBeGreaterThan(200)
      expect(damage).toBeLessThan(240)
    })

    it('最低でも1ダメージを与える', () => {
      const weakThunder = {
        ...mockThunder,
        stats: { ...mockThunder.stats, spAttack: 1 },
      }
      
      const damage = calculateDamage(
        weakThunder,
        mockMetagross,
        1, // 威力1の技
        'special',
        'electric',
        false,
        0.85, // 最小乱数
      )
      
      expect(damage).toBeGreaterThanOrEqual(1)
    })
  })

  describe('generateRandomValue', () => {
    it('0.85から1.00の範囲の値を返す', () => {
      for (let i = 0; i < 100; i++) {
        const value = generateRandomValue()
        expect(value).toBeGreaterThanOrEqual(0.85)
        expect(value).toBeLessThanOrEqual(1.0)
      }
    })
  })

  describe('isCriticalHit', () => {
    it('boolean値を返す', () => {
      const result = isCriticalHit()
      expect(typeof result).toBe('boolean')
    })
  })
})