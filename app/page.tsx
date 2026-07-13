"use client";

import { useEffect, useMemo, useState } from "react";

type Question = { id: number; category: string; question: string; options: string[]; answer: number; explanation: string; image: string };
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const images = `
meme_20023.png meme_20024.png meme_20025.png
meme_aida_01_shengqi.png meme_aida_02_maimeng.png meme_aida_03_jingxia.png meme_aida_04_ganga.png meme_aida_05_nihao.png meme_aida_06_zaijian.png meme_aida_07_ok.png meme_aida_08_yihuo.png meme_aida_09_ku.png meme_aida_10_chongya.png meme_aida_11_shoudao.png meme_aida_12_re.png meme_aida_13_haha.png meme_aida_14_chigua.png meme_aida_15_tantou.png meme_aida_16_xiaban.png
meme_aisling_01_kun.png meme_aisling_02_happy.png meme_aisling_03_mad.png meme_aisling_04_dai.png meme_aisling_05_research.png
meme_akatsuki_01.png meme_akatsuki_02.png meme_akatsuki_03.png meme_akatsuki_04.png meme_akatsuki_05.png
meme_akigumo_01_zixin.png meme_akigumo_02_ganga.png meme_akigumo_03_jingya.png meme_akigumo_04_tiaopi.png
meme_baselard_01_sleep.png meme_baselard_02_scare.png meme_baselard_03_snicker.png meme_baselard_04_angry.png meme_baselard_05_poss.png meme_baselard_06_proud.png
meme_beta_01_flurried.png meme_beta_02_applaud.png meme_beta_03_faint.png meme_beta_04_cry.png meme_beta_05_drink.png meme_beta_06_milk.png meme_beta_07_swim.png meme_beta_08_cheer.png
meme_betaii_01_embarrassed.png meme_betaii_02_interrupt.png meme_betaii_03_confidence.png meme_betaii_04_angry.png
meme_blackrockshooter_01.png meme_blackrockshooter_02.png meme_blackrockshooter_03.png meme_blackrockshooter_04.png
meme_borzoi_01_kill.png meme_borzoi_02_grievance.png meme_borzoi_03_cry.png meme_borzoi_04_peek.png meme_borzoi_05_silent.png meme_borzoi_06_good.png
meme_breaker_01_fight.png meme_breaker_02_cry.png meme_breaker_03_wuyu.png meme_breaker_04_huang.png meme_breaker_05_tuan.png meme_breaker_06_dianyu.png meme_breaker_07_chonglang.png meme_breaker_08_diaoyu.png meme_breaker_09_wangyuanjing.png meme_breaker_10_Boat.png meme_breaker_11_Warning.png meme_breaker_12_OK.png meme_breaker_13_YEAH.png
meme_cammy_01_ye.png meme_cammy_02_doubt.png meme_cammy_03_sleep.png meme_cammy_04_music.png meme_cammy_05_zhui.png
meme_cherub_01_anger.png meme_cherub_02_laugh.png meme_cherub_03_peaceful.png meme_cherub_04_pique.png meme_cherub_05_readpapers.png meme_cherub_06_shrug.png meme_cherub_07_sleep.png meme_cherub_08_stareblankly.png meme_cherub_09_emo.png meme_cherub_10_haixiu.png meme_cherub_11_hush.png meme_cherub_12_kunao.png meme_cherub_13_lue.png meme_cherub_14_power.png meme_cherub_15_scorn.png meme_cherub_16_yuannian.png
meme_darkgalahad_01_angry.png meme_darkgalahad_02_hei.png meme_darkgalahad_03_listless.png meme_darkgalahad_04_silent.png meme_darkgalahad_05_grimace.png
`.trim().split(/\s+/).map(name=>`${basePath}/characters/${name}`);

