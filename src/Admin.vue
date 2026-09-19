<template>
  <div class="min-h-full bg-[#FFF8E8] text-[#1c1a17] px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="mono text-[11px] tracking-[0.3em] opacity-60">MIRACLE</div>
          <h1 class="instrument text-4xl leading-none mt-1">Admin</h1>
        </div>
        <div class="flex gap-2">
          <button v-if="user" @click="doLogout" class="mono text-xs font-bold border-[2px] border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition">Logout</button>
          <button @click="$emit('close')" class="mono text-xs font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-[#FF3B2F] transition">✕ Seite</button>
        </div>
      </div>

      <!-- LOGIN -->
      <div v-if="!user" class="mt-6 bg-white border-[2.5px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_#000]">
        <div class="font-black text-lg">Login</div>
        <p class="mono text-xs opacity-60 mt-1">Nur für Hannah &amp; Sophie.</p>
        <form @submit.prevent="doLogin" class="mt-4 flex flex-col gap-3">
          <label class="mono text-xs font-bold">BENUTZERNAME
            <input v-model="form.username" type="text" autocomplete="username" autofocus class="mt-1 w-full border-[2px] border-black rounded-xl px-3 py-2 mono text-sm font-normal outline-none focus:shadow-[3px_3px_0px_#000]" />
          </label>
          <label class="mono text-xs font-bold">PASSWORT
            <span class="relative block mt-1">
              <input v-model="form.password" :type="showLogin ? 'text' : 'password'" autocomplete="current-password" class="w-full border-[2px] border-black rounded-xl pl-3 pr-10 py-2 mono text-sm font-normal outline-none focus:shadow-[3px_3px_0px_#000]" />
              <button type="button" @click="showLogin = !showLogin" :aria-label="showLogin ? 'Passwort verbergen' : 'Passwort anzeigen'" class="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition p-1">
                <svg v-if="!showLogin" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </span>
          </label>
          <div class="min-h-[2.5rem]"><div v-if="loginError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl">{{ loginError }}</div></div>
          <button type="submit" :disabled="busy" class="mono text-sm font-black bg-[#FFD23F] border-[2px] border-black px-5 py-2.5 rounded-full hover:shadow-[4px_4px_0px_#000] transition disabled:opacity-50">{{ busy ? 'Moment …' : 'Einloggen' }}</button>
        </form>
      </div>

      <div v-else class="mt-6 flex flex-col gap-4">
        <!-- LIVE STATUS -->
        <section class="bg-black text-white rounded-[24px] p-6 border-[2.5px] border-black">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="font-black text-lg">Instagram Live-Status</div>
            <button @click="doSync" :disabled="busy" class="mono text-xs font-bold bg-[#FFD23F] text-black px-4 py-2 rounded-full hover:bg-white transition disabled:opacity-50">{{ busy ? 'Moment …' : '↻ Jetzt syncen' }}</button>
          </div>
          <div class="mono text-xs mt-2 min-h-[1rem] opacity-80">{{ statusMsg }}</div>
          <div v-if="status" class="mono text-xs mt-3 flex flex-col gap-1.5">
            <div>Letzter erfolgreicher Sync: <b>{{ status.syncedAt ? timeAgo(status.syncedAt) : 'noch nie' }}</b> • Modus: <b>{{ status.graph ? 'offizielle API' : 'öffentlich' }}</b></div>
            <div v-if="!status.syncedAt" class="bg-[#FFD23F] text-black font-bold px-3 py-2 rounded-xl">Noch keine Live-Daten — Instagram blockiert unseren Server gerade (Rate-Limit). Wird automatisch erneut versucht (mit wachsender Pause bei Block). Zahlen unten sind gespeicherte Werte.</div>
            <div>@miracleechoes: <b>{{ status.band.followers }} Follower • {{ status.band.posts }} Posts</b><span v-if="!status.syncedAt" class="opacity-60"> (gespeichert)</span></div>
            <div class="opacity-70">hannah_rumetshofer: {{ status.hannah.followers }} Follower • {{ status.hannah.posts }} Posts<span v-if="!status.syncedAt"> (gespeichert)</span></div>
            <div class="opacity-70">sophie.fsdr: {{ status.sophie.followers }} Follower • {{ status.sophie.posts }} Posts<span v-if="!status.syncedAt"> (gespeichert)</span></div>
            <div class="opacity-70">Reels auf der Seite: {{ status.media.length }} ({{ customCount }} per Link hinzugefügt)</div>
          </div>
        </section>

        <!-- STATS -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6">
          <div class="font-black text-lg">Zahlen manuell pflegen</div>
          <p class="mono text-xs opacity-60 mt-1">Backup, falls der Sync blockiert ist. Manuelle Werte gewinnen immer und sofort.</p>
          <div class="mt-2 min-h-[2.5rem]"><div v-if="statsMsg" class="mono text-xs font-bold px-3 py-2 rounded-xl" :class="statsOk ? 'bg-green-600 text-white' : 'bg-[#FF3B2F] text-white'">{{ statsMsg }}</div></div>
          <div v-for="acc in [['band', '@miracleechoes'], ['hannah', 'hannah_rumetshofer'], ['sophie', 'sophie.fsdr']]" :key="acc[0]" class="mt-2 border-2 border-black/10 rounded-2xl p-3">
            <div class="mono text-[11px] font-bold flex items-center gap-2">{{ acc[1] }}<span v-if="isManual(acc[0])" class="bg-[#FFD23F] border border-black px-2 py-0.5 rounded-full">MANUELL</span></div>
            <div class="grid grid-cols-3 gap-2 mt-1.5">
              <label class="mono text-[10px] font-bold">POSTS<input v-model.number="statsForm[acc[0]].posts" type="number" min="0" step="1" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[10px] font-bold">FOLLOWER<input v-model.number="statsForm[acc[0]].followers" type="number" min="0" step="1" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[10px] font-bold">FOLGT<input v-model.number="statsForm[acc[0]].following" type="number" min="0" step="1" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 items-center mt-3">
            <button @click="saveStats" :disabled="busy" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition disabled:opacity-50">{{ busy ? 'Moment …' : 'Zahlen speichern' }}</button>
            <button @click="resetStats" :disabled="busy" class="mono text-xs underline disabled:opacity-50">Zurücksetzen (Sync übernimmt)</button>
          </div>
        </section>

        <!-- REELS -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_#000]">
          <div class="font-black text-lg">Reels live bringen</div>
          <p class="mono text-xs opacity-60 mt-1">Link eines Posts/Reels einfügen — erscheint sofort auf der Seite, kein Meta-Setup nötig.</p>
          <form @submit.prevent="addReel" class="mt-3 flex gap-2">
            <input v-model="reelUrl" type="url" inputmode="url" placeholder="https://www.instagram.com/miracleechoes/reel/…" class="flex-1 min-w-0 border-[2px] border-black rounded-xl px-3 py-2 mono text-xs outline-none focus:shadow-[3px_3px_0px_#000]" />
            <button type="submit" :disabled="busy || !reelUrl.trim()" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition disabled:opacity-50 shrink-0">{{ busy ? '…' : '+ Hinzufügen' }}</button>
          </form>
          <div class="mt-3 min-h-[2.75rem]"><div v-if="reelMsg" class="mono text-xs font-bold px-3 py-2 rounded-xl" :class="reelOk ? 'bg-green-600 text-white' : 'bg-[#FF3B2F] text-white'">{{ reelMsg }}</div></div>
          <div v-if="customReels.length" class="mt-3 flex flex-col gap-2">
            <div v-for="r in customReels" :key="r.id" class="border-2 border-black/10 rounded-2xl p-2 flex gap-3 items-start">
              <img :src="r.display_url" :alt="r.caption.slice(0, 60)" class="w-16 aspect-[4/5] object-cover rounded-lg bg-black shrink-0" loading="lazy" />
              <div class="min-w-0 flex-1">
                <div v-if="editReelId !== r.id">
                  <div class="mono text-[9px] font-bold opacity-60">{{ r.type }} • {{ r.date }}</div>
                  <div class="text-sm leading-snug break-words">{{ r.caption }}</div>
                  <div class="flex flex-wrap gap-3 mt-1.5">
                    <button @click="startReelEdit(r)" class="mono text-[11px] font-bold underline">Bearbeiten</button>
                    <button v-if="confirmReelId !== r.id" @click="confirmReelId = r.id; reelMsg = ''" class="mono text-[11px] font-bold text-[#FF3B2F] underline">Entfernen</button>
                    <span v-else class="mono text-[11px] flex items-center gap-2">Wirklich?
                      <button @click="removeReel(r.id)" :disabled="rowBusy === r.id" class="font-black text-[#FF3B2F] underline disabled:opacity-50">Ja</button>
                      <button @click="confirmReelId = null" class="underline">Nein</button>
                    </span>
                  </div>
                </div>
                <div v-else class="flex flex-col gap-1.5">
                  <label class="mono text-[10px] font-bold">TEXT<input v-model="reelDraft.caption" maxlength="600" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1 mono text-xs font-normal" /></label>
                  <div class="grid grid-cols-2 gap-1.5">
                    <label class="mono text-[10px] font-bold">DATUM (TT.MM.JJJJ)<input v-model="reelDraft.date" placeholder="06.08.2026" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1 mono text-xs font-normal" /></label>
                    <label class="mono text-[10px] font-bold">TYP<select v-model="reelDraft.type" class="mt-0.5 w-full border-2 border-black rounded-lg px-2 py-1 mono text-xs font-normal"><option value="REEL">REEL</option><option value="PHOTO">PHOTO</option></select></label>
                  </div>
                  <div class="flex gap-3 items-center">
                    <button @click="saveReelEdit(r.id)" :disabled="rowBusy === r.id" class="mono text-[11px] font-black bg-[#FFD23F] border-2 border-black px-3 py-1 rounded-full disabled:opacity-50">{{ rowBusy === r.id ? '…' : 'Speichern' }}</button>
                    <button @click="editReelId = null" class="mono text-[11px] underline">Abbrechen</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 border-t-2 border-dashed border-black/15 pt-4">
            <div class="font-black text-sm">Feste Auswahl</div>
            <p class="mono text-[11px] opacity-60 mt-0.5">Fixe Posts bei Bedarf ausblenden — ohne sie zu löschen.</p>
            <div class="mt-2 flex flex-col gap-1.5">
              <div v-for="p in bakedPosts" :key="p.url" class="flex gap-2.5 items-center border-2 rounded-xl p-1.5" :class="isHidden(p.url) ? 'border-black/10 opacity-60' : 'border-black/10'">
                <img :src="p.display_url" :alt="p.caption.slice(0, 40)" class="w-11 aspect-[4/5] object-cover rounded-md bg-black shrink-0" loading="lazy" />
                <div class="min-w-0 flex-1 mono text-[11px] leading-snug break-words">{{ p.caption.split('#')[0].trim().slice(0, 90) }}<span v-if="isHidden(p.url)" class="font-bold"> (versteckt)</span></div>
                <button @click="toggleHidden(p.url)" :disabled="busy" class="mono text-[11px] font-bold underline shrink-0 disabled:opacity-50">{{ isHidden(p.url) ? 'Anzeigen' : 'Verbergen' }}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- GIGS -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_#000]">
          <div class="font-black text-lg">Gigs verwalten</div>
          <p class="mono text-xs opacity-60 mt-1">Änderungen sind sofort auf der Seite live.</p>
          <div class="mt-3 min-h-[2.75rem]">
            <div v-if="gigError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl">{{ gigError }}</div>
            <div v-if="gigOk" class="mono text-xs font-bold bg-green-600 text-white px-3 py-2 rounded-xl">{{ gigOk }}</div>
          </div>

          <div v-if="!gigs.length" class="mono text-xs opacity-60 mt-4 border-2 border-dashed border-black/20 rounded-2xl p-4 text-center">Noch keine Gigs — leg unten den ersten an.</div>
          <div class="mt-4 flex flex-col gap-2">
            <div v-for="g in sortedGigs" :key="g.id" class="border-2 border-black/10 rounded-2xl p-3" :class="g.past ? 'opacity-70' : ''">
              <div v-if="editingId !== g.id" class="flex flex-wrap items-center gap-2">
                <span class="mono text-xs font-bold bg-black text-white px-3 py-1 rounded-full shrink-0">{{ g.date }}</span>
                <span class="font-bold text-sm min-w-0">{{ g.place }} <span class="opacity-60 font-normal">• {{ g.city }}</span></span>
                <span class="mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="g.next ? 'bg-[#FFD23F] border border-black' : (g.past ? 'border border-black/30 opacity-70' : 'bg-black text-white')">{{ g.next ? 'NÄCHSTER' : (g.past ? 'VORBEI' : 'ANSTEHEND') }}</span>
                <span class="ml-auto flex gap-3 shrink-0">
                  <button @click="startEdit(g)" class="mono text-xs font-bold underline">Bearbeiten</button>
                  <button v-if="confirmGigId !== g.id" @click="confirmGigId = g.id; gigError = ''; gigOk = ''" class="mono text-xs font-bold text-[#FF3B2F] underline">Löschen</button>
                  <span v-else class="mono text-xs flex items-center gap-2">Wirklich? <button @click="removeGig(g.id)" :disabled="rowBusy === g.id" class="font-black text-[#FF3B2F] underline disabled:opacity-50">Ja</button><button @click="confirmGigId = null" class="underline">Nein</button></span>
                </span>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <label class="mono text-[11px] font-bold">DATUM<input v-model="draft.dateIso" type="date" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                  <label class="mono text-[11px] font-bold">LINK (https://…)<input v-model="draft.link" type="url" inputmode="url" placeholder="https://…" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <label class="mono text-[11px] font-bold">ORT<input v-model="draft.place" maxlength="80" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                  <label class="mono text-[11px] font-bold">STADT<input v-model="draft.city" maxlength="80" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                </div>
                <label class="mono text-[11px] font-bold">NOTIZ ({{ (draft.note || '').length }}/160)<input v-model="draft.note" maxlength="160" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                <div class="flex gap-3 items-center">
                  <button @click="saveEdit(g.id)" :disabled="rowBusy === g.id" class="mono text-xs font-black bg-[#FFD23F] border-2 border-black px-4 py-1.5 rounded-full disabled:opacity-50">{{ rowBusy === g.id ? '…' : 'Speichern' }}</button>
                  <button @click="editingId = null" class="mono text-xs underline">Abbrechen</button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 border-t-2 border-dashed border-black/15 pt-4">
            <div class="font-black text-sm">+ Neuer Gig</div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <label class="mono text-[11px] font-bold">DATUM<input v-model="fresh.dateIso" type="date" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[11px] font-bold">LINK (https://…)<input v-model="fresh.link" type="url" inputmode="url" placeholder="https://…" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <label class="mono text-[11px] font-bold">ORT<input v-model="fresh.place" maxlength="80" placeholder="Schlossgartenfest" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[11px] font-bold">STADT<input v-model="fresh.city" maxlength="80" placeholder="Kremsmünster" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            </div>
            <label class="mono text-[11px] font-bold block mt-2">NOTIZ ({{ (fresh.note || '').length }}/160)<input v-model="fresh.note" maxlength="160" placeholder="Open Air • Stagetime 19:00" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <button @click="addGig" :disabled="busy" class="mt-3 mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition disabled:opacity-50">{{ busy ? 'Moment …' : 'Gig hinzufügen' }}</button>
          </div>
        </section>

        <!-- PASSWORD -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6">
          <div class="font-black text-lg">Passwort ändern</div>
          <form @submit.prevent="doPassword" class="mt-3 flex flex-col gap-2">
            <label class="mono text-[11px] font-bold">AKTUELLES PASSWORT
              <span class="relative block mt-1">
                <input v-model="pw.current" :type="showPw ? 'text' : 'password'" autocomplete="current-password" class="w-full border-2 border-black rounded-lg pl-2 pr-9 py-1.5 mono text-xs font-normal" />
                <button type="button" @click="showPw = !showPw" :aria-label="showPw ? 'Passwörter verbergen' : 'Passwörter anzeigen'" class="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition p-0.5">
                  <svg v-if="!showPw" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </span>
            </label>
            <label class="mono text-[11px] font-bold">NEUES PASSWORT<input v-model="pw.next" :type="showPw ? 'text' : 'password'" autocomplete="new-password" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <label class="mono text-[11px] font-bold">WIEDERHOLEN<input v-model="pw.repeat" :type="showPw ? 'text' : 'password'" autocomplete="new-password" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <div class="min-h-[2.5rem]"><div v-if="pwMsg" class="mono text-xs font-bold px-3 py-2 rounded-xl" :class="pwOk ? 'bg-green-600 text-white' : 'bg-[#FF3B2F] text-white'">{{ pwMsg }}</div></div>
            <button type="submit" :disabled="busy" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition w-fit disabled:opacity-50">{{ busy ? 'Moment …' : 'Passwort speichern' }}</button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiLogin, apiLogout, apiMe, apiChangePassword, apiCreateGig, apiUpdateGig, apiDeleteGig, apiTriggerSync, apiAddReel, apiDeleteReel, apiEditReel, apiSaveStats, apiClearStats, apiSetHidden, fetchGigs, fetchLive } from './api.js'
import { parseDate, startOfDay } from './gigs.js'
import { bakedPosts } from './posts.js'

const emit = defineEmits(['close', 'gigs-changed', 'live-changed'])

const user = ref(null)
const busy = ref(false)
const rowBusy = ref(null)
const form = ref({ username: '', password: '' })
const loginError = ref('')
const gigs = ref([])
const gigError = ref('')
const gigOk = ref('')
const editingId = ref(null)
const confirmGigId = ref(null)
const confirmReelId = ref(null)
const draft = ref({ dateIso: '', place: '', city: '', note: '', link: '' })
const fresh = ref({ dateIso: '', place: '', city: '', note: '', link: '' })
const pw = ref({ current: '', next: '', repeat: '' })
const pwMsg = ref('')
const pwOk = ref(false)
const showLogin = ref(false)
const showPw = ref(false)
const status = ref(null)
const statusMsg = ref('')
const reelUrl = ref('')
const reelMsg = ref('')
const reelOk = ref(false)
const editReelId = ref(null)
const reelDraft = ref({ caption: '', date: '', type: 'REEL' })
const statsForm = ref({ band: { posts: 0, followers: 0, following: 0 }, hannah: { posts: 0, followers: 0, following: 0 }, sophie: { posts: 0, followers: 0, following: 0 } })
const statsMsg = ref('')
const statsOk = ref(false)
let statusTimer = null

function isoToDe(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  return m ? `${m[3]}.${m[2]}.${m[1]}` : ''
}
function deToIso(de) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(de || '')
  return m ? `${m[3]}-${m[2]}-${m[1]}` : ''
}
function timeAgo(iso) {
  if (!iso) return 'noch nie'
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'gerade eben'
  if (s < 3600) return `vor ${Math.floor(s / 60)} Min.`
  if (s < 86400) return `vor ${Math.floor(s / 3600)} Std.`
  return new Date(iso).toLocaleString('de-AT')
}
const customReels = computed(() => (status.value && status.value.media ? status.value.media.filter((m) => m.addedAt) : []))
const customCount = computed(() => customReels.value.length)
const hiddenSet = computed(() => new Set(status.value && Array.isArray(status.value.hidden) ? status.value.hidden : []))
function isManual(key) {
  return !!(status.value && status.value[key] && status.value[key].manual)
}
function isHidden(url) {
  return hiddenSet.value.has(url)
}
function populateStats() {
  for (const k of ['band', 'hannah', 'sophie']) {
    const a = status.value && status.value[k]
    if (a) statsForm.value[k] = { posts: a.posts || 0, followers: a.followers || 0, following: a.following || 0 }
  }
}
const sortedGigs = computed(() => {
  const day = startOfDay(new Date())
  const rows = gigs.value.map((g) => {
    const d = parseDate(g.date)
    return { ...g, past: !!(d && d < day), ts: d ? d.getTime() : 0 }
  })
  const up = rows.filter((g) => !g.past).sort((a, b) => a.ts - b.ts)
  const past = rows.filter((g) => g.past).sort((a, b) => b.ts - a.ts)
  if (up.length) up[0].next = true
  return [...up, ...past]
})

