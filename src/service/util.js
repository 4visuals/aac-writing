const key = {
  /**
   * macOS 크롬에서 한글 입력상태에서 enter를 누르면 key event가 두 번 발생한다.
   * (한글 입력 상태 ON, 한글 입력 상태 OFF)
   * @param {KeyEvent} e
   * @returns composing상태이면 true반환
   */
  isComposing: (e) => e.isComposing,
};

const path = {
  aacweb: {
    symbol: (picPath) => {
      return `https://kr.object.ncloudstorage.com/aacweb/symbols/after${picPath}`;
    },
    scene: (path) =>
      `https://kr.object.ncloudstorage.com/aacweb/dictation/${path}`,
  },
  // https://kr.object.ncloudstorage.com/aacweb/scenes/a229b38f-3438-410c-afb3-5ad057323bf8.png
  resolveUrl: (picPath) => {
    // 일단 이렇게만...
    const uri = picPath.substring("aacweb:".length);
    return path.aacweb.symbol(uri);
  },
};
export { key, path };
export default {
  key,
  path,
};
