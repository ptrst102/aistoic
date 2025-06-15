# UI アーキテクチャ設計書

## 1. shadcn/ui コンポーネント構成

### 1.1 使用するshadcn/uiコンポーネント
- **Form**: react-hook-form と Zod を統合したフォーム管理
- **Card**: 各セクションのコンテナ
- **Tabs**: サンダー入力とメタグロス入力の切り替え
- **Input**: 数値入力（個体値、努力値）
- **Select**: 性格、持ち物の選択
- **Slider**: 努力値の視覚的入力
- **RadioGroup**: 技の選択
- **Checkbox**: ねむる採用の選択
- **Table**: 勝率結果の表示
- **Button**: シミュレーション実行
- **Label**: 各入力項目のラベル

### 1.2 カスタムコンポーネント
```
components/
├── ui/                    # shadcn/ui コンポーネント
├── pokemon/
│   ├── StatsInput.tsx     # 個体値・努力値入力
│   ├── NatureSelect.tsx   # 性格選択（補正表示付き）
│   ├── ItemSelect.tsx     # 持ち物選択
│   └── EVDisplay.tsx      # 努力値合計表示
├── forms/
│   ├── ThunderForm.tsx    # サンダー入力フォーム
│   └── MetagrossForm.tsx  # メタグロス入力フォーム
└── results/
    ├── ResultTable.tsx    # 勝率結果テーブル
    └── WinRateCell.tsx    # 勝率セル（色分け）
```

## 2. React 19 フォーム実装パターン

### 2.1 useActionState を使用したフォーム管理

```typescript
// フォームアクション
async function simulateBattle(
  prevState: SimulationState,
  formData: FormData
): Promise<SimulationState> {
  // フォームデータの検証
  const validatedData = thunderSchema.parse({
    // FormDataから値を抽出
  });
  
  // シミュレーション実行
  const results = await runSimulation(validatedData);
  
  return {
    status: 'success',
    data: results,
    errors: null,
  };
}

// コンポーネント内での使用
function ThunderForm() {
  const [state, formAction, isPending] = useActionState(
    simulateBattle,
    initialState
  );
  
  // useOptimistic で即座にUIを更新
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (state, newData) => ({ ...state, isPending: true })
  );
}
```

### 2.2 Zodスキーマ定義

```typescript
const thunderSchema = z.object({
  ivs: z.object({
    hp: z.number().min(0).max(31),
    attack: z.number().min(0).max(31),
    defense: z.number().min(0).max(31),
    spAttack: z.number().min(0).max(31),
    spDefense: z.number().min(0).max(31),
    speed: z.number().min(0).max(31),
  }),
  evs: z.object({
    hp: z.number().min(0).max(252),
    defense: z.number().min(0).max(252),
    spAttack: z.number().min(0).max(252),
    spDefense: z.number().min(0).max(252),
    speed: z.number().min(0).max(252),
  }).refine((evs) => {
    const total = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
    return total <= 510;
  }, "努力値の合計は510以下にしてください"),
  nature: z.enum(NATURE_LIST),
  electricMove: z.enum(['10まんボルト', 'かみなり']),
  hasRest: z.boolean(),
  item: z.enum(THUNDER_ITEMS),
});
```

## 3. UIコンポーネント詳細設計

### 3.1 StatsInput コンポーネント
```tsx
interface StatsInputProps {
  label: string;
  stat: StatKey;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  showSlider?: boolean;
}

// 個体値入力と努力値入力で共用
// スライダーと数値入力の両方を提供
```

### 3.2 NatureSelect コンポーネント
```tsx
// 性格選択時に補正をプレビュー表示
// 例: いじっぱり (攻撃↑ 特攻↓)
```

### 3.3 ResultTable コンポーネント
```tsx
// 勝率に応じて背景色を変更
// 90%以上: 緑
// 70-89%: 黄緑
// 50-69%: 黄
// 30-49%: オレンジ
// 30%未満: 赤
```

## 4. パフォーマンス最適化

### 4.1 メモ化戦略
- ステータス計算結果は useMemo でキャッシュ
- 重い計算は Web Worker で実行
- React.memo で不要な再レンダリング防止

### 4.2 プログレッシブエンハンスメント
- 初期表示時は簡易計算結果を表示
- 詳細なシミュレーション結果は非同期で更新
- スケルトンスクリーンで読み込み状態を表示

## 5. アクセシビリティ考慮

### 5.1 フォーム
- 適切なラベルとaria属性
- キーボードナビゲーション対応
- エラーメッセージの適切な表示

### 5.2 結果表示
- 色だけでなく数値でも勝率を表示
- スクリーンリーダー対応のテーブル構造
- フォーカス管理

## 6. レスポンシブデザイン

### 6.1 ブレークポイント
- モバイル: 〜640px
- タブレット: 641px〜1024px
- デスクトップ: 1025px〜

### 6.2 レイアウト
- モバイル: 縦積みレイアウト
- タブレット以上: 2カラムレイアウト（入力と結果）
- テーブルは横スクロール可能