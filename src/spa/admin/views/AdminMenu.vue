<template>
  <div class="menu-wrapper">
    <div class="menu-body">
      <h3>관리자 메뉴</h3>
      <div class="secion">
        <button class="exit">나가기</button>
      </div>
      <div class="section">
        <div class="section-body">
          <span class="icon material-icons-outlined">account_balance</span>
          <span class="desc">문제은행</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body">
          <span class="icon material-icons-outlined">badge</span>
          <span class="desc">수강증</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body">
          <span class="icon material-icons-outlined">insights</span>
          <span class="desc">통계</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  flex: 0 0 200px;
  .menu-body {
    .section {
      padding: 0.75rem 1rem;
      .section-body {
        display: flex;
        column-gap: 8px;
        align-items: center;
        .icon {
          font-size: 18px;
        }
        .desc {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
