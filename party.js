(() => {
  const $ = id => document.getElementById(id);
  const screens = ["home", "partyProfile", "joinParty", "partyRoom", "lobby", "game", "results"];
  const howToSteps = [
    ["1. สร้างห้องส่วนตัว", "ตั้งชื่อของคุณ แล้วกดสร้างห้องเพื่อรับรหัสชวนเพื่อน"],
    ["2. ชวนเพื่อนเข้าห้อง", "ส่งลิงก์หรือรหัสห้องให้เพื่อนเข้ามารวมตัวกัน"],
    ["3. เริ่มทายเพลง", "ฟังเพลงแล้วตอบให้ไว ยิ่งตอบเร็วยิ่งได้คะแนนเยอะ!"]
  ];
  const party = {
    active: false,
    isHost: false,
    channel: null,
    roomCode: "",
    playerId: "",
    name: "",
    avatar: "🎧",
    gameRunning: false,
    song: null,
    roundStartedAt: 0,
    answeredPlayers: new Set(),
    readyPlayers: new Set(),
    scores: {},
    correctCounts: {},
    winner: null,
    finalRank: null,
    finalStandings: null,
    roundStartSent: false,
    roundStartAt: 0,
    roundIndex: -1,
    roundReadyTimer: null,
    resultAdvanceTimer: null,
    roundAnswers: {},
    resultSending: false,
    roundSettings: {
      winCondition: "points",
      liveAnswers: true,
      lateJoin: false
    },
    liveAnswers: {},
    lateJoinQueue: new Set(),
    playbackScheduledIndex: -1
  };
  let supabaseClient = null;
  let howToIndex = 0;
  let roomResponseTimer = null;
  let roomStateReceived = false;

  function showScreen(screenId) {
    screens.forEach(id => {
      $(id).hidden = id !== screenId;
    });
    document.querySelector(".main-nav").hidden =
      screenId !== "home" && (screenId !== "lobby" || Boolean(party.channel));
    $("returnPartyButton").hidden = screenId !== "lobby" || !party.channel;
  }

  function resetRoundSync(index) {
    clearTimeout(party.roundReadyTimer);
    clearTimeout(party.resultAdvanceTimer);
    party.readyPlayers.clear();
    party.roundAnswers = {};
    party.liveAnswers = {};
    party.roundStartSent = false;
    party.roundStartAt = 0;
    party.playbackScheduledIndex = -1;
    party.roundIndex = index;
    if (party.isHost) {
      party.roundReadyTimer = window.setTimeout(() => {
        startRoundPlayback().catch(error => {
          console.error("Unable to start the synchronized round:", error);
          setMessage("feedback", error.message, true);
        });
      }, 12000);
    }
  }

  function scheduleRoundPlayback(index, startAt) {
    if (party.playbackScheduledIndex === index) return;
    party.playbackScheduledIndex = index;
    party.roundStartAt = startAt;
    const delay = Math.max(0, startAt - Date.now());
    window.setTimeout(() => {
      if (!party.gameRunning || party.roundIndex !== index || party.winner) return;
      window.songTriviaPartyGame.playPreview();
    }, delay);
  }

  async function startRoundPlayback() {
    if (!party.isHost || !party.gameRunning || party.roundStartSent) return;
    party.roundStartSent = true;
    clearTimeout(party.roundReadyTimer);
    const startAt = Date.now() + 1800;
    const index = party.roundIndex;
    await send("round-go", { roomCode: party.roomCode, index, startAt });
    scheduleRoundPlayback(index, startAt);
  }

  function tryStartReadyRound() {
    if (!party.isHost || party.roundStartSent) return;
    const players = activePlayers();
    if (players.length && players.every(player => party.readyPlayers.has(player.id))) {
      startRoundPlayback().catch(error => {
        console.error("Unable to start the synchronized round:", error);
        setMessage("feedback", error.message, true);
      });
    }
  }

  function getClient() {
    const url = window.SONG_TRIVIA_SUPABASE_URL?.trim();
    const key = window.SONG_TRIVIA_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) {
      throw new Error("ตั้งค่า Supabase Project URL และ anon key ในไฟล์ supabase-config.js ก่อนสร้างหรือเข้าห้องออนไลน์");
    }
    if (!window.supabase?.createClient) {
      throw new Error("โหลด Supabase ไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่");
    }
    if (!supabaseClient) supabaseClient = window.supabase.createClient(url, key);
    return supabaseClient;
  }

  function setMessage(id, message, error = false) {
    const element = $(id);
    element.textContent = message;
    element.classList.toggle("error", error);
  }

  function makeRoomCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    return [...bytes].map(value => alphabet[value % alphabet.length]).join("");
  }

  function makePlayerId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function roomUrl() {
    if (window.location.protocol !== "https:") return null;
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("room", party.roomCode);
    return url.toString();
  }

  function presencePlayers() {
    if (!party.channel) return [];
    const states = party.channel.presenceState();
    return Object.values(states).flat().filter(player => player?.id);
  }

  function activePlayers() {
    return presencePlayers().filter(player => !party.lateJoinQueue.has(player.id));
  }

  function renderLiveAnswers() {
    const players = presencePlayers();
    const entries = Object.entries(party.liveAnswers).map(([playerId, answer]) => ({
      id: playerId,
      name: players.find(player => player.id === playerId)?.name || "ผู้เล่น",
      answer
    }));
    window.songTriviaPartyGame.setLiveAnswers(entries);
  }

  function renderPlayers() {
    const players = presencePlayers();
    $("playerCountLabel").textContent = `${players.length}/100`;
    const list = $("partyPlayers");
    list.replaceChildren();
    players.forEach(player => {
      const item = document.createElement("li");
      item.className = player.id === party.playerId ? "current-player" : "";
      const avatar = document.createElement("span");
      avatar.className = "player-avatar";
      avatar.textContent = player.avatar || "🎧";
      avatar.setAttribute("aria-hidden", "true");
      const name = document.createElement("strong");
      name.textContent = player.name || "ผู้เล่น";
      const tag = document.createElement("small");
      tag.textContent = player.host ? "HOST" : player.id === party.playerId ? "YOU" : "เข้าร่วมแล้ว";
      item.append(avatar, name, tag);
      list.appendChild(item);
    });
  }

  function updateRoomLink() {
    $("roomCodeLabel").textContent = party.roomCode;
  }

  async function send(type, data = {}) {
    if (!party.channel) return;
    const status = await party.channel.send({
      type: "broadcast",
      event: "room-event",
      payload: { type, senderId: party.playerId, ...data }
    });
    if (status !== "ok") throw new Error(`ส่งข้อมูลห้องไม่สำเร็จ (${status})`);
  }

  async function sendRoomState() {
    await send("room-state", {
      roomCode: party.roomCode,
      hostId: party.playerId,
      phase: "lobby"
    });
  }

  function syncScores(scores, correctCounts) {
    party.scores = scores || party.scores;
    party.correctCounts = correctCounts || party.correctCounts;
    const mine = party.scores[party.playerId] || 0;
    const mineCorrect = party.correctCounts[party.playerId] || 0;
    window.songTriviaPartyGame.applyScore(mine, mineCorrect);
    const player = presencePlayers().find(item => item.id === party.playerId);
    if (player) player.score = mine;
  }

  function renderPartyResult(data) {
    party.winner = "complete";
    party.song = party.song || window.songTriviaPartyGame.getSongs()[window.songTriviaPartyGame.getQuestionIndex()];
    if (data.scores) syncScores(data.scores, data.correctCounts);
    window.songTriviaPartyGame.showPartyResult({
      title: data.title || party.song.title,
      artist: data.artist || party.song.artist,
      players: data.players || [],
      answers: data.answers || {},
      scores: data.scores || {},
      correctCounts: data.correctCounts || {},
      winCondition: data.winCondition || party.roundSettings.winCondition
    });
  }

  async function endQuestion() {
    if (!party.isHost || party.winner || party.resultSending) return;
    const song = party.song;
    const payload = {
      roomCode: party.roomCode,
      title: song.title,
      artist: song.artist,
      players: activePlayers().map(player => ({
        id: player.id,
        name: player.name || "ผู้เล่น",
        avatar: player.avatar || "🎧"
      })),
      answers: party.roundAnswers,
      scores: party.scores,
      correctCounts: party.correctCounts,
      winCondition: party.roundSettings.winCondition
    };
    party.resultSending = true;
    try {
      await send("question-result", payload);
    } finally {
      party.resultSending = false;
    }
    party.winner = "complete";
    renderPartyResult(payload);
    party.resultAdvanceTimer = window.setTimeout(() => {
      $("nextBtn").click();
    }, Math.max(
      7000,
      party.roundStartedAt
        ? window.songTriviaPartyGame.getQuestionTime() * 1000 -
          (performance.now() - party.roundStartedAt)
        : 0
    ));
  }

  function recordAnswer(playerId, answer, elapsedMs) {
    if (!party.isHost || !party.gameRunning || party.winner ||
      party.answeredPlayers.has(playerId) ||
      !activePlayers().some(player => player.id === playerId)) return;

    const duration = window.songTriviaPartyGame.getQuestionTime() * 1000;
    const elapsed = Number.isFinite(Number(elapsedMs))
      ? Math.max(0, Math.min(duration, Number(elapsedMs)))
      : duration;
    const correct = answer === party.song?.title;
    const points = correct ? Math.max(0, Math.ceil((1 - elapsed / duration) * 100)) : 0;
    party.answeredPlayers.add(playerId);
    party.roundAnswers[playerId] = { answer, correct, points };
    if (party.roundSettings.liveAnswers && answer !== null) {
      party.liveAnswers[playerId] = answer;
      renderLiveAnswers();
      send("live-answer", {
        roomCode: party.roomCode,
        index: window.songTriviaPartyGame.getQuestionIndex(),
        playerId,
        answer
      }).catch(error => {
        console.error("Unable to broadcast a live answer:", error);
        setMessage("feedback", error.message, true);
      });
    }
    if (correct) {
      party.scores[playerId] = (party.scores[playerId] || 0) + points;
      party.correctCounts[playerId] = (party.correctCounts[playerId] || 0) + 1;
    }

  }

  async function handleEvent(payload) {
    if (!payload || payload.senderId === party.playerId) return;
    switch (payload.type) {
      case "request-state":
        if (!party.isHost) break;
        if (!party.gameRunning) {
          await sendRoomState();
        } else if (!party.roundSettings.lateJoin) {
          await send("join-rejected", {
            roomCode: party.roomCode,
            targetId: payload.senderId,
            message: "เกมเริ่มไปแล้ว ห้องนี้ปิดรับผู้เล่นใหม่"
          });
        } else if (window.songTriviaPartyGame.getQuestionIndex() >=
          window.songTriviaPartyGame.getSongs().length - 1) {
          await send("join-rejected", {
            roomCode: party.roomCode,
            targetId: payload.senderId,
            message: "เกมใกล้จบแล้ว ไม่สามารถเข้าร่วมรอบถัดไปได้"
          });
        } else {
          party.lateJoinQueue.add(payload.senderId);
          party.scores[payload.senderId] = 0;
          party.correctCounts[payload.senderId] = 0;
          await send("join-waiting", {
            roomCode: party.roomCode,
            targetId: payload.senderId
          });
        }
        break;
      case "join-rejected":
        if (payload.roomCode !== party.roomCode || payload.targetId !== party.playerId) break;
        clearTimeout(roomResponseTimer);
        setMessage("joinMessage", payload.message || "ไม่สามารถเข้าร่วมห้องนี้ได้", true);
        await leaveParty(false);
        showScreen("joinParty");
        break;
      case "join-waiting":
        if (payload.roomCode !== party.roomCode || payload.targetId !== party.playerId) break;
        roomStateReceived = true;
        clearTimeout(roomResponseTimer);
        setMessage("roomMessage", "เข้าห้องแล้ว รอโฮสต์เริ่มรอบถัดไปเพื่อเข้าร่วมเกม");
        showScreen("partyRoom");
        renderPlayers();
        break;
      case "room-state":
        if (party.isHost || payload.roomCode !== party.roomCode) break;
        roomStateReceived = true;
        clearTimeout(roomResponseTimer);
        party.isHost = false;
        setMessage("joinMessage", "");
        $("roomNextButton").hidden = true;
        $("inviteButton").hidden = true;
        $("copyRoomButton").hidden = true;
        setMessage("roomMessage", "รอโฮสต์ตั้งค่าและเริ่มเกมได้เลย");
        showScreen("partyRoom");
        renderPlayers();
        break;
      case "game-start":
        if (party.isHost || payload.roomCode !== party.roomCode) break;
        party.active = true;
        party.gameRunning = true;
        party.winner = null;
        party.song = payload.songs[0];
        party.roundStartedAt = 0;
        resetRoundSync(0);
        party.scores = payload.scores || {};
        party.correctCounts = payload.correctCounts || {};
        party.roundSettings = payload.settings || party.roundSettings;
        party.liveAnswers = {};
        party.lateJoinQueue.clear();
        syncScores(party.scores, party.correctCounts);
        window.songTriviaPartyGame.start({
          songs: payload.songs,
          time: payload.time,
          name: party.name
        });
        break;
      case "question-result":
        if (payload.roomCode !== party.roomCode) break;
        renderPartyResult(payload);
        break;
      case "late-game-start":
        if (party.isHost || payload.roomCode !== party.roomCode ||
          !payload.targetIds?.includes(party.playerId)) break;
        party.active = true;
        party.gameRunning = true;
        party.winner = null;
        party.song = payload.songs[payload.index];
        party.roundStartedAt = 0;
        party.roundSettings = payload.settings || party.roundSettings;
        party.scores = payload.scores || {};
        party.correctCounts = payload.correctCounts || {};
        syncScores(party.scores, party.correctCounts);
        resetRoundSync(payload.index);
        window.songTriviaPartyGame.start({
          songs: payload.songs,
          time: payload.time,
          name: party.name,
          index: payload.index
        });
        break;
      case "answer":
        if (!party.isHost || !party.gameRunning || party.winner ||
          payload.index !== window.songTriviaPartyGame.getQuestionIndex() ||
          !presencePlayers().some(player => player.id === payload.senderId)) break;
        recordAnswer(payload.senderId, payload.answer, payload.elapsedMs);
        break;
      case "preview-ready":
        if (!party.isHost || !party.gameRunning ||
          payload.index !== window.songTriviaPartyGame.getQuestionIndex() ||
          !activePlayers().some(player => player.id === payload.senderId)) break;
        party.readyPlayers.add(payload.senderId);
        tryStartReadyRound();
        break;
      case "live-answer":
        if (!party.gameRunning || !party.roundSettings.liveAnswers ||
          payload.roomCode !== party.roomCode ||
          payload.index !== window.songTriviaPartyGame.getQuestionIndex() ||
          !presencePlayers().some(player => player.id === payload.playerId)) break;
        party.liveAnswers[payload.playerId] = payload.answer;
        renderLiveAnswers();
        break;
      case "round-go":
        if (party.isHost || !party.gameRunning || payload.roomCode !== party.roomCode ||
          payload.index !== window.songTriviaPartyGame.getQuestionIndex()) break;
        party.roundStartSent = true;
        clearTimeout(party.roundReadyTimer);
        scheduleRoundPlayback(payload.index, payload.startAt);
        break;
      case "next-round":
        if (party.isHost || !party.gameRunning || payload.roomCode !== party.roomCode) break;
        party.winner = null;
        party.answeredPlayers.clear();
        party.song = window.songTriviaPartyGame.getSongs()[payload.index];
        party.roundStartedAt = 0;
        resetRoundSync(payload.index);
        window.songTriviaPartyGame.loadRound(payload.index);
        break;
      case "game-finished":
        if (party.isHost || !party.gameRunning || payload.roomCode !== party.roomCode) break;
        party.gameRunning = false;
        syncScores(payload.scores, payload.correctCounts);
        window.songTriviaPartyGame.showResults();
        window.songTriviaPartyGame.setFinalStandings((payload.standings || []).map(player => ({
          ...player,
          isCurrentPlayer: player.id === party.playerId
        })));
        $("resultDetail").textContent = `${party.correctCounts[party.playerId] || 0} คำตอบถูก • อันดับ ${payload.ranks?.[party.playerId] || "-"}`;
        break;
      case "return-to-room-request":
        if (!party.isHost || payload.roomCode !== party.roomCode) break;
        await send("return-to-room", { roomCode: party.roomCode });
        returnToRoom();
        break;
      case "return-to-room":
        if (payload.roomCode !== party.roomCode) break;
        returnToRoom();
        break;
      default:
        break;
    }
  }

  async function connect(roomCode, profile, isHost) {
    const client = getClient();
    party.roomCode = roomCode;
    party.playerId = makePlayerId();
    party.name = profile.name;
    party.avatar = profile.avatar || "🎧";
    party.isHost = isHost;
    party.active = false;
    party.gameRunning = false;
    party.scores = {};
    party.correctCounts = {};
    party.winner = null;
    party.roundSettings = {
      winCondition: "points",
      liveAnswers: true,
      lateJoin: false
    };
    party.lateJoinQueue.clear();
    roomStateReceived = false;
    const channel = client.channel(`songtrivia-room-${roomCode}`, {
      config: {
        broadcast: { ack: true, self: false },
        presence: { key: party.playerId }
      }
    });
    party.channel = channel;
    channel.on("broadcast", { event: "room-event" }, ({ payload }) => {
      handleEvent(payload).catch(error => {
        console.error("Party message failed:", error);
        setMessage("roomMessage", error.message, true);
      });
    });
    channel.on("presence", { event: "sync" }, renderPlayers);
    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("เชื่อมต่อห้องไม่ทันเวลา ลองใหม่อีกครั้ง")), 10000);
      channel.subscribe(status => {
        if (status === "SUBSCRIBED") {
          clearTimeout(timeout);
          resolve();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          clearTimeout(timeout);
          reject(new Error(`เชื่อมต่อห้องไม่สำเร็จ (${status})`));
        }
      });
    });
    const trackStatus = await channel.track({
      id: party.playerId,
      name: party.name,
      avatar: party.avatar,
      host: isHost,
      joinedAt: Date.now()
    });
    if (trackStatus !== "ok") throw new Error(`เข้าห้องไม่สำเร็จ (${trackStatus})`);
    updateRoomLink();
    renderPlayers();
    if (!isHost) {
      await send("request-state");
      roomResponseTimer = window.setTimeout(() => {
        if (!roomStateReceived) {
          setMessage("joinMessage", "ไม่พบโฮสต์ที่ออนไลน์อยู่ในห้องนี้ ตรวจรหัสแล้วลองอีกครั้ง", true);
          leaveParty(false);
          showScreen("joinParty");
        }
      }, 7000);
    } else {
      $("roomNextButton").hidden = false;
      $("inviteButton").hidden = false;
      $("copyRoomButton").hidden = false;
      setMessage("roomMessage", "ห้องพร้อมแล้ว ส่งรหัสหรือลิงก์เชิญเพื่อนได้เลย");
      showScreen("partyRoom");
      await sendRoomState();
    }
  }

  async function leaveParty(returnHome = true) {
    clearTimeout(roomResponseTimer);
    clearTimeout(party.roundReadyTimer);
    clearTimeout(party.resultAdvanceTimer);
    if (party.channel) {
      const channel = party.channel;
      party.channel = null;
      const status = await channel.unsubscribe();
      if (status !== "ok") console.warn("Party room did not unsubscribe cleanly:", status);
    }
    party.active = false;
    party.gameRunning = false;
    party.isHost = false;
    party.roomCode = "";
    party.winner = null;
    party.answeredPlayers.clear();
    if (returnHome) showScreen("home");
  }

  function returnToRoom() {
    clearTimeout(party.roundReadyTimer);
    clearTimeout(party.resultAdvanceTimer);
    window.songTriviaPartyGame?.stopForSettings();
    party.gameRunning = false;
    party.winner = null;
    party.finalRank = null;
    party.finalStandings = null;
    party.song = null;
    party.roundStartedAt = 0;
    party.answeredPlayers.clear();
    party.readyPlayers.clear();
    party.roundAnswers = {};
    party.liveAnswers = {};
    party.lateJoinQueue.clear();
    party.resultSending = false;
    setMessage("roomMessage", party.isHost
      ? "ทุกคนกลับเข้าห้องแล้ว ตั้งค่าเกมรอบใหม่ได้เลย"
      : "กลับเข้าห้องแล้ว รอโฮสต์ตั้งค่าเกมรอบใหม่");
    showScreen("partyRoom");
    renderPlayers();
  }

  async function requestReturnToRoom() {
    if (!party.active || !party.channel) return false;
    if (party.isHost) {
      await send("return-to-room", { roomCode: party.roomCode });
      returnToRoom();
    } else {
      await send("return-to-room-request", { roomCode: party.roomCode });
    }
    return true;
  }

  function showHowTo() {
    const [title, text] = howToSteps[howToIndex];
    $("howtoTitle").textContent = title;
    $("howtoText").textContent = text;
    $("howtoDots").replaceChildren();
    howToSteps.forEach((_, index) => {
      const dot = document.createElement("span");
      if (index === howToIndex) dot.className = "active";
      $("howtoDots").appendChild(dot);
    });
  }

  async function copyInvite() {
    const inviteUrl = roomUrl();
    if (!inviteUrl) {
      setMessage("roomMessage", "ลิงก์เชิญข้ามเครื่องต้องเปิดเว็บผ่าน HTTPS ก่อน ใช้รหัสห้องร่วมกับลิงก์เว็บไซต์ได้: " + party.roomCode, true);
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setMessage("roomMessage", "คัดลอกลิงก์เชิญแล้ว ส่งให้เพื่อนเพื่อเข้าห้อง");
    } catch (error) {
      console.error("Unable to copy the invite link:", error);
      setMessage("roomMessage", `คัดลอกไม่ได้ ใช้รหัสห้อง ${party.roomCode} เพื่อเข้าร่วมแทน`, true);
    }
  }

  window.songTriviaParty = {
    get active() { return party.active; },
    get isHost() { return party.isHost; },
    previewReady() {
      if (!party.gameRunning) return;
      const index = window.songTriviaPartyGame.getQuestionIndex();
      party.readyPlayers.add(party.playerId);
      if (party.isHost) {
        tryStartReadyRound();
      } else {
        send("preview-ready", { index }).catch(error => {
          console.error("Unable to notify the host that audio is ready:", error);
          setMessage("feedback", error.message, true);
        });
      }
      if (party.roundStartSent && party.roundStartAt) {
        if (Date.now() >= party.roundStartAt) {
          window.songTriviaPartyGame.playPreview();
        } else {
          scheduleRoundPlayback(index, party.roundStartAt);
        }
      }
    },
    handleAnswer(answer) {
      if (!party.gameRunning) return false;
      const elapsedMs = party.roundStartedAt
        ? Math.min(window.songTriviaPartyGame.getQuestionTime() * 1000, performance.now() - party.roundStartedAt)
        : window.songTriviaPartyGame.getQuestionTime() * 1000;
      if (party.roundSettings.liveAnswers && answer !== null) {
        party.liveAnswers[party.playerId] = answer;
        renderLiveAnswers();
      }
      if (party.isHost) {
        if (party.winner) return true;
        if (party.answeredPlayers.has(party.playerId)) {
          if (answer === null) {
            endQuestion().catch(error => {
              console.error("Unable to finish the party question:", error);
              setMessage("feedback", error.message, true);
            });
          }
          return true;
        }
        recordAnswer(party.playerId, answer, elapsedMs);
        if (answer === null && !party.winner) {
          endQuestion().catch(error => {
            console.error("Unable to finish the party question:", error);
            setMessage("feedback", error.message, true);
          });
        }
      } else {
        if (party.winner || party.answeredPlayers.has(party.playerId)) return true;
        send("answer", {
          answer,
          elapsedMs,
          index: window.songTriviaPartyGame.getQuestionIndex()
        }).catch(error => {
          setMessage("feedback", error.message, true);
          party.answeredPlayers.delete(party.playerId);
          document.querySelectorAll(".answer-button").forEach(button => {
            button.disabled = false;
          });
        });
        party.answeredPlayers.add(party.playerId);
      }
      $("feedback").textContent = answer === null
        ? "หมดเวลาแล้ว กำลังรอผู้เล่นคนอื่น..."
        : "ส่งคำตอบแล้ว กำลังรอผู้เล่นคนอื่น...";
      $("feedback").className = "feedback";
      document.querySelectorAll(".answer-button").forEach(button => {
        button.disabled = true;
      });
      $("playBtn").disabled = true;
      return true;
    },
    handleNext() {
      if (!party.gameRunning || !party.isHost || party.winner === null) return true;
      clearTimeout(party.resultAdvanceTimer);
      const nextIndex = window.songTriviaPartyGame.getQuestionIndex() + 1;
      if (nextIndex >= window.songTriviaPartyGame.getSongs().length) {
        party.gameRunning = false;
        party.winner = null;
        const waitingIds = [...party.lateJoinQueue];
        party.lateJoinQueue.clear();
        const ranks = Object.fromEntries(
          Object.entries(party.scores)
            .sort((left, right) => {
              const correctDifference = (party.correctCounts[right[0]] || 0) -
                (party.correctCounts[left[0]] || 0);
              const pointsDifference = right[1] - left[1];
              return party.roundSettings.winCondition === "correct"
                ? correctDifference || pointsDifference
                : pointsDifference || correctDifference;
            })
            .map(([playerId], index) => [playerId, index + 1])
        );
        party.finalRank = ranks[party.playerId] || null;
        const playersById = new Map(presencePlayers().map(player => [player.id, player]));
        party.finalStandings = Object.entries(ranks)
          .sort((left, right) => left[1] - right[1])
          .map(([playerId, rank]) => {
            const player = playersById.get(playerId);
            return {
              id: playerId,
              name: player?.name || "ผู้เล่น",
              avatar: player?.avatar || "🎧",
              score: party.scores[playerId] || 0,
              correct: party.correctCounts[playerId] || 0,
              rank,
              isCurrentPlayer: playerId === party.playerId
            };
          });
        send("game-finished", {
          roomCode: party.roomCode,
          scores: party.scores,
          correctCounts: party.correctCounts,
          ranks,
          standings: party.finalStandings.map(({ isCurrentPlayer, ...player }) => player)
        }).catch(console.error);
        waitingIds.forEach(targetId => {
          send("join-rejected", {
            roomCode: party.roomCode,
            targetId,
            message: "เกมจบแล้ว ไม่สามารถเข้าร่วมได้"
          }).catch(console.error);
        });
      } else {
        party.winner = null;
        party.answeredPlayers.clear();
        party.song = window.songTriviaPartyGame.getSongs()[nextIndex];
        party.roundStartedAt = 0;
        resetRoundSync(nextIndex);
        const joiningIds = [...party.lateJoinQueue].filter(playerId =>
          presencePlayers().some(player => player.id === playerId)
        );
        joiningIds.forEach(playerId => party.lateJoinQueue.delete(playerId));
        (async () => {
          await send("next-round", { roomCode: party.roomCode, index: nextIndex });
          if (joiningIds.length) {
            await send("late-game-start", {
              roomCode: party.roomCode,
              targetIds: joiningIds,
              songs: window.songTriviaPartyGame.getSongs(),
              time: window.songTriviaPartyGame.getQuestionTime(),
              index: nextIndex,
              scores: party.scores,
              correctCounts: party.correctCounts,
              settings: party.roundSettings
            });
          }
        })().catch(error => {
          joiningIds.forEach(playerId => party.lateJoinQueue.add(playerId));
          console.error("Unable to advance to the next party round:", error);
          setMessage("feedback", error.message, true);
        });
      }
      return false;
    },
    startHostGame(gameSongs, questionTime) {
      party.active = true;
      party.gameRunning = true;
      party.winner = null;
      party.finalRank = null;
      party.finalStandings = null;
      $("questionLabel").textContent = "ฟังเพลงเดียวกัน แล้วตอบแข่งกับเพื่อน";
      party.song = gameSongs[0];
      party.roundStartedAt = 0;
      resetRoundSync(0);
      party.scores = Object.fromEntries(activePlayers().map(player => [player.id, 0]));
      party.correctCounts = Object.fromEntries(activePlayers().map(player => [player.id, 0]));
      party.answeredPlayers.clear();
      party.roundAnswers = {};
      party.liveAnswers = {};
      party.lateJoinQueue.clear();
      send("game-start", {
        roomCode: party.roomCode,
        songs: gameSongs,
        time: questionTime,
        scores: party.scores,
        correctCounts: party.correctCounts,
        settings: party.roundSettings
      }).catch(error => {
        setMessage("feedback", `เริ่มเกมออนไลน์ไม่ได้: ${error.message}`, true);
      });
    },
    getFinalRank: () => party.finalRank,
    getFinalStandings: () => party.finalStandings,
    requestReturnToRoom,
    leave: () => leaveParty()
  };

  $("avatarSelect").addEventListener("change", () => {
    $("avatarPreview").textContent = $("avatarSelect").value;
  });

  document.querySelectorAll("[data-home-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.homeAction;
      if (action === "home") {
        leaveParty().catch(error => {
          console.error("Unable to leave the room:", error);
          showScreen("home");
        });
      } else if (action === "solo") {
        if (party.channel) leaveParty(false).catch(console.error);
        showScreen("lobby");
        $("playerName").focus();
        window.songTriviaCatalog?.loadArtists();
        window.songTriviaCatalog?.refresh();
      } else if (action === "create") {
        setMessage("partySetupMessage", "");
        showScreen("partyProfile");
      } else if (action === "join") {
        showScreen("joinParty");
        $("joinName").focus();
      }
    });
  });

  $("createPartyForm").addEventListener("submit", async event => {
    event.preventDefault();
    const name = $("partyName").value.trim();
    if (!name) return $("partyName").focus();
    setMessage("partySetupMessage", "กำลังสร้างห้อง...");
    try {
      await connect(makeRoomCode(), { name, avatar: $("avatarSelect").value }, true);
    } catch (error) {
      console.error("Unable to create a party room:", error);
      setMessage("partySetupMessage", error.message, true);
      if (party.channel) await leaveParty(false);
    }
  });

  $("joinPartyForm").addEventListener("submit", async event => {
    event.preventDefault();
    const name = $("joinName").value.trim();
    const roomCode = $("joinCode").value.trim().toUpperCase();
    if (!name) return $("joinName").focus();
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(roomCode)) {
      setMessage("joinMessage", "รหัสห้องต้องมี 6 ตัวอักษรหรือตัวเลข", true);
      return $("joinCode").focus();
    }
    setMessage("joinMessage", "กำลังค้นหาห้อง...");
    try {
      await connect(roomCode, { name, avatar: "🎧" }, false);
    } catch (error) {
      console.error("Unable to join a party room:", error);
      setMessage("joinMessage", error.message, true);
      if (party.channel) await leaveParty(false);
    }
  });

  $("howtoPrevious").addEventListener("click", () => {
    howToIndex = (howToIndex + howToSteps.length - 1) % howToSteps.length;
    showHowTo();
  });
  $("howtoNext").addEventListener("click", () => {
    howToIndex = (howToIndex + 1) % howToSteps.length;
    showHowTo();
  });

  $("presetTab").addEventListener("click", () => {
    $("presetTab").classList.add("active");
    $("customTab").classList.remove("active");
    $("roomModeGrid").hidden = false;
    $("roomCustomOptions").hidden = true;
  });
  $("customTab").addEventListener("click", () => {
    $("customTab").classList.add("active");
    $("presetTab").classList.remove("active");
    $("roomModeGrid").hidden = true;
    $("roomCustomOptions").hidden = false;
  });
  document.querySelectorAll(".setting-toggle button").forEach(button => {
    button.addEventListener("click", () => {
      const { setting, value } = button.dataset;
      document.querySelectorAll(`.setting-toggle button[data-setting="${setting}"]`)
        .forEach(option => {
          option.setAttribute("aria-pressed", String(option === button));
        });
      if (setting === "liveAnswers") party.roundSettings.liveAnswers = value === "true";
      if (setting === "lateJoin") party.roundSettings.lateJoin = value === "true";
    });
  });
  $("inviteButton").addEventListener("click", async () => {
    const inviteUrl = roomUrl();
    if (!inviteUrl) {
      setMessage("roomMessage", "เผยแพร่เว็บผ่าน HTTPS ก่อนจึงจะส่งลิงก์ให้เพื่อนเปิดจากเครื่องอื่นได้ รหัสห้อง: " + party.roomCode, true);
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: "ทายเพลง", text: `เข้ามาทายเพลงด้วยกัน! รหัสห้อง ${party.roomCode}`, url: inviteUrl });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to share the invite:", error);
          await copyInvite();
        }
      }
    } else {
      await copyInvite();
    }
  });
  $("copyRoomButton").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(party.roomCode);
      setMessage("roomMessage", `คัดลอกรหัส ${party.roomCode} แล้ว`);
    } catch (error) {
      console.error("Unable to copy the room code:", error);
      setMessage("roomMessage", `คัดลอกไม่ได้ รหัสห้องคือ ${party.roomCode}`, true);
    }
  });
  $("leavePartyButton").addEventListener("click", () => {
    leaveParty().catch(error => {
      console.error("Unable to leave the room:", error);
      showScreen("home");
    });
  });
  $("roomNextButton").addEventListener("click", () => {
    if (!party.isHost) return;
    $("playerName").value = party.name;
    $("roundCountSelect").value = $("partyRounds").value;
    $("questionTimeSelect").value = $("partyTime").value;
    party.roundSettings = {
      winCondition: $("partyWinCondition").value,
      liveAnswers: document.querySelector('.setting-toggle button[data-setting="liveAnswers"][aria-pressed="true"]').dataset.value === "true",
      lateJoin: document.querySelector('.setting-toggle button[data-setting="lateJoin"][aria-pressed="true"]').dataset.value === "true"
    };
    updateSettings();
    setMessage("roomMessage", "");
    showScreen("lobby");
    window.songTriviaCatalog?.loadArtists();
    window.songTriviaCatalog?.refresh();
  });
  $("returnPartyButton").addEventListener("click", () => showScreen("partyRoom"));

  $("audio").addEventListener("play", () => {
    if (party.channel && !$("game").hidden && !party.roundStartedAt) {
      party.roundStartedAt = performance.now();
    }
  });
  $("audio").addEventListener("ended", () => {
    if (!$("game").hidden && !party.winner) {
      $("playLabel").textContent = "เพลงจบแล้ว รอเฉลยสักครู่";
    }
  });

  showHowTo();
  const inviteCode = new URLSearchParams(window.location.search).get("room");
  if (inviteCode) {
    $("joinCode").value = inviteCode.toUpperCase();
    showScreen("joinParty");
  } else {
    showScreen("home");
  }
  if (!window.SONG_TRIVIA_SUPABASE_URL || !window.SONG_TRIVIA_SUPABASE_ANON_KEY) {
    $("backendNotice").textContent = "โหมดเล่นคนเดียวใช้งานได้ทันที ส่วนห้องออนไลน์ต้องตั้งค่า Supabase URL และ anon key ใน supabase-config.js และเผยแพร่เว็บผ่าน HTTPS เพื่อให้เพื่อนเข้าจากเครื่องอื่นได้";
  } else if (window.location.protocol !== "https:") {
    $("backendNotice").textContent = "Supabase พร้อมแล้ว แต่การส่งลิงก์เชิญให้เพื่อนเข้าจากเครื่องอื่นต้องเผยแพร่เว็บผ่าน HTTPS ก่อน";
  }
})();