const baseQuestions: Question[] = [
  {id:1,category:"基本",question:"『星の翼』の中心となる対戦形式は？",options:["3対3","2対2","5対5","バトルロイヤル"],answer:1,explanation:"1v1と2v2が主軸。特にアーケードスタイルの2v2がゲームの核です。",image:images[0]},
  {id:2,category:"基本",question:"戦闘空間の特徴として正しいものは？",options:["地上のみ","横スクロール","360°の空中戦","ターン制"],answer:2,explanation:"地上だけでなく、上下を含む立体的な空中戦を楽しめます。",image:images[5]},
  {id:3,category:"勝敗",question:"チームの総コストを使い切るとどうなる？",options:["引き分け","覚醒する","敗北する","延長戦になる"],answer:2,explanation:"撃破されるたびに機体コスト分が減り、戦力ゲージが尽きると敗北です。",image:images[3]},
  {id:4,category:"勝敗",question:"制限時間が0になったときの扱いは？",options:["全員敗北","残耐久で判定","与ダメージで判定","必ず延長"],answer:0,explanation:"タイムオーバーは残耐久の比較ではなく、全員敗北扱いになります。",image:images[3]},
  {id:5,category:"操作",question:"ロック中の相手の射撃を避ける基本行動は？",options:["ステップ","ポーズ","チャット","機体変更"],answer:0,explanation:"ステップは誘導を切る代表的な回避行動。相手の攻撃タイミングを見るのが重要です。",image:images[2]},
  {id:6,category:"操作",question:"ブーストダッシュが主に担う役割は？",options:["武装の回復","高速移動","味方の蘇生","コスト増加"],answer:1,explanation:"ブーストを使い、接近・離脱・位置取りを素早く行います。",image:images[4]},
  {id:7,category:"操作",question:"ブーストを使い切った着地のリスクは？",options:["隙が大きくなる","無敵になる","弾が全回復する","覚醒が最大になる"],answer:0,explanation:"オーバーヒート着地は硬直が大きく、狙われやすくなります。",image:images[0]},
  {id:8,category:"操作",question:"射撃→別行動へ連続してつなぐ仕組みを何と呼ぶ？",options:["リスポーン","キャンセル","リザルト","マッチング"],answer:1,explanation:"行動をキャンセルして次の行動へつなぐことが、攻防の基本になります。",image:images[1]},
  {id:9,category:"戦術",question:"2v2で『ダブルロック』とは？",options:["2人で同じ敵を見る","敵がいない状態","武装を2つ使う","味方を攻撃する"],answer:0,explanation:"味方と同じ敵を狙う状態。集中攻撃が強い一方、もう一方の敵への警戒も必要です。",image:images[6]},
  {id:10,category:"戦術",question:"味方と極端に離れすぎると起こりやすいことは？",options:["弾が増える","各個撃破される","コストが下がる","自動回復する"],answer:1,explanation:"2対1を作られやすくなります。味方を助けられる距離感が大切です。",image:images[3]},
  {id:11,category:"戦術",question:"高コスト機が先に落ちる展開で特に注意することは？",options:["コストオーバー","画質設定","BGM音量","機体カラー"],answer:0,explanation:"残り戦力ゲージが機体コストを下回ると、再出撃時の耐久が減る場合があります。",image:images[1]},
  {id:12,category:"戦術",question:"射撃戦で重要な『軸を合わせる』の意味は？",options:["相手の進行方向に射線を置く","画面を回転する","味方と同じ色にする","高度を0にする"],answer:0,explanation:"相手の移動先へ弾が通るよう、自分の位置と射線を調整する考え方です。",image:images[5]},
  {id:13,category:"覚醒",question:"スターバースト（覚醒）の主な効果は？",options:["一時的な性能強化","試合を終了する","機体を永久強化","相手を操作する"],answer:0,explanation:"ゲージを使って一定時間、機動力や攻撃性能などを強化します。",image:images[4]},
  {id:14,category:"覚醒",question:"格闘覚醒（F覚）が得意とするものは？",options:["格闘の強化と接近","通信速度の改善","味方HPの常時回復","時間停止"],answer:0,explanation:"格闘性能・ダメージ・機動力を伸ばし、射撃から格闘へのキャンセルも解放します。",image:images[6]},
  {id:15,category:"覚醒",question:"支援覚醒（C覚）の発動時、味方に与える代表的な効果は？",options:["ブーストと弾薬の回復","コスト増加","強制自爆","ロック解除"],answer:0,explanation:"発動時に相方のブーストと弾薬を回復し、覚醒ゲージ面でも支援します。",image:images[8]},
  {id:16,category:"覚醒",question:"覚醒を抱えたまま撃墜されることが危険な理由は？",options:["強力な逆転手段を使えない","機体が消える","操作不能になる","ランクが即降格する"],answer:0,explanation:"覚醒は攻め・逃げ・ダメージ軽減の重要な切り札。使うタイミング管理が重要です。",image:images[0]},
  {id:17,category:"環境",question:"PC版の最低メモリ要件は？",options:["2GB","4GB","16GB","32GB"],answer:1,explanation:"Steam掲載の最低要件は4GB RAM、推奨は8GB RAMです。",image:images[1]},
  {id:18,category:"環境",question:"Steam版の最低ストレージ空き容量は？",options:["1GB","4GB","20GB","100GB"],answer:1,explanation:"最低要件は4GB、推奨要件では8GBの空き容量です。",image:images[2]},
  {id:19,category:"環境",question:"Steam版について正しい説明は？",options:["他アカウントから引継ぎ不可","必ずスマホ版と共有","オフライン専用","VR必須"],answer:0,explanation:"Steamストアでは、Steam版は他のアカウントと引き継げないと案内されています。",image:images[7]},
  {id:20,category:"総合",question:"2v2で安定して勝つために最も大切なのは？",options:["味方との連携とコスト管理","常に単独突撃","ブーストを常時使い切る","相手を見ない"],answer:0,explanation:"位置取り、ロック、覚醒、残コストを味方と噛み合わせることが勝利への近道です。",image:images[9]},
];

