<template>
  <div class="container book-list">
    <BrandPanel theme="gold" text="교과서 받아쓰기" path="book" />
    <BookView
      :book="activeBook"
      v-if="activeBook"
      @back="() => (activeBook = null)"
    />
    <div class="row group" v-else>
      <transition-group name="fade" appear>
        <div
          class="col-6 col-sm-4 col-md-3 col-lg-3 book-holder"
          v-for="book in chapters"
          :key="book.seq"
        >
          <TextBook @click="openBook(book)">
            <template v-slot:front
              ><h3 class="book-title">{{ front.title(book) }}</h3>
              <ParaText :lg="true">{{ front.sub1(book) }}</ParaText>
              <ParaText :lg="true">{{ front.sub2(book) }}</ParaText>
            </template>
          </TextBook>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { BrandPanel } from "@/components/brand";
import { ParaText } from "@/components/text";
import BookView from "./BookView.vue";
import TextBook from "@/views/book/TextBook.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";
export default {
  components: {
    BrandPanel,
    TextBook,
    ParaText,
    BookView,
  },
  setup() {
    const store = useStore();

    const activeBook = ref(null);
    const chapters = computed(() => {
      return store.state.course.chapters.books;
    });

    const front = {
      title: (book) => {
        const names = book.names || book.desc.split(" ");
        book.names = names;
        return names[0];
      },
      sub1: (book) => book.names[1],
      sub2: (book) => book.names[2],
    };

    const openBook = (book) => {
      activeBook.value = book;
    };

    return { chapters, front, activeBook, openBook };
  },
};
</script>

<style lang="scss" scoped>
.book-list {
  .book-holder {
    padding: 1rem 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .book-title {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.fade-enter-from {
  opacity: 0.4;
  transform: scale(0.9);
}
.fade-enter-active {
  transition: all 0.25s ease-out;
}
</style>
