<template>
  <div class="daily-stats">
    <div class="ctrl">
      <SpanText class="rss-type"
        >{{ rssType === "W" ? "낱말" : "문장" }} 학습</SpanText
      >
      <AacButton
        text="낱말"
        size="xs"
        theme="pink"
        @click="setType('W')"
      /><AacButton text="문장" size="xs" theme="blue" @click="setType('S')" />
    </div>
    <TableView class="tbl-stat" colsize="80px">
      <template v-slot:fcol>
        <Cell w="w80">회차</Cell>
        <Cell w="w80" class="even">전체</Cell>
        <Cell w="w80">정답</Cell>
        <Cell w="w80" class="even">오답</Cell>
        <Cell w="w80">생략</Cell>
        <Cell w="w80" class="even">점수</Cell>
      </template>
      <template v-slot:data>
        <Row>
          <Cell w="w60" v-for="(_, idx) in arr" :key="idx"
            >{{ idx + 1 }}회</Cell
          ></Row
        >
        <Row>
          <Cell w="w60" class="even" v-for="(v, idx) in arr" :key="idx">{{
            v.total
          }}</Cell>
        </Row>
        <Row
          ><Cell w="w60" v-for="(v, idx) in arr" :key="idx">{{
            v.correct
          }}</Cell></Row
        >
        <Row
          ><Cell w="w60" class="even" v-for="(v, idx) in arr" :key="idx">{{
            v.failed
          }}</Cell></Row
        >
        <Row
          ><Cell w="w60" v-for="(v, idx) in arr" :key="idx">{{
            v.skipped
          }}</Cell></Row
        >
        <Row
          ><Cell w="w60" class="even" v-for="(v, idx) in arr" :key="idx"
            >{{ parseInt((v.correct / v.total) * 100) }}점</Cell
          ></Row
        >
      </template>
    </TableView>
    <TimelineChart :chartData="stats" :resourceType="rssType" />
  </div>
</template>

<script>
import TimelineChart from "./TimelineChart2.vue";
/**
 * 결과 분석 1 화면
 *
 * +---------+-----+-----+-----+
 * |         |  1  |  1  |  1  |
 * +---------+-----+-----+-----+
 * | 문항수
 * | 정답
 * | 오답
 */
import { SpanText } from "@/components/text";
import { TableView, Row, Cell } from "@/components/table";
import { ref, shallowRef, watch } from "@vue/runtime-core";
import util from "@/service/util";
export default {
  components: {
    TableView,
    Row,
    Cell,
    SpanText,
    TimelineChart,
  },
  props: ["stats"],
  setup(props) {
    const rssType = ref("W");
    const arr = shallowRef([]);
    const updateStats = (stats) => {
      const trials = new Map();
      stats
        .filter((each) => each.type === rssType.value)
        .forEach((each) => {
          const ymd = util.time.toYMD(each.startTime);
          if (!trials.has(ymd)) {
            trials.set(ymd, {
              cnt: 0,
              total: 0,
              correct: 0,
              failed: 0,
              skipped: 0,
            });
          }
          const v = trials.get(ymd);
          const { total, correct, failed } = each;
          v.cnt++;
          v.total += total;
          v.correct += correct;
          v.failed += failed;
          v.skipped += each.total - correct - failed;
        });
      arr.value = [...trials.values()];
    };
    const setType = (type) => {
      rssType.value = type;
      updateStats(props.stats);
    };
    watch(
      () => props.stats,
      (data) => {
        console.log("[NEW STATS]", data);
        updateStats(data);
      }
    );
    return {
      arr,
      rssType,
      setType,
    };
  },
};
</script>

<style lang="scss" scoped>
.daily-stats {
  .ctrl {
    display: flex;
    margin-bottom: 4px;
    column-gap: 4px;
    .rss-type {
      flex: 1 1 auto;
    }
  }
  .tbl-stat {
    border: 1px solid #dfdfdfee;
    // border-radius: 4px;
  }
}
</style>