const tipQuestions: Question[] = [
  {id:101,category:"Tips仕様",question:"『星の翼』のゲーム処理は、1秒あたり何fps計算？",options:["30fps","60fps"],answer:0,explanation:"Tipsでは1秒30fps計算とされています。",image:images[20]},
  {id:102,category:"Tips仕様",question:"覚醒の機動力補正が適用されるのは？",options:["BDだけ","歩行速度にも適用"],answer:1,explanation:"機動力補正は歩行速度にも乗ります。",image:images[21]},
  {id:103,category:"Tips仕様",question:"全キャラクターの歩行速度の基準値は？",options:["約7.95m/s","約15.9m/s"],answer:0,explanation:"歩行速度は7.95±0.1m/sで、差があっても微差とされています。",image:images[22]},
  {id:104,category:"Tips仕様",question:"ブーストゲージの色が変わる基準は？",options:["残量の割合","残量の絶対値"],answer:1,explanation:"割合ではなく絶対量で変化し、約50.4未満でオレンジ、約25未満で赤になります。",image:images[23]},
  {id:105,category:"Tips仕様",question:"持続BDの燃費は全キャラ共通？",options:["共通","キャラごとに異なる"],answer:1,explanation:"持続BDにはキャラクターごとの燃費が設定されています。",image:images[24]},
  {id:106,category:"Tips仕様",question:"BDが絡む後退時に適用されるペナルティは？",options:["速度とBG消費に20%","ダメージに20%"],answer:0,explanation:"速度とブーストゲージ消費量の両方に20%の後退ペナルティが適用されます。",image:images[25]},
  {id:107,category:"Tips仕様",question:"前進BD開始時のブースト消費量はおよそ？",options:["約10","約30"],answer:0,explanation:"前進BDの消費は固定値で約10です。",image:images[26]},
  {id:108,category:"Tips仕様",question:"青ゲージで着地した場合のBG回復までの時間は？",options:["9F","20F"],answer:0,explanation:"青9F、オレンジ13F、赤15F、オーバーヒート20Fです。",image:images[27]},
  {id:109,category:"Tips仕様",question:"オーバーヒート着地のBG回復時間は？",options:["13F","20F"],answer:1,explanation:"通常のオーバーヒート着地は20Fです。ステップ後ならさらに4F加わります。",image:images[28]},
  {id:110,category:"Tips仕様",question:"BD→BD間の硬直はおよそ何F？",options:["10F","21F"],answer:0,explanation:"BD間は約10F、ステップ間は約21Fです。",image:images[29]},
  {id:111,category:"Tips仕様",question:"同じゲージ色なら、残量が違っても着地硬直は？",options:["同じ","残量に比例して変わる"],answer:0,explanation:"同じ色の範囲内なら、残り容量が違っても硬直時間は同じです。",image:images[30]},
  {id:112,category:"Tips仕様",question:"格闘キャンセル時のステップ距離補正は？",options:["1.25倍","2倍"],answer:0,explanation:"格闘キャンセル時のステップ距離は一律1.25倍です。",image:images[31]},
  {id:113,category:"Tips仕様",question:"射撃攻撃が発生する位置は？",options:["キャラの中心","武装の銃口"],answer:1,explanation:"射撃は銃口から発生するため、武装によっては接射が当たらない場合があります。",image:images[32]},
  {id:114,category:"Tips仕様",question:"非ダウン時の補正残存時間は？",options:["40F","86F"],answer:1,explanation:"非ダウン時の補正残存時間は86Fです。",image:images[33]},
  {id:115,category:"Tips仕様",question:"通常ガードの発生は何F？",options:["1F","17F"],answer:0,explanation:"通常ガードは1F、強ガードは17Fで発生します。",image:images[34]},
  {id:116,category:"Tips仕様",question:"通常時のガード持続時間は？",options:["20F","40F"],answer:1,explanation:"通常時は40F、オーバーヒート時は20Fです。",image:images[35]},
  {id:117,category:"Tips仕様",question:"ガード成功時に増加する覚醒ゲージは？",options:["3%","10%"],answer:0,explanation:"ガード成功時は覚醒ゲージが3%上昇します。",image:images[36]},
  {id:118,category:"Tips仕様",question:"覚醒時間はコストや覚醒種類で変わる？",options:["変わる","変わらない"],answer:1,explanation:"Tipsではコスト・覚醒種類による覚醒時間の差はないとされています。",image:images[37]},
  {id:119,category:"Tips仕様",question:"根性補正の被ダメージ軽減率は最大何%？",options:["17%","30%"],answer:0,explanation:"根性補正による軽減率は最大17%です。",image:images[38]},
  {id:120,category:"Tips仕様",question:"ダウン中・誤射時に受けるダメージの低下率は？",options:["25%","75%"],answer:1,explanation:"ダウン中と誤射時は受けるダメージが75%低下します。",image:images[39]},
  {id:121,category:"Tips仕様",question:"訓練場のタイル1枚の大きさは？",options:["3m × 3m","6m × 6m"],answer:1,explanation:"訓練場のタイルは6m×6mです。",image:images[40]},
  {id:122,category:"Tips仕様",question:"グリフィンの飛翔中のBG消費は毎秒およそ？",options:["約10","約50"],answer:0,explanation:"上昇・下降で約10、飛翔中も毎秒約10消費します。",image:images[41]},
  {id:123,category:"Tips仕様",question:"ヤミンのラディアント強化による機動力補正は？",options:["1.05倍","1.2倍"],answer:1,explanation:"ラディアントでは機動力が1.2倍になります。",image:images[42]},
  {id:124,category:"Tips仕様",question:"ヴァルキア復活時のおよその無敵時間は？",options:["0.75～1秒","3～4秒"],answer:0,explanation:"復活時の無敵時間はおよそ0.75～1秒です。",image:images[43]},
  {id:125,category:"Tips仕様",question:"チンニのサブ格闘使用時のBG消費はおよそ？",options:["約3","約30"],answer:0,explanation:"チンニのサブ格闘は使用時にブーストゲージを約3消費します。",image:images[44]},
  {id:126,category:"Tips仕様",question:"ライン極限進化で無限化する武装は？",options:["メイン射撃","サブ格闘"],answer:1,explanation:"極限進化時はサブ格闘の弾数が無限化します。",image:images[45]},
  {id:127,category:"Tips仕様",question:"稲の爆発技『往生の扉』によるBG回復量は？",options:["2割","全回復"],answer:0,explanation:"ブーストゲージを2割、18ポイント分回復します。",image:images[46]},
  {id:128,category:"Tips仕様",question:"ノーラのオーバーロード終了後に得られる覚醒ゲージは最大？",options:["11%","50%"],answer:0,explanation:"充電モーションを完遂すると2%+2%+2%+5%で最大11%取得します。",image:images[47]},
  {id:129,category:"Tips仕様",question:"キャミィ『Let's Rock!』中のリロード時間は？",options:["通常の1/2","通常の2倍"],answer:0,explanation:"効果中はリロード時間が1/2になり、常時誘導切りなども得ます。",image:images[48]},
  {id:130,category:"Tips仕様",question:"フィービーのバケツ被せによる赤ロック距離の変化は？",options:["10～15%短縮","10～15%延長"],answer:0,explanation:"バケツ被せ効果で赤ロック距離が10～15%短縮されます。",image:images[49]},
];

