import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export const HelpSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>ツールについて</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">概要</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                このツールは、ポケモン第三世代の対戦環境における、
                サンダー対メタグロスの勝率を計算するものです。
                <br />
                モンテカルロシミュレーション（10000回試行）によっておおよその勝率を算出します。計算のたびに結果がわずかに変動するため、参考値として捉えてください。
                <br />
                PCでの閲覧を推奨します。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">計算の前提条件</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>サンダーは「10まんボルト」または「かみなり」のみを使用</li>
                <li>メタグロスは「いわなだれ」のみを使用</li>
                <li>ねむる、まもる、でんじはなどの補助技は使用しない</li>
                <li>
                  計算の平易化のために、技の打ち分け（例：いわなだれ2回→かみなりパンチ）や、PP切れは考慮しない
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">結果の見方</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>勝率は色分けされて表示されます：</p>
                <ul className="space-y-1">
                  <li>
                    <span className="inline-block w-20 bg-green-100 text-green-900 px-2 py-1 mr-2 rounded text-xs">
                      80%以上
                    </span>
                    非常に有利
                  </li>
                  <li>
                    <span className="inline-block w-20 bg-yellow-100 text-yellow-900 px-2 py-1 mr-2 rounded text-xs">
                      60-79%
                    </span>
                    有利
                  </li>
                  <li>
                    <span className="inline-block w-20 bg-orange-100 text-orange-900 px-2 py-1 mr-2 rounded text-xs">
                      40-59%
                    </span>
                    五分
                  </li>
                  <li>
                    <span className="inline-block w-20 bg-red-100 text-red-900 px-2 py-1 mr-2 rounded text-xs">
                      40%未満
                    </span>
                    不利
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">ツール名の元ネタ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                このツールは、その90%をAIによるコーディングで実装しています。
                <br />
                <a
                  href="https://x.com/stoic4486"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  stoic氏
                </a>
                の
                <a
                  href="https://stoic4486.hatenablog.com/entry/2025/06/15/100520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ブログ記事
                </a>
                で行われていたメタグロスとサンダーの勝率計算を、AIの力でラクに行いたい、という意図でこのツールは命名されました。
              </p>
            </section>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
