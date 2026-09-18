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
            <input v-model="form.username" type="text" autocomplete="username" class="mt-1 w-full border-[2px] border-black rounded-xl px-3 py-2 mono text-sm font-normal outline-none focus:shadow-[3px_3px_0px_#000]" />
          </label>
          <label class="mono text-xs font-bold">PASSWORT
            <input v-model="form.password" type="password" autocomplete="current-password" class="mt-1 w-full border-[2px] border-black rounded-xl px-3 py-2 mono text-sm font-normal outline-none focus:shadow-[3px_3px_0px_#000]" />
          </label>
          <div v-if="loginError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl">{{ loginError }}</div>
          <button type="submit" :disabled="busy" class="mono text-sm font-black bg-[#FFD23F] border-[2px] border-black px-5 py-2.5 rounded-full hover:shadow-[4px_4px_0px_#000] transition disabled:opacity-50">{{ busy ? '…' : 'Einloggen' }}</button>
        </form>
      </div>

      <div v-else class="mt-6 flex flex-col gap-4">
        <!-- LIVE STATUS -->
        <section class="bg-black text-white rounded-[24px] p-6 border-[2.5px] border-black">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="font-black text-lg">Instagram Live-Status</div>
            <button @click="doSync" :disabled="busy" class="mono text-xs font-bold bg-[#FFD23F] text-black px-4 py-2 rounded-full hover:bg-white transition disabled:opacity-50">{{ busy ? '…' : '↻ Jetzt syncen' }}</button>
          </div>
          <div v-if="statusMsg" class="mono text-xs mt-2 opacity-80">{{ statusMsg }}</div>
          <div v-if="status" class="mono text-xs mt-3 flex flex-col gap-1.5">
            <div>Letzter Sync: <b>{{ status.syncedAt ? new Date(status.syncedAt).toLocaleString('de-AT') : 'noch nie' }}</b></div>
            <div>Modus: <b>{{ status.graph ? 'offizielle API (Reels live)' : 'öffentliche Daten (Zahlen live, Reels fix)' }}</b></div>
            <div>@miracleechoes: <b>{{ status.band.followers }} Follower • {{ status.band.posts }} Posts</b></div>
            <div class="opacity-70">hannah_rumetshofer: {{ status.hannah.followers }} Follower • {{ status.hannah.posts }} Posts</div>
            <div class="opacity-70">sophie.fsdr: {{ status.sophie.followers }} Follower • {{ status.sophie.posts }} Posts</div>
            <div class="opacity-70">Live-Reels auf der Seite: {{ status.media.length }}</div>
          </div>
        </section>

        <!-- GIGS -->
        <section class="bg-white border-[2.5px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_#000]">
          <div class="font-black text-lg">Gigs verwalten</div>
          <p class="mono text-xs opacity-60 mt-1">Änderungen sind sofort auf der Seite live — kein Neu-Build nötig.</p>
          <div v-if="gigError" class="mono text-xs font-bold bg-[#FF3B2F] text-white px-3 py-2 rounded-xl mt-3">{{ gigError }}</div>
          <div v-if="gigOk" class="mono text-xs font-bold bg-green-600 text-white px-3 py-2 rounded-xl mt-3">{{ gigOk }}</div>

          <div class="mt-4 flex flex-col gap-2">
            <div v-for="g in gigs" :key="g.id" class="border-2 border-black/10 rounded-2xl p-3">
              <div v-if="editingId !== g.id" class="flex flex-wrap items-center gap-2">
                <span class="mono text-xs font-bold bg-black text-white px-3 py-1 rounded-full">{{ g.date }}</span>
                <span class="font-bold text-sm">{{ g.place }} <span class="opacity-60 font-normal">• {{ g.city }}</span></span>
                <span class="ml-auto flex gap-2">
                  <button @click="startEdit(g)" class="mono text-xs font-bold underline">Bearbeiten</button>
                  <button @click="removeGig(g)" class="mono text-xs font-bold text-[#FF3B2F] underline">Löschen</button>
                </span>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <label class="mono text-[11px] font-bold">DATUM (TT.MM.JJJJ)<input v-model="draft.date" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                  <label class="mono text-[11px] font-bold">LINK (https://…)<input v-model="draft.link" placeholder="https://…" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <label class="mono text-[11px] font-bold">ORT<input v-model="draft.place" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                  <label class="mono text-[11px] font-bold">STADT<input v-model="draft.city" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                </div>
                <label class="mono text-[11px] font-bold">NOTIZ<input v-model="draft.note" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
                <div class="flex gap-2">
                  <button @click="saveEdit(g.id)" class="mono text-xs font-black bg-[#FFD23F] border-2 border-black px-4 py-1.5 rounded-full">Speichern</button>
                  <button @click="editingId = null" class="mono text-xs underline">Abbrechen</button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 border-t-2 border-dashed border-black/15 pt-4">
            <div class="font-black text-sm">+ Neuer Gig</div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <label class="mono text-[11px] font-bold">DATUM (TT.MM.JJJJ)<input v-model="fresh.date" placeholder="23.08.2026" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[11px] font-bold">LINK (https://…)<input v-model="fresh.link" placeholder="https://…" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <label class="mono text-[11px] font-bold">ORT<input v-model="fresh.place" placeholder="Schlossgartenfest" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
              <label class="mono text-[11px] font-bold">STADT<input v-model="fresh.city" placeholder="Kremsmünster" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            </div>
            <label class="mono text-[11px] font-bold block mt-2">NOTIZ<input v-model="fresh.note" placeholder="Open Air • Stagetime 19:00" class="mt-1 w-full border-2 border-black rounded-lg px-2 py-1.5 mono text-xs font-normal" /></label>
            <button @click="addGig" class="mt-3 mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition">Gig hinzufügen</button>
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
            <button type="submit" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition w-fit">Passwort speichern</button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiLogin, apiLogout, apiMe, apiChangePassword, apiCreateGig, apiUpdateGig, apiDeleteGig, apiTriggerSync, fetchGigs, fetchLive } from './api.js'

const emit = defineEmits(['close', 'gigs-changed'])

const user = ref(null)
const busy = ref(false)
const form = ref({ username: '', password: '' })
const loginError = ref('')
const gigs = ref([])
const gigError = ref('')
const gigOk = ref('')
const editingId = ref(null)
const draft = ref({ date: '', place: '', city: '', note: '', link: '' })
const fresh = ref({ date: '', place: '', city: '', note: '', link: '' })
const pw = ref({ current: '', next: '', repeat: '' })
const pwMsg = ref('')
const pwOk = ref(false)
const status = ref(null)
const statusMsg = ref('')

async function loadGigs() {
  try {
    const j = await fetchGigs()
    gigs.value = j.gigs || []
  } catch (e) { gigError.value = 'Gigs konnten nicht geladen werden.' }
}
async function loadStatus() {
  try {
    const l = await fetchLive()
    status.value = l
    statusMsg.value = ''
  } catch { statusMsg.value = 'Status gerade nicht erreichbar.' }
}
function flashOk(msg) {
  gigError.value = ''
  gigOk.value = msg
  setTimeout(() => { gigOk.value = '' }, 4000)
}
function flashErr(msg) {
  gigOk.value = ''
  gigError.value = msg
}

async function doLogin() {
  busy.value = true
  loginError.value = ''
  try {
    const j = await apiLogin(form.value.username.trim(), form.value.password)
    user.value = j.user
    form.value.password = ''
    await Promise.all([loadGigs(), loadStatus()])
  } catch (e) {
    loginError.value = e.message || 'Login fehlgeschlagen.'
  } finally {
    busy.value = false
  }
}
async function doLogout() {
  await apiLogout()
  user.value = null
}
function startEdit(g) {
  editingId.value = g.id
  draft.value = { date: g.date, place: g.place, city: g.city, note: g.note || '', link: g.link || '' }
  gigError.value = ''
  gigOk.value = ''
}
async function saveEdit(id) {
  try {
    await apiUpdateGig(id, draft.value)
    editingId.value = null
    await loadGigs()
    emit('gigs-changed')
    flashOk('Gespeichert — sofort live. ✓')
  } catch (e) { flashErr(e.message) }
}
async function addGig() {
  try {
    await apiCreateGig(fresh.value)
    fresh.value = { date: '', place: '', city: '', note: '', link: '' }
    await loadGigs()
    emit('gigs-changed')
    flashOk('Gig hinzugefügt — sofort live. ✓')
  } catch (e) { flashErr(e.message) }
}
async function removeGig(g) {
  if (!confirm(`„${g.place}“ (${g.date}) wirklich löschen?`)) return
  try {
    await apiDeleteGig(g.id)
    await loadGigs()
    emit('gigs-changed')
    flashOk('Gelöscht. ✓')
  } catch (e) { flashErr(e.message) }
}
async function doPassword() {
  pwMsg.value = ''
  pwOk.value = false
  if (pw.value.next !== pw.value.repeat) { pwMsg.value = 'Passwörter stimmen nicht überein.'; return }
  try {
    await apiChangePassword(pw.value.current, pw.value.next)
    pw.value = { current: '', next: '', repeat: '' }
    pwOk.value = true
    pwMsg.value = 'Passwort geändert. ✓'
  } catch (e) { pwMsg.value = e.message }
}
async function doSync() {
  busy.value = true
  try {
    await apiTriggerSync()
    await loadStatus()
    statusMsg.value = 'Sync ok. ✓'
  } catch (e) { statusMsg.value = e.message }
  finally { busy.value = false }
}

onMounted(async () => {
  try {
    const j = await apiMe()
    user.value = j.user
    await Promise.all([loadGigs(), loadStatus()])
  } catch { /* not logged in */ }
})
</script>