const characterQuestions: Question[] = [
  {id:201,category:"キャラクターDB",question:"グリフィンのコストは？",options:["2.0","2.5","3.0","1.5"],answer:2,explanation:"StarwardDB掲載値では、グリフィンはコスト3.0です。",image:images[50]},
  {id:202,category:"キャラクターDB",question:"ヤミンのコストは？",options:["1.5","2.5"],answer:0,explanation:"ヤミンはコスト1.5のキャラクターです。",image:images[51]},
  {id:203,category:"キャラクターDB",question:"射撃武装の登録数が16件なのは？",options:["アンジェリス","アイーダ"],answer:0,explanation:"アンジェリスは射撃16件、アイーダは射撃4件です。",image:images[52]},
  {id:204,category:"キャラクターDB",question:"格闘武装の登録数が22件なのは？",options:["ノーラ","ダークスター"],answer:0,explanation:"ノーラは格闘22件で、データベース内でも格闘項目が多いキャラクターです。",image:images[53]},
  {id:205,category:"キャラクターDB",question:"グリフィンの格闘武装登録数は？",options:["6件","12件","23件","3件"],answer:2,explanation:"グリフィンは射撃7件・格闘23件と掲載されています。",image:images[54]},
  {id:206,category:"キャラクターDB",question:"プリシュカの射撃武装登録数は？",options:["5件","15件"],answer:1,explanation:"プリシュカは射撃15件・格闘6件です。",image:images[55]},
  {id:207,category:"キャラクターDB",question:"キャンセルルートの登録数が0件なのは？",options:["ヴァーチェ","チンニ"],answer:0,explanation:"ヴァーチェはキャンセル0件、チンニは9件と掲載されています。",image:images[56]},
  {id:208,category:"キャラクターDB",question:"アカツキのキャンセルルート登録数は？",options:["3件","11件"],answer:1,explanation:"アカツキはキャンセル11件です。",image:images[57]},
  {id:209,category:"キャラクターDB",question:"ヒカリの格闘武装登録数は？",options:["6件","17件"],answer:0,explanation:"ヒカリは射撃7件・格闘6件です。",image:images[58]},
  {id:210,category:"キャラクターDB",question:"ラインの格闘武装登録数は？",options:["2件","20件"],answer:0,explanation:"ラインは射撃10件・格闘2件です。",image:images[59]},
  {id:211,category:"キャラクターDB",question:"セイレンの射撃／格闘登録数の組み合わせは？",options:["射撃13・格闘19","射撃19・格闘13"],answer:0,explanation:"セイレンは射撃13件・格闘19件です。",image:images[60]},
  {id:212,category:"キャラクターDB",question:"十八号のコストは？",options:["2.0","2.5","3.0","1.5"],answer:1,explanation:"十八号はコスト2.5です。",image:images[61]},
  {id:213,category:"キャラクターDB",question:"スティレットのデータとして正しいものは？",options:["コスト2.0／コラボ","コスト3.0／期間限定"],answer:0,explanation:"スティレットはコスト2.0のコラボキャラクターです。",image:images[62]},
  {id:214,category:"キャラクターDB",question:"ボルゾイのデータとして正しいものは？",options:["コスト2.0／シーズンパス","コスト1.5／コラボ"],answer:0,explanation:"ボルゾイはコスト2.0／シーズンパスと掲載されています。",image:images[63]},
  {id:215,category:"キャラクターDB",question:"レキの格闘武装登録数は？",options:["8件","21件"],answer:1,explanation:"レキは射撃4件・格闘21件です。",image:images[64]},
  {id:216,category:"キャラクターDB",question:"スノーウォルの格闘武装登録数は？",options:["2件","12件"],answer:0,explanation:"スノーウォルは射撃7件・格闘2件です。",image:images[65]},
  {id:217,category:"キャラクターDB",question:"ヤミンの格闘武装登録数は？",options:["5件","18件"],answer:1,explanation:"ヤミンは射撃4件・格闘18件です。",image:images[66]},
  {id:218,category:"キャラクターDB",question:"シュウウの覚醒技登録数は？",options:["1件","2件"],answer:1,explanation:"シュウウは覚醒2件と掲載されています。",image:images[67]},
  {id:219,category:"キャラクターDB",question:"ヴォイドセーバーのデータとして正しいものは？",options:["コスト3.0／期間限定","コスト2.0／シーズンパス"],answer:0,explanation:"ヴォイドセーバーはコスト3.0／期間限定です。",image:images[68]},
  {id:220,category:"キャラクターDB",question:"フィービーのデータとして正しいものは？",options:["コスト2.0／期間限定","コスト2.5／コラボ"],answer:0,explanation:"フィービーはコスト2.0／期間限定です。",image:images[69]},
];

