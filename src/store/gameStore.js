import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { wordPairs } from '../data/wordPairs.js';
import { assignRoles } from '../utils/assignRoles.js';
import { checkWinCondition } from '../utils/checkWinCondition.js';

const INITIAL_SETTINGS = {
  numUndercover: 1,
  includeMrWhite: false,
  category: 'random',
  discussionTimerSeconds: 60,
  votingMode: 'manual',
  rotateStartingSpeaker: true,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      // State
      players: [],
      totalPlayerCount: 4,
      settings: { ...INITIAL_SETTINGS },
      phase: 'HOME', // HOME, SETUP, PLAYER_JOIN, REVEAL, DISCUSSION, VOTING, ELIMINATION, MR_WHITE_GUESS, GAME_OVER
      round: 1,
      startingSpeakerIndex: 0,
      currentActionIndex: 0,
      votes: {}, // voterId -> targetId
      eliminatedPlayer: null,
      isTieVote: false,
      eliminationHistory: [],
      usedWordPairIds: [],
      civilianWord: null,
      undercoverWord: null,
      winner: null, // civilian, undercover, mrwhite
      sessionStats: {}, // playerId -> { name, gamesPlayed, gamesWon }

      // Actions

      setTotalPlayerCount: (count) => {
        const num = Math.min(12, Math.max(3, Number(count) || 4));
        set((state) => {
          const maxUndercover = Math.max(1, Math.floor(num / 3));
          return {
            totalPlayerCount: num,
            settings: {
              ...state.settings,
              numUndercover: Math.min(state.settings.numUndercover, maxUndercover),
            },
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      startPlayerJoin: () => {
        set({
          players: [],
          phase: 'PLAYER_JOIN',
          currentActionIndex: 0,
        });
      },

      joinPlayer: (name, avatarEmoji = null) => {
        const state = get();
        const trimmedName = name.trim();
        if (!trimmedName) return false;

        const joinOrder = state.players.length;
        const newPlayer = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          joinOrder,
          name: trimmedName,
          avatarEmoji: avatarEmoji || null,
          role: 'civilian',
          word: null,
          isEliminated: false,
          isRevealed: false,
        };

        const updatedPlayers = [...state.players, newPlayer];

        if (updatedPlayers.length >= state.totalPlayerCount) {
          set({ players: updatedPlayers });
          get().startGame();
        } else {
          set({
            players: updatedPlayers,
            currentActionIndex: updatedPlayers.length,
          });
        }
        return true;
      },

      startGame: () => {
        const state = get();
        if (state.players.length < 3) return;

        const playerIds = state.players.map((p) => p.id);
        const { assignedRoles, wordPairId, civilianWord, undercoverWord } = assignRoles(
          playerIds,
          state.settings,
          wordPairs,
          state.usedWordPairIds
        );

        const initializedPlayers = state.players.map((p) => ({
          ...p,
          role: assignedRoles[p.id].role,
          word: assignedRoles[p.id].word,
          isEliminated: false,
          isRevealed: false,
        }));

        const updatedUsedWordPairIds = [...state.usedWordPairIds, wordPairId];

        set({
          players: initializedPlayers,
          civilianWord,
          undercoverWord,
          usedWordPairIds: updatedUsedWordPairIds,
          round: 1,
          startingSpeakerIndex: 0,
          currentActionIndex: 0,
          votes: {},
          eliminatedPlayer: null,
          isTieVote: false,
          eliminationHistory: [],
          winner: null,
          phase: 'REVEAL',
        });
      },

      revealNext: () => {
        set((state) => {
          const updated = [...state.players];
          if (updated[state.currentActionIndex]) {
            updated[state.currentActionIndex].isRevealed = true;
          }
          return { players: updated };
        });
      },

      hideAndNext: () => {
        const state = get();
        if (state.currentActionIndex + 1 < state.players.length) {
          set({ currentActionIndex: state.currentActionIndex + 1 });
        } else {
          set({
            currentActionIndex: 0,
            phase: 'DISCUSSION',
          });
        }
      },

      proceedToVoting: () => {
        const state = get();
        const firstActiveIndex = state.players.findIndex((p) => !p.isEliminated);
        set({
          phase: 'VOTING',
          votes: {},
          currentActionIndex: state.settings.votingMode === 'private' ? (firstActiveIndex >= 0 ? firstActiveIndex : 0) : 0,
        });
      },

      submitVote: (voterId, targetId) => {
        const state = get();
        const updatedVotes = { ...state.votes, [voterId]: targetId };

        if (state.settings.votingMode === 'private') {
          // Find next active voter
          const activePlayers = state.players.filter((p) => !p.isEliminated);
          const currentVoterIndex = activePlayers.findIndex((p) => p.id === voterId);
          
          if (currentVoterIndex >= 0 && currentVoterIndex + 1 < activePlayers.length) {
            const nextVoter = activePlayers[currentVoterIndex + 1];
            const nextGlobalIndex = state.players.findIndex((p) => p.id === nextVoter.id);
            set({
              votes: updatedVotes,
              currentActionIndex: nextGlobalIndex,
            });
          } else {
            // All active players voted
            set({ votes: updatedVotes });
            get().tallyVotesAndEliminate();
          }
        } else {
          set({ votes: updatedVotes });
        }
      },

      tallyVotesAndEliminate: (manualTargetId = null) => {
        const state = get();
        const activePlayers = state.players.filter((p) => !p.isEliminated);

        let targetPlayer = null;
        let isTie = false;

        if (manualTargetId) {
          targetPlayer = state.players.find((p) => p.id === manualTargetId) || null;
        } else {
          // Count votes
          const voteCounts = {};
          for (const target of Object.values(state.votes)) {
            voteCounts[target] = (voteCounts[target] || 0) + 1;
          }

          let maxVotes = 0;
          let topCandidates = [];

          for (const [targetId, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
              maxVotes = count;
              topCandidates = [targetId];
            } else if (count === maxVotes) {
              topCandidates.push(targetId);
            }
          }

          if (topCandidates.length === 1 && maxVotes > 0) {
            targetPlayer = state.players.find((p) => p.id === topCandidates[0]) || null;
          } else {
            // Tie or no votes cast
            isTie = true;
          }
        }

        if (isTie || !targetPlayer) {
          set({
            isTieVote: true,
            eliminatedPlayer: null,
            phase: 'ELIMINATION',
          });
        } else {
          const updatedPlayers = state.players.map((p) =>
            p.id === targetPlayer.id ? { ...p, isEliminated: true } : p
          );

          const historyEntry = {
            round: state.round,
            playerId: targetPlayer.id,
            name: targetPlayer.name,
            role: targetPlayer.role,
          };

          set({
            players: updatedPlayers,
            eliminatedPlayer: targetPlayer,
            isTieVote: false,
            eliminationHistory: [...state.eliminationHistory, historyEntry],
            phase: 'ELIMINATION',
          });
        }
      },

      proceedFromElimination: () => {
        const state = get();
        if (state.isTieVote) {
          get().nextRound();
          return;
        }

        const elim = state.eliminatedPlayer;
        if (elim && elim.role === 'mrwhite') {
          set({ phase: 'MR_WHITE_GUESS' });
        } else {
          const winner = checkWinCondition(state.players);
          if (winner) {
            get().finishGame(winner);
          } else {
            get().nextRound();
          }
        }
      },

      submitMrWhiteGuess: (guess) => {
        const state = get();
        const cleanGuess = (guess || '').trim().toLowerCase();
        const cleanCivilianWord = (state.civilianWord || '').trim().toLowerCase();

        if (cleanGuess === cleanCivilianWord) {
          get().finishGame('mrwhite');
        } else {
          const winner = checkWinCondition(state.players);
          if (winner) {
            get().finishGame(winner);
          } else {
            get().nextRound();
          }
        }
      },

      nextRound: () => {
        const state = get();
        const activePlayers = state.players.filter((p) => !p.isEliminated);

        let nextSpeakerIndex = state.startingSpeakerIndex;
        if (state.settings.rotateStartingSpeaker && activePlayers.length > 0) {
          // Move speaker to next active player in join order circle
          let candidate = (state.startingSpeakerIndex + 1) % state.players.length;
          while (state.players[candidate] && state.players[candidate].isEliminated) {
            candidate = (candidate + 1) % state.players.length;
          }
          nextSpeakerIndex = candidate;
        }

        set({
          round: state.round + 1,
          startingSpeakerIndex: nextSpeakerIndex,
          eliminatedPlayer: null,
          isTieVote: false,
          votes: {},
          phase: 'DISCUSSION',
        });
      },

      finishGame: (winner) => {
        const state = get();
        // Update session stats
        const updatedStats = { ...state.sessionStats };
        for (const player of state.players) {
          if (!updatedStats[player.id]) {
            updatedStats[player.id] = { name: player.name, gamesPlayed: 0, gamesWon: 0 };
          }
          updatedStats[player.id].gamesPlayed += 1;

          let isWinner = false;
          if (winner === 'civilian' && player.role === 'civilian') isWinner = true;
          if (winner === 'undercover' && player.role === 'undercover') isWinner = true;
          if (winner === 'mrwhite' && player.role === 'mrwhite') isWinner = true;

          if (isWinner) {
            updatedStats[player.id].gamesWon += 1;
          }
        }

        set({
          winner,
          sessionStats: updatedStats,
          phase: 'GAME_OVER',
        });
      },

      playAgain: () => {
        const state = get();
        // Keep players list and joinOrder intact, reset status
        const resetPlayers = state.players.map((p) => ({
          ...p,
          role: 'civilian',
          word: null,
          isEliminated: false,
          isRevealed: false,
        }));

        set({ players: resetPlayers });
        get().startGame();
      },

      resetToSetup: () => {
        set({
          players: [],
          phase: 'SETUP',
          round: 1,
          winner: null,
          eliminatedPlayer: null,
          votes: {},
        });
      },

      resetAll: () => {
        set({
          players: [],
          totalPlayerCount: 4,
          settings: { ...INITIAL_SETTINGS },
          phase: 'HOME',
          round: 1,
          startingSpeakerIndex: 0,
          currentActionIndex: 0,
          votes: {},
          eliminatedPlayer: null,
          isTieVote: false,
          eliminationHistory: [],
          civilianWord: null,
          undercoverWord: null,
          winner: null,
        });
      },

      resumeGame: () => {
        const state = get();
        if (state.phase === 'HOME' || state.phase === 'GAME_OVER') {
          set({ phase: 'SETUP' });
        }
      },
    }),
    {
      name: 'undercover-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
