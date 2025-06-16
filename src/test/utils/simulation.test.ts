import { describe, it, expect, vi } from 'vitest'
import { calculateWinRate, getWinRateColorClass, getItemDescription } from '@/utils/simulation'
import type { Thunder, Metagross } from '@/types'

// battle モジュールをモック
vi.mock('@/utils/battle', () => ({
  simulateBattle: vi.fn(),
}))

describe('simulation utils', () => {
  describe('calculateWinRate', () => {
    const mockThunder: Thunder = {
      species: 'サンダー',
      level: 50,
      nature: 'ひかえめ',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 0, defense: 0, spAttack: 252, spDefense: 0, speed: 4 },
      item: 'じしゃく',
      electricMove: '10まんボルト',
    }

    const mockMetagross: Metagross = {
      species: 'メタグロス',
      level: 50,
      nature: 'いじっぱり',
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 252, attack: 252, defense: 0, spAttack: 0, spDefense: 0, speed: 4 },
      item: 'こだわりハチマキ',
    }

    it('勝率を正しく計算する', async () => {
      const { simulateBattle } = await import('@/utils/battle')
      const mockSimulateBattle = vi.mocked(simulateBattle)
      
      // 10回中7回勝利するようにモック
      mockSimulateBattle
        .mockReturnValueOnce({ winner: 'thunder', turns: 5 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 6 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 4 })
        .mockReturnValueOnce({ winner: 'metagross', turns: 3 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 5 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 7 })
        .mockReturnValueOnce({ winner: 'metagross', turns: 4 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 5 })
        .mockReturnValueOnce({ winner: 'metagross', turns: 6 })
        .mockReturnValueOnce({ winner: 'thunder', turns: 4 })

      const winRate = calculateWinRate(mockThunder, mockMetagross, 10)
      
      expect(winRate).toBe(70) // 7/10 * 100 = 70%
      expect(mockSimulateBattle).toHaveBeenCalledTimes(10)
    })
  })

  describe('getWinRateColorClass', () => {
    it('80%以上の場合は緑色のクラスを返す', () => {
      expect(getWinRateColorClass(80)).toBe('bg-green-100 text-green-900')
      expect(getWinRateColorClass(90)).toBe('bg-green-100 text-green-900')
      expect(getWinRateColorClass(100)).toBe('bg-green-100 text-green-900')
    })

    it('60%以上80%未満の場合は黄色のクラスを返す', () => {
      expect(getWinRateColorClass(60)).toBe('bg-yellow-100 text-yellow-900')
      expect(getWinRateColorClass(70)).toBe('bg-yellow-100 text-yellow-900')
      expect(getWinRateColorClass(79.9)).toBe('bg-yellow-100 text-yellow-900')
    })

    it('40%以上60%未満の場合はオレンジ色のクラスを返す', () => {
      expect(getWinRateColorClass(40)).toBe('bg-orange-100 text-orange-900')
      expect(getWinRateColorClass(50)).toBe('bg-orange-100 text-orange-900')
      expect(getWinRateColorClass(59.9)).toBe('bg-orange-100 text-orange-900')
    })

    it('40%未満の場合は赤色のクラスを返す', () => {
      expect(getWinRateColorClass(0)).toBe('bg-red-100 text-red-900')
      expect(getWinRateColorClass(20)).toBe('bg-red-100 text-red-900')
      expect(getWinRateColorClass(39.9)).toBe('bg-red-100 text-red-900')
    })
  })

  describe('getItemDescription', () => {
    it('存在する持ち物の説明を返す', () => {
      const description = getItemDescription('じしゃく')
      expect(description).toBeTruthy()
      expect(typeof description).toBe('string')
    })

    it('存在しない持ち物の場合は空文字を返す', () => {
      const description = getItemDescription('存在しない持ち物')
      expect(description).toBe('')
    })
  })
})