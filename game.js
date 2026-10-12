// ส่วนที่แก้ไขใน game.js (ฟังก์ชัน startGame)
// แก้ไขปัญหาเมื่อไม่มีเพลงสำหรับเล่นเกม (Empty State) โดยการแจ้งเตือนผู้ใช้

function startGame() {
  if (catalogLoading || catalogError) return;
  clearInterval(timer);
  document.querySelector(".main-nav").hidden = true;
  $("returnPartyButton").hidden = true;
  
  const selectedSongs = getFilteredSongs();
  questionTime = Number($("questionTimeSelect").value);
  requestedRounds = Number($("roundCountSelect").value);
  
  const shuffledCatalog = shuffle(selectedSongs);
  const distractorCatalog = [
    ...shuffledCatalog,
    ...catalogSourceSongs,
    ...catalogSongs,
    ...songs
  ];
  
  const selectedArtists = new Set(
    getSelectedValues("artistOptions").map(normalizeArtistName)
  );
  
  gameSongs = shuffledCatalog.slice(0, requestedRounds).map(song => {
    // ... โค้ดส่วนดึงเพลงเดิม ...
    return {
      ...song,
      answers: shuffle([song.title, ...distractors]) // distractors ถูกสุ่มในโค้ดเดิม
    };
  });

  // [ส่วนที่แก้ไข] เพิ่มการแจ้งเตือนและป้องกันไม่ให้เกมพังเมื่อไม่มีเพลง
  if (!gameSongs.length) {
    updateSettings();
    alert("ไม่พบเพลงสำหรับเริ่มเกม กรุณาลองปรับการตั้งค่าใหม่หรือเปลี่ยนตัวกรองเพลง");
    return;
  }

  questionIndex = 0;
  score = 0;
  // ... (เริ่มเกมตามปกติ)
}
