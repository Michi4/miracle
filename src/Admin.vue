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
            <input v-model="form.password" type="password" autocomplete="current-password" class="mt-1 w-full border-[2px] border-black rounded-xl px-3 py-2 mono text-sm font-normal outline-none focus:shadow-[3px_3px_0px_#000]" />
          </label>
          <div v-if="loginError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl">{{ loginError }}</div>
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
          <div v-if="statusMsg" class="mono text-xs mt-2 opacity-80">{{ statusMsg }}</div>
          <div v-if="status" class="mono text-xs mt-3 flex flex-col gap-1.5">
            <div>Datenstand: <b>{{ statusAgo }}</b> • Modus: <b>{{ status.graph ? 'offizielle API' : 'öffentlich' }}</b></div>
            <div>@miracleechoes: <b>{{ status.band.followers }} Follower • {{ status.band.posts }} Posts</b></div>
            <div class="opacity-70">hannah_rumetshofer: {{ status.hannah.followers }} Follower • {{ status.hannah.posts }} Posts</div>
            <div class="opacity-70">sophie.fsdr: {{ status.sophie.followers }} Follower • {{ status.sophie.posts }} Posts</div>
            <div class="opacity-70">Reels auf der Seite: {{ status.media.length }} ({{ customCount }} per Link hinzugefügt)</div>
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
          <div v-if="reelMsg" class="mono text-xs font-bold px-3 py-2 rounded-xl mt-3" :class="reelOk ? 'bg-green-600 text-white' : 'bg-[#FF3B2F] text-white'">{{ reelMsg }}</div>
          <div v-if="customReels.length" class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div v-for="r in customReels" :key="r.id" class="relative rounded-xl overflow-hidden border-2 border-black/10 bg-black">
              <img :src="r.display_url" :alt="r.caption.slice(0, 60)" class="w-full aspect-[4/5] object-cover" loading="lazy" />
              <div class="absolute top-1.5 left-1.5 mono text-[9px] font-bold bg-white text-black px-2 py-0.5 rounded-full">{{ r.type }}</div>
              <button v-if="confirmReelId !== r.id" @click="confirmReelId = r.id" class="absolute top-1 right-1 mono text-[10px] font-bold bg-[#FF3B2F] text-white w-6 h-6 rounded-full">✕</button>
              <div v-else class="absolute inset-x-1 top-1 bg-white rounded-lg p-1.5 flex items-center justify-between gap-1">
                <span class="mono text-[9px] font-bold">Weg?</span>
                <span class="flex gap-1">
                  <button @click="removeReel(r.id)" :disabled="rowBusy === r.id" class="mono text-[9px] font-black bg-[#FF3B2F] text-white px-2 py-0.5 rounded-full disabled:opacity-50">Ja</button>
                  <button @click="confirmReelId = null" class="mono text-[9px] underline">Nein</button>
                </span>
              </div>
              <div class="absolute bottom-0 inset-x-0 mono text-[9px] text-white bg-black/70 px-2 py-1 truncate">{{ r.date }}</div>
            </div>
          </div>
        </section>

        <!-- GIGS -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_#000]">
          <div class="font-black text-lg">Gigs verwalten</div>
          <p class="mono text-xs opacity-60 mt-1">Änderungen sind sofort auf der Seite live.</p>
          <div v-if="gigError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl mt-3">{{ gigError }}</div>
          <div v-if="gigOk" class="mono text-xs font-bold bg-green-600 text-white px-3 py-2 rounded-xl mt-3">{{ gigOk }}</div>

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
            <label class="mono text-[11px] font-bold">AKTUELLES PASSWORT<input v-model="pw.current" type="password" autocomplete="current-password" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <label class="mono text-[11px] font-bold">NEUES PASSWORT (min. 10 Zeichen)<input v-model="pw.next" type="password" autocomplete="new-password" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <label class="mono text-[11px] font-bold">WIEDERHOLEN<input v-model="pw.repeat" type="password" autocomplete="new-password" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <div v-if="pwMsg" class="mono text-xs font-bold px-3 py-2 rounded-xl" :class="pwOk ? 'bg-green-600 text-white' : 'bg-[#FF3B2F] text-white'">{{ pwMsg }}</div>
            <button type="submit" :disabled="busy" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition w-fit disabled:opacity-50">{{ busy ? 'Moment …' : 'Passwort speichern' }}</button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiLogin, apiLogout, apiMe, apiChangePassword, apiCreateGig, apiUpdateGig, apiDeleteGig, apiTriggerSync, apiAddReel, apiDeleteReel, fetchGigs, fetchLive } from './api.js'
import { parseDate, startOfDay } from './gigs.js'

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
const status = ref(null)
const statusMsg = ref('')
const reelUrl = ref('')
const reelMsg = ref('')
const reelOk = ref(false)
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
const statusAgo = computed(() => timeAgo((status.value && (status.value.checkedAt || status.value.syncedAt)) || null))
const customReels = computed(() => (status.value && status.value.media ? status.value.media.filter((m) => m.addedAt) : []))
const customCount = computed(() => customReels.value.length)
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
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gespeichert — sofort live.')
  } catch (e) { await noteAuth(e) }
  finally { rowBusy.value = null }
}
async function addGig() {
  busy.value = true
  try {
    await apiCreateGig(gigPayload(fresh.value))
    fresh.value = { dateIso: '', place: '', city: '', note: '', link: '' }
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gig hinzugefügt — sofort live.')
  } catch (e) { await noteAuth(e) }
  finally { busy.value = false }
}
async function removeGig(id) {
  rowBusy.value = id
  try {
    await apiDeleteGig(id)
    confirmGigId.value = null
    await loadGigs(true)
    emit('gigs-changed')
    flashOk('Gelöscht.')
  } catch (e) { await noteAuth(e) }
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
    startStatusTimer()
  } catch { /* not logged in */ }
})
onUnmounted(() => {
  stopStatusTimer()
  window.removeEventListener('keydown', onKey)
})
</script>
