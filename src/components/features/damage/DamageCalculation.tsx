import type { Thunder, Metagross } from "@/types";
import { calculateDamage } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DamageCalculationProps {
  thunder: Thunder;
  metagross: Metagross;
}

export const DamageCalculation = ({
  thunder,
  metagross,
}: DamageCalculationProps) => {
  const calculateDamages = () => {
    // 10万ボルトのダメージ計算
    const tboltMin = calculateDamage(
      thunder,
      metagross,
      95,
      "special",
      "electric",
      false,
      0.85,
    );
    const tboltMax = calculateDamage(
      thunder,
      metagross,
      95,
      "special",
      "electric",
      false,
      1.0,
    );

    // かみなりのダメージ計算
    const thunderMin = calculateDamage(
      thunder,
      metagross,
      120,
      "special",
      "electric",
      false,
      0.85,
    );
    const thunderMax = calculateDamage(
      thunder,
      metagross,
      120,
      "special",
      "electric",
      false,
      1.0,
    );

    return {
      tbolt: { min: tboltMin, max: tboltMax },
      thunder: { min: thunderMin, max: thunderMax },
      hp: metagross.stats?.hp || 155,
    };
  };

  const damageInfo = calculateDamages();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {thunder.stats?.spAttack || 177}サンダー →{" "}
          {metagross.stats?.hp || 155}-{metagross.stats?.spDefense || 110}
          メタグロスへのダメージ計算
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">10まんボルト:</span>
            <div className="text-right">
              <span className="font-mono text-lg">
                {damageInfo.tbolt.min}-{damageInfo.tbolt.max}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({Math.floor((damageInfo.tbolt.min / damageInfo.hp) * 100)}-
                {Math.floor((damageInfo.tbolt.max / damageInfo.hp) * 100)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">かみなり:</span>
            <div className="text-right">
              <span className="font-mono text-lg">
                {damageInfo.thunder.min}-{damageInfo.thunder.max}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({Math.floor((damageInfo.thunder.min / damageInfo.hp) * 100)}-
                {Math.floor((damageInfo.thunder.max / damageInfo.hp) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
