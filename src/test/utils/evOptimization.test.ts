import { describe, it, expect } from "vitest";
import {
  getOptimalEv,
  checkAllEvWaste,
  getTotalEvWaste,
} from "@/utils/evOptimization";
import type { EVs, IVs } from "@/types";

describe("evOptimization utils", () => {
  const mockIVs: IVs = {
    hp: 31,
    attack: 31,
    defense: 31,
    spAttack: 31,
    spDefense: 31,
    speed: 31,
  };

  describe("getOptimalEv", () => {
    it("無駄のない努力値の場合はnullを返す", () => {
      const evs: EVs = {
        hp: 252,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 4,
      };

      const result = getOptimalEv(
        "サンダー",
        50,
        "ひかえめ",
        mockIVs,
        evs,
        "hp",
      );
      expect(result).toBe(null);
    });

    it("無駄がある努力値の場合は最適値を返す", () => {
      const evs: EVs = {
        hp: 8, // 4でも同じ実数値になるはず
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 0,
      };

      const result = getOptimalEv(
        "サンダー",
        50,
        "ひかえめ",
        mockIVs,
        evs,
        "hp",
      );
      // 8から4に減らしても実数値が変わらない場合
      expect(result).toBe(4);
    });

    it("0の努力値の場合はnullを返す", () => {
      const evs: EVs = {
        hp: 252,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 4,
      };

      const result = getOptimalEv(
        "サンダー",
        50,
        "ひかえめ",
        mockIVs,
        evs,
        "attack",
      );
      expect(result).toBe(null);
    });
  });

  describe("checkAllEvWaste", () => {
    it("全ステータスの無駄をチェックする", () => {
      const evs: EVs = {
        hp: 252,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 4,
      };

      const result = checkAllEvWaste("サンダー", 50, "ひかえめ", mockIVs, evs);

      expect(result).toHaveProperty("hp");
      expect(result).toHaveProperty("attack");
      expect(result).toHaveProperty("defense");
      expect(result).toHaveProperty("spAttack");
      expect(result).toHaveProperty("spDefense");
      expect(result).toHaveProperty("speed");
    });
  });

  describe("getTotalEvWaste", () => {
    it("無駄のない努力値の場合は0を返す", () => {
      const evs: EVs = {
        hp: 252,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 4,
      };

      const result = getTotalEvWaste("サンダー", 50, "ひかえめ", mockIVs, evs);
      expect(result).toBe(0);
    });

    it("無駄がある努力値の場合は合計を返す", () => {
      const evs: EVs = {
        hp: 255, // 252で十分なはず（3の無駄）
        attack: 0,
        defense: 8, // 4で十分かも（4の無駄）
        spAttack: 252,
        spDefense: 0,
        speed: 4,
      };

      const result = getTotalEvWaste("サンダー", 50, "ひかえめ", mockIVs, evs);
      expect(result).toBeGreaterThan(0);
    });
  });
});
