import clickSound from "@/assets/click.wav";

const audio = new Audio(clickSound);
const playSound = () => {
  // audio.play();
  console.log(audio);
};

export default { playSound };
