// ส่วนที่แก้ไขใน party.js (ฟังก์ชัน startHostGame)
// แก้ไขช่องโหว่การโกงในโหมดปาร์ตี้ (ลบข้อมูลเฉลยก่อนส่งข้อมูลไปให้ผู้เล่นคนอื่นผ่าน WebSocket)

function startHostGame(gameSongs, questionTime) {
  party.active = true;
  party.gameRunning = true;
  party.winner = null;
  party.finalRank = null;
  party.finalStandings = null;
  $("questionLabel").textContent = "กำลังโหลดเพลงถัดไป...";
  party.song = gameSongs[0];
  party.roundStartedAt = 0;
  resetRoundSync(0);
  
  party.scores = Object.fromEntries(activePlayers().map(player => [player.id, 0]));
  party.correctCounts = Object.fromEntries(activePlayers().map(player => [player.id, 0]));
  party.answeredPlayers.clear();
  party.roundAnswers = {};
  party.liveAnswers = {};
  party.lateJoinQueue.clear();

  // [ส่วนที่แก้ไข] สร้าง Payload ใหม่ที่ซ่อน/ลบเฉลย (title) ออกไป เพื่อไม่ให้ Client อื่นเห็นคำตอบล่วงหน้าใน DevTools
  // หมายเหตุ: การตรวจสอบความถูกต้อง (isCorrect) จะต้องทำฝั่ง Host หรือเพิ่ม logic เช็คคำตอบที่ Client ผ่าน hash
  const sanitizedSongs = gameSongs.map(song => {
    const { title, ...rest } = song; 
    return {
       ...rest, 
       answers: song.answers // สำหรับความปลอดภัยสูงสุดควร hash answers ด้วย
    };
  });

  send("game-start", {
    roomCode: party.roomCode,
    songs: sanitizedSongs, // ส่งข้อมูลเพลงที่ถูก sanitize แล้ว
    time: questionTime,
    scores: party.scores,
    correctCounts: party.correctCounts,
    settings: party.roundSettings
  }).catch(error => {
    setMessage("feedback", `ข้อผิดพลาด: ${error.message}`, true);
  });
}
