import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const HelpSection = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>使い方・計算方法について</CardTitle>
                <CardDescription>
                  このツールの詳細な説明と注意事項
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">概要</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                このツールは、ポケモン第三世代（ルビー・サファイア・エメラルド・FRLG）の対戦環境における、
                サンダー対メタグロスの1対1勝率を計算するものです。
                モンテカルロシミュレーション（10,000回試行）により、実戦に近い勝率を算出します。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">計算方法</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="leading-relaxed">
                  <strong>モンテカルロ法による確率計算：</strong>
                  10,000回の対戦をシミュレートし、勝率を算出しています。
                  そのため、計算のたびに結果がわずかに変動します（±1%程度）。
                  これは参考値として捉えてください。
                </p>
                <p className="leading-relaxed">
                  <strong>乱数の扱い：</strong>
                  ダメージ乱数（0.85〜1.00）、急所率（1/16）、技の命中率、
                  麻痺の行動不能（25%）、せんせいのツメ発動率（20%）などを
                  実際のゲームと同様に処理しています。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">計算の前提条件</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>サンダーは10まんボルト または かみなり のみを使用</li>
                <li>メタグロスはいわなだれのみを使用</li>
                <li>両者とも最適な行動を取る（ダメージを与える技のみ使用）</li>
                <li>ねむるなどの回復技は使用しない</li>
                <li>まもるなどの防御技は使用しない</li>
                <li>技の打ち分け（例：いわなだれ2回→かみなりパンチ）は考慮しない</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">もちものの効果</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">サンダーのもちもの</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><strong>じしゃく：</strong>でんき技の威力1.1倍</li>
                    <li><strong>ラムのみ：</strong>麻痺を1回だけ回復</li>
                    <li><strong>オボンのみ：</strong>HP半分以下で30回復</li>
                    <li><strong>たべのこし：</strong>ターン終了時に最大HP1/16回復</li>
                    <li><strong>ヤタピのみ：</strong>HP1/4以下でとくこう1段階上昇</li>
                    <li><strong>カムラのみ：</strong>HP1/4以下ですばやさ1段階上昇</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">メタグロスのもちもの</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><strong>こだわりハチマキ：</strong>物理技の威力1.5倍</li>
                    <li><strong>かたいいし：</strong>いわ技の威力1.1倍</li>
                    <li><strong>チイラのみ：</strong>HP1/4以下でこうげき1段階上昇</li>
                    <li><strong>カムラのみ：</strong>HP1/4以下ですばやさ1段階上昇</li>
                    <li><strong>その他：</strong>ラムのみ、オボンのみ等も選択可能</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">結果の見方</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  勝率は色分けされて表示されます：
                </p>
                <ul className="space-y-1">
                  <li><span className="inline-block w-20 bg-green-100 text-green-900 px-2 py-1 rounded text-xs">80%以上</span> 非常に有利</li>
                  <li><span className="inline-block w-20 bg-yellow-100 text-yellow-900 px-2 py-1 rounded text-xs">60-79%</span> 有利</li>
                  <li><span className="inline-block w-20 bg-orange-100 text-orange-900 px-2 py-1 rounded text-xs">40-59%</span> 五分</li>
                  <li><span className="inline-block w-20 bg-red-100 text-red-900 px-2 py-1 rounded text-xs">40%未満</span> 不利</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">注意事項</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>この計算結果はあくまで参考値です</li>
                  <li>実戦では読み合いや技の打ち分けが発生します</li>
                  <li>第三世代の仕様（ピンチきのみはターン終了時発動等）に準拠</li>
                  <li>計算のたびに結果が若干変動します（モンテカルロ法の性質）</li>
                </ul>
              </div>
            </section>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}