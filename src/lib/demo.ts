import type { ViewerProject } from './project';

/** Synthetic public content. Never replace this with a user's project dump. */
export const demoProject: ViewerProject = {
  schemaVersion: 1,
  id: 'demo',
  name: '밤의 정원',
  description: '낮에는 가꾸고, 밤에는 지키는 작은 정원 게임.',
  source: 'demo',
  revision: 1,
  readOnly: true,
  documents: [
    {
      id: 'first-seed',
      title: '아이디어의 첫 씨앗',
      kind: 'idea',
      section: '게임 아이디어',
      summary: '낮과 밤이 바뀔 때, 같은 정원에서 다른 즐거움을 발견한다.',
      color: 'cream',
      position: { x: 40, y: 40 },
      body: '## 작은 정원, 두 가지 시간\n\n낮에는 씨앗을 심고 정원을 가꾼다. 밤에는 정원에 찾아오는 작은 생물들을 관찰하고, 식물을 지켜줄 장치를 배치한다.\n\n> 내가 만든 정원이 스스로 움직이는 모습을 바라보는 즐거움.\n\n### 플레이어가 느꼈으면 하는 것\n\n- 작은 선택이 정원을 바꾼다는 성취감\n- 다음 날에는 무엇이 자랄지 궁금한 마음\n- 바쁘게 조작하지 않아도 이어지는 느긋한 흐름',
    },
    {
      id: 'core-loop',
      title: '핵심 게임 루프',
      kind: 'document',
      section: '게임 기획',
      summary: '씨앗 선택 → 정원 가꾸기 → 밤 관찰 → 다음 날 준비.',
      color: 'green',
      position: { x: 410, y: 110 },
      body: '## 하루의 흐름\n\n1. **아침:** 씨앗을 선택하고 빈 자리에 심는다.\n2. **낮:** 수확물로 울타리와 자동 장치를 준비한다.\n3. **밤:** 장치와 식물이 함께 작동하는 모습을 관찰한다.\n4. **다음 날:** 관찰한 결과를 바탕으로 배치를 개선한다.\n\n### 시간별 역할\n\n| 시간 | 주요 행동 | 얻는 것 |\n| --- | --- | --- |\n| 아침 | 씨앗 선택 | 새로운 가능성 |\n| 낮 | 수확과 배치 | 성장과 준비 |\n| 밤 | 관찰 | 다음 선택의 힌트 |\n\n한 번의 하루는 짧게, 정원의 변화는 오래 이어지도록 한다.',
    },
    {
      id: 'garden-tools',
      title: '정원을 돌보는 장치',
      kind: 'idea',
      section: '게임 아이디어',
      summary: '작은 장치들을 연결하면, 정원이 하나의 시스템이 된다.',
      color: 'blue',
      position: { x: 70, y: 360 },
      body: '## 자동화 아이디어\n\n- **물방울 시계:** 일정 간격으로 주변 식물에 물을 준다.\n- **빛의 울타리:** 밤에 찾아오는 생물들의 길을 바꾼다.\n- **씨앗 운반기:** 수확한 씨앗을 비어 있는 화분으로 옮긴다.\n\n### 첫 프로토타입에서 확인할 것\n\n- [x] 물 주기 장치의 작동 간격 정하기\n- [ ] 두 장치를 연결했을 때의 재미 확인하기\n- [ ] 밤에 배치를 읽기 쉽게 표현하기\n\n체크리스트는 예제의 상태를 보여주며, 웹에서는 변경하지 않는다.',
    },
    {
      id: 'first-playtest',
      title: '첫 플레이테스트 메모',
      kind: 'document',
      section: '게임 기획',
      summary: '플레이어가 다음 날의 계획을 스스로 세우는지 관찰한다.',
      color: 'rose',
      position: { x: 440, y: 430 },
      body: '## 확인하고 싶은 질문\n\n1. 낮과 밤의 차이를 설명 없이 이해할 수 있는가?\n2. 밤이 끝나면 다음 배치를 바꿔보고 싶어지는가?\n3. 장치가 작동한 이유를 화면에서 알 수 있는가?\n\n### 기록할 항목\n\n- 첫 번째 장치를 배치하기까지 걸린 시간\n- 두 번째 날에 바꾼 선택과 그 이유\n- 가장 오래 바라본 장면\n\n**정답을 알려주기보다 선택의 이유를 들어본다.**',
    },
  ],
};
