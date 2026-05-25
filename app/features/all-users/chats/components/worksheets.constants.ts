export type WorksheetType = 'judge-your-neighbor' | 'when-story-hard';

export interface WorksheetPage {
  subtitle: string;
  guide: string;
  template?: string;
  example?: string;
}

export interface WorksheetMeta {
  type: WorksheetType;
  title: string;
  description: string;
  pages: WorksheetPage[];
}

const JUDGE_YOUR_NEIGHBOR: WorksheetMeta = {
  type: 'judge-your-neighbor',
  title: '이웃 판단하기 양식',
  description:
    '나에게 스트레스를 주는 상황에 대한 판단을 짧고 솔직한 문장으로 적어보는 양식입니다.',
  pages: [
    {
      subtitle: '1. 누가/왜 화나게 하나요',
      guide:
        '그 상황에서, 그 때, 그 곳에서 누가 당신을 (화나게 하나요, 혼란스럽게 하나요, 실망시키나요?) 그 이유는 무엇인가요?',
      template:
        '나는 ___(이름)___은(는) ___(감정)___ 때문에 화가 난다 (슬프다, 혼란스럽다, 두렵다, 기타). 왜냐하면 ___하기 때문이다.',
      example:
        '나는 폴 때문에 화가 난다. 왜냐하면 그는 내가 하는 말마다 트집을 잡기 때문이다.',
    },
    {
      subtitle: '2. 어떻게 바뀌길 원하나요',
      guide:
        '그 상황에서 당신은 그 사람(들)이 어떻게 바뀌기를 원하나요? 당신은 그 사람(들)이 무엇을 하기를 원하나요?',
      template: '나는 ___이(가) ___하기를 원한다.',
      example: '나는 폴이 자기의 잘못을 알고 뉘우치기를 원한다.',
    },
    {
      subtitle: '3. 어떻게 해야 하나요',
      guide: '그 상황에서 그 사람(들)한테 충고해주고 싶은 것은 무엇인가요?',
      template: '___은(는) ___해야 한다 (하지 말아야 한다).',
      example: '폴은 거짓말을 하지 말아야 한다.',
    },
    {
      subtitle: '4. 무엇이 필요한가요',
      guide:
        '그 상황에서 당신이 행복해지려면 그 사람이 무슨 생각을 하고, 어떤 말을 하고, 무엇을 느끼고, 무엇을 할 필요가 있나요?',
      template: '___은(는) ___할 필요가 있다.',
      example: '폴은 내 말을 잘 들어줄 필요가 있다.',
    },
    {
      subtitle: '5. 그 사람을 어떻게 생각하나요',
      guide:
        '당신은 그 상황에서 그 사람을 어떻게 생각하나요? 목록을 만들어 보세요.',
      template: '___은(는) ___이다 (하다).',
      example: '폴은 편파적이고, 건방지고, 시끄럽고, 정직하지 않고, 무례하다.',
    },
    {
      subtitle: '6. 두 번 다시는',
      guide:
        '당신이 그 상황에서 또는 그 상황에 대해 다시는 경험하고 싶지 않은 점은 무엇인가요?',
      template: '나는 앞으로 다시는 ___하고 싶지 않다.',
      example: '폴의 고마움도 모르고 무례한 행동들을 다시는 보고 싶지 않다.',
    },
  ],
};

const WHEN_STORY_HARD: WorksheetMeta = {
  type: 'when-story-hard',
  title: '생각이 잘 잡히지 않을 때',
  description:
    '불편함의 원인이 잘 떠오르지 않을 때, 6가지 관점(감정/원함/해야 함/필요/판단/다시는)에서 생각을 끄집어내는 연습입니다.',
  pages: [
    {
      subtitle: '1. 상황을 묘사하기',
      guide:
        "여기에는 상황을 '사실'처럼 보이는 형태로 적습니다.\n그다음 해당되는 감정(슬픔, 분노 등)을 떠올리고, 그 '사실'에 대한 '나의 해석'을 적습니다. 가능한 한 최악의 생각까지 포함해 보세요.",
      example:
        '사실: 그녀는 점심 약속에 나타나지 않았고, 식당에서 나를 기다리게 했고, 전화도 하지 않았다.\n해석: 그녀는 더 이상 나를 사랑하지 않는다. / 그녀는 다른 사람을 만나고 있다.',
    },
    {
      subtitle: '2. 원한다 (I want …)',
      guide:
        "'I want ___ (나는 ___를 원한다)'라는 생각이 떠오르면 적습니다.\n잘 떠오르지 않으면 '이 상황이나 사람이 어떻게 바뀌면 완벽해질까?'를 떠올려 보세요. 상황이 완벽하려면 무엇이 필요할지 떠올려 보세요. '신처럼' 완벽을 설계해도 됩니다.\n거의 다 채웠을 때, 스스로에게 묻습니다: '내가 진짜 원하는 걸 썼나?' 아니라면 맨 아래에 진짜 원하는 것을 적습니다.",
      example:
        '무슨 일이 있어도 그 사람이 늘 제시간에 나타나길 원한다.\n그녀가 항상 무엇을 하는지 정확히 알고 싶다.',
    },
    {
      subtitle: "3. 해야 한다 (should / shouldn't)",
      guide:
        "'누구누구는 ~해야 한다 / 하면 안 된다' 형태의 생각을 적습니다.\n잘 떠오르지 않으면, 이 상황에서 정의감과 질서가 회복되려면 무엇이 필요할지 생각해봅니다. '옳게' 만들기 위해 필요한 모든 should를 적습니다.",
    },
    {
      subtitle: '4. 필요하다 (I need …)',
      guide:
        "이 상황을 내 편안함과 안전감에 맞추기 위해 필요한 조건들을 적습니다.\n행복한 삶을 위한 요구조건을 적고, '원래 이래야 한다'는 기준에 맞추기 위해 무엇을 조정해야 하는지 적습니다.\n몇 문장을 쓴 다음에는, 내 모든 필요가 채워지면 결국 내가 '무엇을 갖게 되는지'를 자문해보고, 그 답을 맨 아래에 적는 것도 도움이 됩니다.",
      example:
        '나는 그녀가 나를 사랑해주길 필요로 한다.\n나는 내 일에서 성공할 필요가 있다.',
    },
    {
      subtitle: '5. 가차없는 평가 (judge)',
      guide:
        '사람이나 상황에 대한 가차없는 평가를 적습니다. 이 불편한 상황을 통해 그들의 특성이 어떻게 보였는지, 그 성질들을 목록으로 씁니다.',
    },
    {
      subtitle: '6. 두 번 다시는 (never again)',
      guide:
        "다시는 겪고 싶지 않은 그 상황의 측면을 적습니다.\n내가 '결코 다시는 살고 싶지 않다'고 맹세하거나 바라게 되는 그 부분을 씁니다.",
    },
  ],
};

export const WORKSHEETS: Record<WorksheetType, WorksheetMeta> = {
  'judge-your-neighbor': JUDGE_YOUR_NEIGHBOR,
  'when-story-hard': WHEN_STORY_HARD,
};

export const WORKSHEET_LIST: WorksheetMeta[] = [
  JUDGE_YOUR_NEIGHBOR,
  WHEN_STORY_HARD,
];