async function loadGigs(fresh = false) {
  const j = await fetchGigs(fresh)
  gigs.value = j.gigs || []
}
async function loadStatus(fresh = false) {
  status.value = await fetchLive(fresh)
}
function flashOk(msg) {
  gigError.value = ''
  gigOk.value = msg
  setTimeout(() => { if (gigOk.value === msg) gigOk.value = '' }, 4000)
}
function flashErr(msg) {
  gigOk.value = ''
  gigError.value = msg
}
// true = war 401 und ist behandelt (ausgeloggt + Hinweis)
async function noteAuth(e, silent) {
  if (e && e.status === 401) {
    await doLogout(true)
    loginError.value = 'Session abgelaufen — bitte neu einloggen.'
    return true
  }
  if (!silent) flashErr(e && e.message ? e.message : 'Fehler.')
  return false
}
function gigPayload(f) {
  return { date: isoToDe(f.dateIso), place: (f.place || '').trim(), city: (f.city || '').trim(), note: (f.note || '').trim(), link: (f.link || '').trim() }
}

async function doLogin() {
  busy.value = true
  loginError.value = ''
  try {
    const j = await apiLogin(form.value.username.trim(), form.value.password)
    user.value = j.user
    form.value.password = ''
    await Promise.all([loadGigs(), loadStatus()])
    populateStats()
    startStatusTimer()
  } catch (e) {
    loginError.value = (e && e.message) || 'Login fehlgeschlagen.'
  } finally {
    busy.value = false
  }
}
async function doLogout(silent) {
  stopStatusTimer()
  await apiLogout()
  user.value = null
  if (!silent) { form.value.password = '' }
}
function startStatusTimer() {
  stopStatusTimer()
  statusTimer = setInterval(() => { loadStatus(true).catch(() => {}) }, 60000)
}
function stopStatusTimer() {
  if (statusTimer) { clearInterval(statusTimer); statusTimer = null }
}
function startEdit(g) {
  editingId.value = g.id
  confirmGigId.value = null
  draft.value = { dateIso: deToIso(g.date), place: g.place, city: g.city, note: g.note || '', link: g.link || '' }
  gigError.value = ''
  gigOk.value = ''
}
async function saveEdit(id) {
  rowBusy.value = id
  try {
    await apiUpdateGig(id, gigPayload(draft.value))
    editingId.value = null
    // optimistic: patch row instantly, reconcile with server afterwards
    gigs.value = gigs.value.map((g) => g.id === id ? { id, ...gigPayload(draft.value) } : g)
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gespeichert — sofort live.')
  } catch (e) { await noteAuth(e); try { await loadGigs(true) } catch {} }
  finally { rowBusy.value = null }
}
async function addGig() {
  busy.value = true
  try {
    const c = await apiCreateGig(gigPayload(fresh.value))
    fresh.value = { dateIso: '', place: '', city: '', note: '', link: '' }
    // optimistic: show instantly, reconcile with server afterwards
    if (c && c.gig) gigs.value = [...gigs.value, c.gig]
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gig hinzugefügt — sofort live.')
  } catch (e) { await noteAuth(e); try { await loadGigs(true) } catch {} }
  finally { busy.value = false }
}
async function removeGig(id) {
  rowBusy.value = id
  try {
    await apiDeleteGig(id)
    confirmGigId.value = null
    // optimistic: row vanishes instantly, reconcile with server afterwards
    gigs.value = gigs.value.filter((g) => g.id !== id)
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gelöscht.')
  } catch (e) { await noteAuth(e); try { await loadGigs(true) } catch {} }
  finally { rowBusy.value = null }
}
async function addReel() {
  busy.value = true
  reelMsg.value = ''
  reelOk.value = false
  try {
    await apiAddReel(reelUrl.value.trim())
    reelUrl.value = ''
    confirmReelId.value = null
    await loadStatus(true)
    emit('live-changed')
    reelOk.value = true
    reelMsg.value = 'Reel ist jetzt auf der Seite.'
  } catch (e) {
    if (!(await noteAuth(e, true))) { reelMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    busy.value = false
  }
}
async function removeReel(id) {
  rowBusy.value = id
  try {
    await apiDeleteReel(id)
    confirmReelId.value = null
    await loadStatus(true)
    emit('live-changed')
    reelOk.value = true
    reelMsg.value = 'Reel entfernt.'
  } catch (e) {
    if (!(await noteAuth(e, true))) { reelMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    rowBusy.value = null
  }
}
function startReelEdit(r) {
  editReelId.value = r.id
  confirmReelId.value = null
  reelDraft.value = { caption: r.caption || '', date: r.date || '', type: r.type === 'PHOTO' ? 'PHOTO' : 'REEL' }
  reelMsg.value = ''
}
async function saveReelEdit(id) {
  rowBusy.value = id
  try {
    await apiEditReel(id, { caption: reelDraft.value.caption.trim(), date: reelDraft.value.date.trim(), type: reelDraft.value.type })
    editReelId.value = null
    await loadStatus(true)
    emit('live-changed')
    reelOk.value = true
    reelMsg.value = 'Reel aktualisiert.'
  } catch (e) {
    reelOk.value = false
    if (!(await noteAuth(e, true))) { reelMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    rowBusy.value = null
  }
}
async function toggleHidden(url) {
  busy.value = true
  try {
    const next = isHidden(url) ? [...hiddenSet.value].filter((u) => u !== url) : [...hiddenSet.value, url]
    await apiSetHidden(next)
    await loadStatus(true)
    emit('live-changed')
  } catch (e) {
    if (!(await noteAuth(e, true))) { reelMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    busy.value = false
  }
}
async function saveStats() {
  busy.value = true
  statsMsg.value = ''
  statsOk.value = false
  try {
    const clean = {}
    for (const k of ['band', 'hannah', 'sophie']) {
      const f = statsForm.value[k] || {}
      clean[k] = { posts: Math.max(0, Math.floor(Number(f.posts) || 0)), followers: Math.max(0, Math.floor(Number(f.followers) || 0)), following: Math.max(0, Math.floor(Number(f.following) || 0)) }
    }
    await apiSaveStats(clean)
    await loadStatus(true)
    emit('live-changed')
    statsOk.value = true
    statsMsg.value = 'Zahlen gespeichert — sofort live.'
  } catch (e) {
    if (!(await noteAuth(e, true))) { statsMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    busy.value = false
  }
}
async function resetStats() {
  busy.value = true
  try {
    await apiClearStats()
    await loadStatus(true)
    populateStats()
    emit('live-changed')
    statsOk.value = true
    statsMsg.value = 'Zurückgesetzt — Sync übernimmt wieder.'
  } catch (e) {
    if (!(await noteAuth(e, true))) { statsMsg.value = (e && e.message) || 'Fehler.' }
  } finally {
    busy.value = false
  }
}
async function doPassword() {
  pwMsg.value = ''
  pwOk.value = false
  if (pw.value.next !== pw.value.repeat) { pwMsg.value = 'Passwörter stimmen nicht überein.'; return }
  busy.value = true
  try {
    await apiChangePassword(pw.value.current, pw.value.next)
    pw.value = { current: '', next: '', repeat: '' }
    pwOk.value = true
    pwMsg.value = 'Passwort geändert.'
  } catch (e) {
    if (!(await noteAuth(e, true))) pwMsg.value = (e && e.message) || 'Fehler.'
  } finally {
    busy.value = false
  }
}
async function doSync() {
  busy.value = true
  try {
    await apiTriggerSync()
    await loadStatus(true)
    statusMsg.value = 'Sync ok.'
  } catch (e) {
    if (!(await noteAuth(e, true))) statusMsg.value = (e && e.message) || 'Sync fehlgeschlagen.'
  } finally {
    busy.value = false
  }
}
function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  try {
    const j = await apiMe()
    user.value = j.user
    await Promise.all([loadGigs(), loadStatus()])
    populateStats()
    startStatusTimer()
  } catch { /* not logged in */ }
})
onUnmounted(() => {
  stopStatusTimer()
  window.removeEventListener('keydown', onKey)
})
</script>
