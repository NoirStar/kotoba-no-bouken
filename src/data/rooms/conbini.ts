import type { RoomDef } from "@/types/room"

/**
 * 편의점 (コンビニ) Room 데이터
 * MVP 첫 번째 스테이지
 */
export const conbiniRoom: RoomDef = {
  id: "conbini",
  name: "コンビニ",
  nameKo: "편의점",
  icon: "store",
  description: "일본 편의점에서 쇼핑 체험! 점원과 대화하며 물건을 사보자.",
  tileMapKey: "conbini-map",
  bgColor: 0xfff8e7,
  width: 16,
  height: 12,
  npcs: [
    {
      id: "clerk-tanaka",
      name: "田中さん",
      nameReading: "たなかさん",
      role: "店員 (점원)",
      personality:
        "20대 여성. 밝고 친절한 편의점 점원. 항상 정중한 경어(敬語)를 사용하며, 외국인 손님에게도 천천히 알기 쉽게 말해준다. 「いらっしゃいませ！」가 입버릇.",
      spriteKey: "npc-clerk",
      position: { x: 12, y: 3 },
      direction: "down",
    },
    {
      id: "customer-suzuki",
      name: "鈴木さん",
      nameReading: "すずきさん",
      role: "お客さん (손님)",
      personality:
        "30대 남성 회사원. 점심 시간에 편의점에 들른 직장인. 약간 급하지만 친절하다. 반말과 경어를 섞어서 쓴다.",
      spriteKey: "npc-customer1",
      position: { x: 5, y: 6 },
      direction: "right",
    },
    {
      id: "customer-yuki",
      name: "ゆきちゃん",
      nameReading: "ゆきちゃん",
      role: "お客さん (손님)",
      personality:
        "10대 후반 여고생. 활발하고 귀여운 말투를 쓴다. 유행어를 자주 사용. 반말 위주로 대화한다.",
      spriteKey: "npc-customer2",
      position: { x: 8, y: 8 },
      direction: "left",
    },
  ],
  quests: [
    // ⭐ EASY
    {
      id: "conbini-easy-1",
      roomId: "conbini",
      title: "ラーメンを買おう",
      titleKo: "라면 사기",
      description: "점원에게 라면을 사고 싶다고 말해보세요.",
      difficulty: "easy",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "라면/ラーメン/ramen 구매 의사를 점원에게 전달. 「ください」「買いたい」「これ」등의 표현 사용.",
      hints: [
        "「すみません」で声をかけよう",
        "「ラーメンをください」と言ってみよう",
        "「これをお願いします」でもOK",
      ],
      grammarPoint: "〜をください (〜을/를 주세요)",
      rewardVocab: [
        { word: "ラーメン", reading: "ラーメン", meaning: "라면" },
        { word: "ください", reading: "ください", meaning: "주세요" },
      ],
      order: 1,
    },
    {
      id: "conbini-easy-2",
      roomId: "conbini",
      title: "おにぎりを探そう",
      titleKo: "주먹밥 찾기",
      description: "점원에게 주먹밥이 어디에 있는지 물어보세요.",
      difficulty: "easy",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "주먹밥/おにぎり의 위치를 질문. 「どこ」「ありますか」등의 표현으로 위치 질문.",
      hints: [
        "「おにぎりはどこですか？」",
        "「おにぎりはありますか？」",
        "場所(ばしょ)を聞いてみよう",
      ],
      grammarPoint: "〜はどこですか (〜은/는 어디입니까)",
      rewardVocab: [
        { word: "おにぎり", reading: "おにぎり", meaning: "주먹밥" },
        { word: "棚", reading: "たな", meaning: "선반" },
      ],
      order: 2,
    },
    {
      id: "conbini-easy-3",
      roomId: "conbini",
      title: "飲み物を選ぼう",
      titleKo: "음료 고르기",
      description: "점원에게 추천 음료를 물어보세요.",
      difficulty: "easy",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "음료/飲み物 추천을 요청. 「おすすめ」「何がいい」등으로 추천 질문.",
      hints: [
        "「おすすめの飲み物はありますか？」",
        "「何がおすすめですか？」",
        "「冷たい飲み物はどこですか？」",
      ],
      grammarPoint: "おすすめは〜ですか (추천은 〜입니까)",
      rewardVocab: [
        { word: "飲み物", reading: "のみもの", meaning: "음료" },
        { word: "おすすめ", reading: "おすすめ", meaning: "추천" },
      ],
      order: 3,
    },
    // ⭐⭐ NORMAL
    {
      id: "conbini-normal-1",
      roomId: "conbini",
      title: "お弁当を温めて",
      titleKo: "도시락 데우기",
      description: "점원에게 도시락을 전자렌지로 데워달라고 부탁해보세요.",
      difficulty: "normal",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "도시락/お弁当을 전자렌지/温める로 데워달라는 부탁 표현. 「温めてください」「温めてもらえますか」등.",
      hints: [
        "「お弁当を温めてください」",
        "「温めてもらえますか？」(데워줄 수 있나요?)",
        "「チンしてください」(구어체) でもOK",
      ],
      grammarPoint: "〜てもらえますか (〜해 줄 수 있나요?)",
      rewardVocab: [
        { word: "温める", reading: "あたためる", meaning: "데우다" },
        { word: "電子レンジ", reading: "でんしレンジ", meaning: "전자렌지" },
      ],
      order: 1,
    },
    {
      id: "conbini-normal-2",
      roomId: "conbini",
      title: "袋をもらおう",
      titleKo: "봉투 받기",
      description: "계산할 때 봉투가 필요하다고 말해보세요.",
      difficulty: "normal",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "봉투/袋 요청. 「袋をお願いします」「袋をください」등의 표현.",
      hints: [
        "「袋をお願いします」",
        "「レジ袋はありますか？」",
        "有料(ゆうりょう)=유료 かもしれません",
      ],
      grammarPoint: "〜をお願いします (〜을 부탁합니다)",
      rewardVocab: [
        { word: "袋", reading: "ふくろ", meaning: "봉투" },
        { word: "有料", reading: "ゆうりょう", meaning: "유료" },
      ],
      order: 2,
    },
    {
      id: "conbini-normal-3",
      roomId: "conbini",
      title: "ポイントカード",
      titleKo: "포인트카드",
      description: "포인트카드에 대해 점원과 대화해보세요.",
      difficulty: "normal",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "포인트카드에 대한 질문이나 응답. 「ポイントカード」「持っていません」「大丈夫です」등.",
      hints: [
        "점원이 「ポイントカードはお持ちですか？」라고 물을 수 있어요",
        "「持っていません」(안 가지고 있어요)",
        "「大丈夫です」(괜찮아요)",
      ],
      grammarPoint: "〜をお持ちですか (〜을 가지고 계십니까)",
      rewardVocab: [
        { word: "持つ", reading: "もつ", meaning: "가지다" },
        { word: "大丈夫", reading: "だいじょうぶ", meaning: "괜찮다" },
      ],
      order: 3,
    },
    // ⭐⭐⭐ HARD
    {
      id: "conbini-hard-1",
      roomId: "conbini",
      title: "トイレを借りる",
      titleKo: "화장실 빌리기",
      description: "점원에게 화장실을 빌려도 될지 정중하게 물어보세요.",
      difficulty: "hard",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "화장실/トイレ 사용 허가 요청. 정중한 표현 「お借りしてもいいですか」「使ってもいいですか」등.",
      hints: [
        "「すみません、トイレをお借りしてもいいですか？」",
        "「トイレはどこですか？」から始めてもOK",
        "丁寧な表現(ていねいなひょうげん)を使おう",
      ],
      grammarPoint: "〜てもいいですか (〜해도 되겠습니까)",
      rewardVocab: [
        { word: "借りる", reading: "かりる", meaning: "빌리다" },
        { word: "奥", reading: "おく", meaning: "안쪽" },
      ],
      order: 1,
    },
    {
      id: "conbini-hard-2",
      roomId: "conbini",
      title: "商品を返品する",
      titleKo: "상품 반품하기",
      description: "잘못 산 상품을 반품하고 싶다고 점원에게 말해보세요.",
      difficulty: "hard",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "반품/返品 의사 전달. 「返品したい」「間違えて買った」「交換してほしい」등.",
      hints: [
        "「すみません、返品したいのですが...」",
        "「間違えて買ってしまいました」(실수로 사버렸어요)",
        "「レシートはこちらです」(영수증은 여기요)",
      ],
      grammarPoint: "〜したいのですが (〜하고 싶은데요)",
      rewardVocab: [
        { word: "返品", reading: "へんぴん", meaning: "반품" },
        { word: "レシート", reading: "レシート", meaning: "영수증" },
      ],
      order: 2,
    },
    {
      id: "conbini-hard-3",
      roomId: "conbini",
      title: "道を聞こう",
      titleKo: "길 묻기",
      description: "다른 손님에게 근처 역까지 가는 길을 물어보세요.",
      difficulty: "hard",
      targetNpcId: "customer-suzuki",
      clearCondition:
        "길/道/駅 가는 방법 질문. 「行き方」「どうやって」「教えてください」등.",
      hints: [
        "「すみません、駅への行き方を教えてください」",
        "「この近くに駅はありますか？」",
        "「どうやって行けばいいですか？」",
      ],
      grammarPoint: "〜への行き方 (〜로 가는 방법)",
      rewardVocab: [
        { word: "駅", reading: "えき", meaning: "역" },
        { word: "行き方", reading: "いきかた", meaning: "가는 방법" },
      ],
      order: 3,
    },
    // HELL
    {
      id: "conbini-hell-1",
      roomId: "conbini",
      title: "恥ずかしい買い物",
      titleKo: "부끄러운 쇼핑",
      description:
        "편의점에서 콘돔을 사야 합니다... 점원에게 어떻게든 전달해보세요.",
      difficulty: "hell",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "콘돔/コンドーム 구매를 간접적으로든 직접적으로든 전달. 「あの...」「これを...」소곤소곤 표현도 OK.",
      hints: [
        "「あの...すみません...」(저기... 죄송합니다...)",
        "「これをください」と指さしてもOK",
        "「あちらの商品を...」(저쪽 상품을...)",
      ],
      grammarPoint: "간접 표현, 우회적 의사소통",
      rewardVocab: [
        { word: "恥ずかしい", reading: "はずかしい", meaning: "부끄럽다" },
        { word: "こっそり", reading: "こっそり", meaning: "살짝/몰래" },
      ],
      order: 1,
    },
    {
      id: "conbini-hell-2",
      roomId: "conbini",
      title: "クレームを入れる",
      titleKo: "클레임 넣기",
      description:
        "산 도시락에 문제가 있었습니다. 점장을 불러달라고 말해보세요.",
      difficulty: "hell",
      targetNpcId: "clerk-tanaka",
      clearCondition:
        "클레임/苦情/점장 호출 요청. 「店長を呼んでください」「責任者は」등의 표현.",
      hints: [
        "「店長を呼んでいただけますか？」(점장님 불러주시겠어요?)",
        "「この商品に問題があるのですが」(이 상품에 문제가 있는데요)",
        "冷静に(れいせいに)話しましょう (차분하게 말합시다)",
      ],
      grammarPoint: "〜ていただけますか (〜해 주시겠습니까) - 존경 표현",
      rewardVocab: [
        { word: "店長", reading: "てんちょう", meaning: "점장" },
        { word: "苦情", reading: "くじょう", meaning: "불만/클레임" },
      ],
      order: 2,
    },
    {
      id: "conbini-hell-3",
      roomId: "conbini",
      title: "ナンパに対応する",
      titleKo: "헌팅 대응하기",
      description:
        "편의점에서 다른 손님이 말을 걸어옵니다. 적절히 거절해보세요.",
      difficulty: "hell",
      targetNpcId: "customer-yuki",
      clearCondition:
        "거절/拒否 표현. 「結構です」「ごめんなさい」「ちょっと...」등으로 정중하게 거절.",
      hints: [
        "「すみません、ちょっと...」(죄송해요, 좀...)",
        "「結構です」(됐습니다)",
        "「急いでいるので...」(급해서요...)",
      ],
      grammarPoint: "정중한 거절 표현",
      rewardVocab: [
        { word: "結構", reading: "けっこう", meaning: "됐습니다/괜찮습니다" },
        { word: "急ぐ", reading: "いそぐ", meaning: "서두르다" },
      ],
      order: 3,
    },
  ],
}

/** 전체 Room 목록 */
export const allRooms: RoomDef[] = [conbiniRoom]

/** Room ID로 찾기 */
export function getRoomById(id: string): RoomDef | undefined {
  return allRooms.find((r) => r.id === id)
}