const initialQuestions: Question[] = [...baseQuestions, ...tipQuestions, ...characterQuestions];

export default function Home({editorOnly=false}:{editorOnly?:boolean}={}) {
  const [screen,setScreen]=useState<"home"|"quiz"|"creator">(editorOnly?"creator":"home");
  const [questions,setQuestions]=useState<Question[]>(initialQuestions);
  const [storageReady,setStorageReady]=useState(false);
  const [order,setOrder]=useState(initialQuestions);
  const [index,setIndex]=useState(0); const [score,setScore]=useState(0);
  const [selected,setSelected]=useState<number|null>(null); const [finished,setFinished]=useState(false);
  const [answers,setAnswers]=useState<number[]>([]);
  const [draft,setDraft]=useState<Question|null>(null);
  const q=order[index];
  const rank=score>=18?"星間エース":score>=14?"熟練スターライダー":score>=9?"ルーキーパイロット":"訓練生";
  const categories=useMemo(()=>Array.from(new Set(questions.map(x=>x.category))),[questions]);
  useEffect(()=>{try{const saved=localStorage.getItem("starward-quiz-questions-v1");if(saved){const parsed:Question[]=JSON.parse(saved);const savedIds=new Set(parsed.map(q=>q.id));setQuestions([...parsed,...characterQuestions.filter(q=>!savedIds.has(q.id))])}}catch{}finally{setStorageReady(true)}},[]);
  useEffect(()=>{if(storageReady)localStorage.setItem("starward-quiz-questions-v1",JSON.stringify(questions))},[questions,storageReady]);

  function start(){const next=[...questions].sort(()=>Math.random()-.5).slice(0,20);setOrder(next);setIndex(0);setScore(0);setAnswers([]);setSelected(null);setFinished(false);setScreen("quiz")}
  function choose(i:number){setSelected(i)}
  function next(){if(selected===null)return;setAnswers(prev=>[...prev,selected]);if(selected===q.answer)setScore(s=>s+1);if(index===order.length-1){setFinished(true)}else{setIndex(i=>i+1);setSelected(null)}}
  function saveDraft(){if(!draft)return;setQuestions(prev=>{const found=prev.some(x=>x.id===draft.id);return found?prev.map(x=>x.id===draft.id?draft:x):[...prev,draft]});setDraft(null)}
  function exportQuiz(){const blob=new Blob([JSON.stringify(questions,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="starward-quiz.json";a.click();URL.revokeObjectURL(a.href)}
  function importQuiz(file:File){const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!Array.isArray(data))throw new Error();setQuestions(data);alert(`${data.length}問を復元しました`)}catch{alert("クイズJSONを読み込めませんでした")}};reader.readAsText(file)}

  return <main>
    <div className="stars"/><header><button className="brand" onClick={()=>editorOnly?undefined:setScreen("home")}><span>STARWARD</span><b>{editorOnly?"星の翼 クイズ編集室":"星の翼 仕様クイズ"}</b></button><nav>{editorOnly?<a href={`${basePath}/`} target="_blank" rel="noreferrer">公開用を見る ↗</a>:<span className="public-badge">PUBLIC QUIZ</span>}</nav></header>

    {!editorOnly&&screen==="home"&&<section className="hero">
      <div className="hero-copy"><p className="eyebrow">STARWARD SYSTEM CHECK</p><h1>その知識、<br/><em>星を翔ける。</em></h1><p className="lead">基本操作から覚醒・コスト管理まで。<br/>全20問で、あなたの「星の翼」理解度をテスト。</p><div className="chips">{["全20問","2択・4択","最後に解説"].map(x=><span key={x}>{x}</span>)}</div><div className="shuffle always"><i/> 毎回ランダムに20問を出題</div><button className="primary" onClick={start}>ミッション開始 <span>›</span></button></div>
      <div className="hero-art"><div className="orbit one"/><div className="orbit two"/><div className="glow"/><img src={images[4]} alt="星の翼 キャラクター"/><div className="status-card"><span>KNOWLEDGE TEST</span><b>20 <small>QUESTIONS</small></b><div><i/><i/><i/><i/><i/></div></div></div>
      <div className="corner-note">SYSTEM<br/>ONLINE <b>●</b></div>
    </section>}

    {!editorOnly&&screen==="quiz"&&!finished&&q&&<section className="quiz-shell">
      <div className="quiz-top"><button onClick={()=>setScreen("home")}>← 終了</button><div><span>{String(index+1).padStart(2,"0")}</span> / {String(order.length).padStart(2,"0")}</div><b>SCORE {score}</b></div><div className="progress"><i style={{width:`${((index+(selected!==null?1:0))/order.length)*100}%`}}/></div>
      <div className="quiz-grid"><div className="question-card"><p className="category">// {q.category.toUpperCase()}</p><h2>{q.question}</h2><div className="options">{q.options.map((o,i)=><button key={o} className={selected===i?"chosen":""} onClick={()=>choose(i)}><span>{String.fromCharCode(65+i)}</span>{o}<b>{selected===i?"●":""}</b></button>)}</div><div className="answer-action"><p>{selected===null?"回答を1つ選択してください":"回答を選択しました。正解は最後にまとめて表示されます。"}</p><button className="primary" disabled={selected===null} onClick={next}>{index===order.length-1?"回答を完了":"回答して次へ"} ›</button></div></div><aside className="quiz-character"><div className="scan"/><img src={q.image} alt="キャラクターリアクション"/><span>Q-{String(index+1).padStart(2,"0")}</span></aside></div>
    </section>}

    {!editorOnly&&screen==="quiz"&&finished&&<section className="result-wrap"><div className="result"><p className="eyebrow">MISSION COMPLETE</p><h2>{rank}</h2><div className="score-ring"><b>{score}</b><span>/ {order.length}</span></div><p>{score>=14?"見事な知識です。戦場でもその判断力を！":"下の回答一覧を振り返って、もう一度挑戦してみよう。"}</p><img src={score>=14?images[9]:images[0]} alt="結果リアクション"/><div><button className="primary" onClick={start}>もう一度挑戦</button><button className="secondary" onClick={()=>setScreen("home")}>ホームへ</button></div></div><div className="answer-review"><div className="review-head"><p className="eyebrow">ANSWER REVIEW</p><h2>回答一覧</h2><span>{score} / {order.length} 正解</span></div>{order.map((item,i)=>{const picked=answers[i];const ok=picked===item.answer;return <article key={item.id} className={ok?"review-ok":"review-ng"}><div className="review-number"><span>Q{String(i+1).padStart(2,"0")}</span><b>{ok?"✓ 正解":"× 不正解"}</b></div><div className="review-body"><h3>{item.question}</h3><p className="your-answer">あなたの回答：<b>{item.options[picked]}</b></p>{!ok&&<p className="right-answer">正解：<b>{item.options[item.answer]}</b></p>}<p className="review-explain">{item.explanation}</p></div></article>})}</div></section>}

    {editorOnly&&screen==="creator"&&<section className="creator"><div className="creator-head"><div><p className="eyebrow">QUIZ BUILDER</p><h1>クイズ作成</h1><p>変更内容はこのブラウザへ自動保存されます。</p></div><div><label className="import-button">JSONから復元<input type="file" accept="application/json,.json" onChange={e=>{const f=e.target.files?.[0];if(f)importQuiz(f);e.target.value=""}}/></label><button className="secondary" onClick={exportQuiz}>JSON書き出し</button><button className="primary" onClick={()=>setDraft({id:Date.now(),category:"カスタム",question:"",options:["","","",""],answer:0,explanation:"",image:images[0]})}>＋ 新しい問題</button></div></div><div className="autosave-note">● 自動保存 ON　／　現在の問題データを保持中</div><div className="creator-stats"><b>{questions.length}<small>問題数</small></b><span>{categories.map(c=><i key={c}>{c}</i>)}</span></div><div className="question-list">{questions.map((item,i)=><article key={item.id}><span>{String(i+1).padStart(2,"0")}</span><img src={item.image} alt=""/><div><small>{item.category}</small><b>{item.question}</b><p>正解：{item.options[item.answer]}</p></div><button onClick={()=>setDraft({...item,options:[...item.options]})}>編集</button><button className="delete" aria-label="削除" onClick={()=>setQuestions(qs=>qs.filter(x=>x.id!==item.id))}>×</button></article>)}</div></section>}

    {draft&&<div className="editor-overlay"><section className="editor-dialog">
      <button type="button" className="editor-close" onClick={()=>setDraft(null)}>×</button>
      <header className="editor-title"><p>QUESTION EDITOR</p><h2>問題を編集</h2></header>
      <div className="editor-columns"><div className="editor-fields">
        <label><span>カテゴリ</span><input value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}/></label>
        <label><span>問題文</span><textarea value={draft.question} onChange={e=>setDraft({...draft,question:e.target.value})}/></label>
        <div className="option-count"><span>選択肢の数</span><div><button type="button" className={draft.options.length===2?"active":""} onClick={()=>setDraft({...draft,options:draft.options.slice(0,2),answer:draft.answer>1?0:draft.answer})}>2択</button><button type="button" className={draft.options.length===4?"active":""} onClick={()=>setDraft({...draft,options:[...draft.options,"",""] .slice(0,4)})}>4択</button></div></div>
        <div className="editor-choices">{draft.options.map((o,i)=><label key={i} className={draft.answer===i?"answer":""}><input type="radio" name="correct" checked={draft.answer===i} onChange={()=>setDraft({...draft,answer:i})}/><b>{String.fromCharCode(65+i)}</b><input value={o} placeholder={`選択肢 ${i+1}`} onChange={e=>{const ops=[...draft.options];ops[i]=e.target.value;setDraft({...draft,options:ops})}}/></label>)}</div>
        <label><span>解説</span><textarea value={draft.explanation} onChange={e=>setDraft({...draft,explanation:e.target.value})}/></label>
      </div><aside className="editor-images"><div className="image-toolbar"><span>リアクション画像 <b>{images.length}種類</b></span><button type="button" onClick={()=>{const pool=images.filter(im=>im!==draft.image);setDraft({...draft,image:pool[Math.floor(Math.random()*pool.length)]})}}>⟳ ランダム選択</button></div><div className="reaction-grid">{images.map((im,i)=><button type="button" key={im} title={`リアクション ${i+1}`} className={draft.image===im?"selected":""} onClick={()=>setDraft({...draft,image:im})}><img src={im} alt={`リアクション ${i+1}`}/></button>)}</div></aside></div>
      <div className="editor-footer"><button type="button" className="secondary" onClick={()=>setDraft(null)}>キャンセル</button><button type="button" className="primary" disabled={!draft.question||draft.options.some(x=>!x)} onClick={saveDraft}>問題を保存</button></div>
    </section></div>}
    <footer><span>STARWARD KNOWLEDGE ARCHIVE</span><b>非公式ファンメイドクイズ</b></footer>
  </main>
}
