import { http, HttpResponse } from "msw";

import type { SpotListItem, SpotListResponse } from "@vivac/shared/types";

const MOCK_SPOTS: SpotListItem[] = [
  {
    uid: "a1b2c3d4-0001-0000-0000-000000000001",
    title: "설악산 대청봉 야영지",
    tagline: "대청봉 인근 국립공원 지정 야영지. 사전 예약 필수.",
    region_province: "강원도",
    region_city: "속초시",
    rating_avg: 4.8,
    review_count: 124,
    themes: ["고산", "알파인", "국립공원", "사전예약"],
  },
  {
    uid: "a1b2c3d4-0002-0000-0000-000000000002",
    title: "지리산 노고단 야영지",
    tagline: "일출 조망이 뛰어나며 성수기 사전 예약 필요.",
    region_province: "전라남도",
    region_city: "구례군",
    rating_avg: 4.7,
    review_count: 98,
    themes: ["고산", "일출", "국립공원"],
  },
  {
    uid: "a1b2c3d4-0003-0000-0000-000000000003",
    title: "오대산 소금강 오토캠핑장",
    tagline: "소금강 계곡 옆 국립공원 공식 야영장.",
    region_province: "강원도",
    region_city: "강릉시",
    rating_avg: 4.5,
    review_count: 213,
    themes: ["계곡", "국립공원", "시설완비"],
  },
  {
    uid: "a1b2c3d4-0004-0000-0000-000000000004",
    title: "북한산 백운대 야영지",
    tagline: "서울 근교 접근성이 좋은 소규모 지정 야영지.",
    region_province: "경기도",
    region_city: "고양시",
    rating_avg: 4.2,
    review_count: 310,
    themes: ["수도권", "국립공원", "당일 백패킹"],
  },
  {
    uid: "a1b2c3d4-0005-0000-0000-000000000005",
    title: "태백산 당골 야영장",
    tagline: "천제단 등산 거점, 태백산 국립공원 공식 야영장.",
    region_province: "강원도",
    region_city: "태백시",
    rating_avg: 4.4,
    review_count: 87,
    themes: ["국립공원", "탐방로", "시설완비"],
  },
  {
    uid: "a1b2c3d4-0006-0000-0000-000000000006",
    title: "소백산 비로봉 야영지",
    tagline: "철쭉 시즌에 극히 혼잡한 능선 야영지.",
    region_province: "충청북도",
    region_city: "단양군",
    rating_avg: 4.6,
    review_count: 156,
    themes: ["능선", "철쭉", "국립공원"],
  },
  {
    uid: "a1b2c3d4-0007-0000-0000-000000000007",
    title: "덕유산 향적봉 대피소 야영지",
    tagline: "겨울 설경으로 유명, 방한 장비 필수.",
    region_province: "전라북도",
    region_city: "무주군",
    rating_avg: 4.9,
    review_count: 201,
    themes: ["설경", "대피소", "국립공원", "겨울"],
  },
  {
    uid: "a1b2c3d4-0008-0000-0000-000000000008",
    title: "가야산 해인사 탐방로 야영지",
    tagline: "해인사까지 도보 접근 가능한 국립공원 야영지.",
    region_province: "경상남도",
    region_city: "합천군",
    rating_avg: 4.3,
    review_count: 74,
    themes: ["국립공원", "문화재", "계곡"],
  },
  {
    uid: "a1b2c3d4-0009-0000-0000-000000000009",
    title: "월악산 영봉 야영지",
    tagline: "충주호 조망이 뛰어난 정상 부근 야영지.",
    region_province: "충청북도",
    region_city: "제천시",
    rating_avg: 4.5,
    review_count: 63,
    themes: ["조망", "호수뷰", "국립공원"],
  },
  {
    uid: "a1b2c3d4-0010-0000-0000-000000000010",
    title: "치악산 비로봉 야영지",
    tagline: "원주에서 당일 백패킹 코스로 인기.",
    region_province: "강원도",
    region_city: "원주시",
    rating_avg: 4.1,
    review_count: 89,
    themes: ["당일 백패킹", "국립공원"],
  },
  {
    uid: "a1b2c3d4-0011-0000-0000-000000000011",
    title: "점봉산 곰배령 야영지",
    tagline: "허가제 야영지, 야생화 군락지.",
    region_province: "강원도",
    region_city: "인제군",
    rating_avg: 4.9,
    review_count: 142,
    themes: ["야생화", "허가제", "생태보전"],
  },
  {
    uid: "a1b2c3d4-0012-0000-0000-000000000012",
    title: "방태산 자연휴양림 야영장",
    tagline: "데크 및 화장실 완비, 계곡 수영 가능.",
    region_province: "강원도",
    region_city: "인제군",
    rating_avg: 4.4,
    review_count: 198,
    themes: ["자연휴양림", "계곡", "시설완비"],
  },
  {
    uid: "a1b2c3d4-0013-0000-0000-000000000013",
    title: "울진 금강소나무숲 야영지",
    tagline: "금강소나무 군락지 내 허가제 탐방로 야영지.",
    region_province: "경상북도",
    region_city: "울진군",
    rating_avg: 4.7,
    review_count: 55,
    themes: ["소나무숲", "허가제", "트레킹"],
  },
  {
    uid: "a1b2c3d4-0014-0000-0000-000000000014",
    title: "내장산 백암 야영장",
    tagline: "단풍 시즌 극성수기, 국립공원 공식 야영장.",
    region_province: "전라남도",
    region_city: "장성군",
    rating_avg: 4.3,
    review_count: 176,
    themes: ["단풍", "국립공원", "시설완비"],
  },
  {
    uid: "a1b2c3d4-0015-0000-0000-000000000015",
    title: "한라산 윗세오름 야영지",
    tagline: "제주 백패킹의 성지. 사전 예약 필수.",
    region_province: "제주특별자치도",
    region_city: "서귀포시",
    rating_avg: 5.0,
    review_count: 389,
    themes: ["국립공원", "제주", "사전예약", "성지"],
  },
  {
    uid: "a1b2c3d4-0016-0000-0000-000000000016",
    title: "두타산 베틀바위 능선 비박지",
    tagline: "동해 조망 절경. 비박 장비 필수.",
    region_province: "강원도",
    region_city: "동해시",
    rating_avg: 4.8,
    review_count: 47,
    themes: ["비박", "능선", "바다뷰", "고수전용"],
  },
  {
    uid: "a1b2c3d4-0017-0000-0000-000000000017",
    title: "속리산 문장대 야영지",
    tagline: "기암괴석 조망 우수, 화양동 계곡 연계 코스.",
    region_province: "충청북도",
    region_city: "보은군",
    rating_avg: 4.4,
    review_count: 103,
    themes: ["국립공원", "기암", "능선"],
  },
  {
    uid: "a1b2c3d4-0018-0000-0000-000000000018",
    title: "계룡산 삼불봉 야영지",
    tagline: "대전·충청권 당일 백패킹 인기 코스.",
    region_province: "충청남도",
    region_city: "공주시",
    rating_avg: 4.0,
    review_count: 134,
    themes: ["당일 백패킹", "국립공원", "충청권"],
  },
  {
    uid: "a1b2c3d4-0019-0000-0000-000000000019",
    title: "주왕산 달기약수 야영장",
    tagline: "계곡 트레킹 베이스캠프, 달기약수 인근.",
    region_province: "경상북도",
    region_city: "청송군",
    rating_avg: 4.2,
    review_count: 91,
    themes: ["국립공원", "계곡", "시설완비"],
  },
  {
    uid: "a1b2c3d4-0020-0000-0000-000000000020",
    title: "무등산 입석대 야영지",
    tagline: "광주 시내 야경 조망 가능한 주상절리 인근 야영지.",
    region_province: "광주광역시",
    region_city: null,
    rating_avg: 4.3,
    review_count: 167,
    themes: ["국립공원", "야경", "도심 근교"],
  },
];

export const handlers = [
  http.get("*/v1/explore/spots", ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const q = url.searchParams.get("q");
    const sort = url.searchParams.get("sort") ?? "popular";

    let filtered = [...MOCK_SPOTS];

    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.tagline?.toLowerCase().includes(query) ||
          s.region_province?.toLowerCase().includes(query) ||
          s.region_city?.toLowerCase().includes(query) ||
          s.themes?.some((t) => t.toLowerCase().includes(query)),
      );
    }

    if (sort === "rating") {
      filtered.sort((a, b) => b.rating_avg - a.rating_avg);
    } else if (sort === "latest") {
      filtered.reverse();
    }

    const cursorIndex = cursor
      ? filtered.findIndex((s) => s.uid === cursor)
      : -1;
    const startIndex = cursorIndex === -1 ? 0 : cursorIndex + 1;
    const slice = filtered.slice(startIndex, startIndex + limit);
    const lastItem = slice[slice.length - 1];
    const has_more = startIndex + limit < filtered.length;
    const next_cursor = has_more && lastItem ? lastItem.uid : null;

    const body: SpotListResponse = {
      items: slice,
      next_cursor,
      has_more,
      total: filtered.length,
    };

    return HttpResponse.json(body);
  }),
];
