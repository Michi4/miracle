<template>
  <div class="fixed inset-0 -z-10 bg-[#FFF8E8]"></div>
  <div class="fixed inset-0 -z-10 opacity-[0.045]" style="background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence baseFrequency=%220.85%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')"></div>
  <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden will-change-transform" style="transform: translateZ(0);">
    <!-- big colorful blobs - fewer but bigger -->
    <div class="absolute -top-[10%] -right-[8%] w-[1100px] h-[1100px] rounded-full blur-[100px] opacity-[0.22]" style="background: radial-gradient(circle at 30% 30%, #FF1A1A 0%, #FF6B00 35%, #FF8A00 55%, transparent 75%)"></div>
    <div class="absolute -bottom-[10%] -left-[8%] w-[1000px] h-[1000px] rounded-full blur-[110px] opacity-[0.20]" style="background: radial-gradient(circle at 40% 40%, #3D2AFF 0%, #5B6BFF 30%, #9A7DFF 55%, transparent 78%)"></div>
    <div class="absolute top-[40%] left-[30%] w-[700px] h-[700px] rounded-full blur-[90px] opacity-[0.12]" style="background: radial-gradient(circle, #FFD23F 0%, #FFE566 35%, transparent 72%)"></div>
    <!-- 15 bigger notes -->
    <div class="absolute top-[8%] left-[10%] text-4xl opacity-[0.07] rotate-[-10deg] select-none hidden md:block" style="animation: floatNote 8s ease-in-out infinite;">𝄞</div>
    <div class="absolute top-[14%] right-[12%] text-4xl opacity-[0.06] rotate-[12deg] select-none hidden md:block" style="animation: floatNote 7s ease-in-out infinite 0.3s;">♪</div>
    <div class="absolute top-[22%] left-[8%] text-3xl opacity-[0.06] rotate-[-8deg] select-none hidden md:block" style="animation: floatNote 9s ease-in-out infinite 0.6s;">♫</div>
    <div class="absolute top-[36%] right-[8%] text-3xl opacity-[0.05] rotate-[10deg] select-none hidden md:block" style="animation: floatNote 8s ease-in-out infinite 0.4s;">♩</div>
    <div class="absolute top-[48%] left-[5%] text-3xl opacity-[0.05] rotate-[-12deg] select-none hidden md:block" style="animation: floatNote 9s ease-in-out infinite 0.8s;">♬</div>
    <div class="absolute bottom-[20%] left-[7%] text-4xl opacity-[0.05] rotate-[-10deg] select-none hidden md:block" style="animation: floatNote 7s ease-in-out infinite 1s;">𝄞</div>
    <div class="absolute bottom-[14%] right-[10%] text-3xl opacity-[0.06] rotate-[8deg] select-none hidden md:block" style="animation: floatNote 8.5s ease-in-out infinite 0.5s;">𝄢</div>
    <div class="absolute top-[58%] left-[14%] text-3xl opacity-[0.04] rotate-[14deg] select-none hidden lg:block" style="animation: floatNote 8s ease-in-out infinite 1.2s;">♫</div>
    <div class="absolute top-[68%] left-[18%] text-2xl opacity-[0.05] rotate-[-14deg] select-none hidden md:block" style="animation: floatNote 7s ease-in-out infinite 0.9s;">♩</div>
    <div class="absolute top-[6%] right-[18%] text-3xl opacity-[0.05] rotate-[14deg] select-none hidden md:block" style="animation: floatNote 9s ease-in-out infinite 0.2s;">♭</div>
    <div class="absolute top-[78%] left-[10%] text-2xl opacity-[0.04] rotate-[10deg] select-none hidden lg:block" style="animation: floatNote 7s ease-in-out infinite 1.4s;">♯</div>
    <div class="absolute bottom-[8%] right-[16%] text-2xl opacity-[0.04] rotate-[-8deg] select-none hidden md:block" style="animation: floatNote 9s ease-in-out infinite 1.6s;">𝅝</div>

    <!-- big vivid dots more contrast blurry -->
    <div class="absolute top-[6%] left-[20%] w-[260px] h-[260px] rounded-full blur-[32px] opacity-[0.18]" style="background: #FF1A1A"></div>
    <div class="absolute top-[48%] left-[4%] w-[300px] h-[300px] rounded-full blur-[36px] opacity-[0.16]" style="background: #3D2AFF"></div>
    <div class="absolute top-[68%] right-[8%] w-[200px] h-[200px] rounded-full blur-[26px] opacity-[0.13]" style="background: #FFD23F"></div>
    <div class="absolute bottom-[12%] left-[18%] w-[160px] h-[160px] rounded-full blur-[22px] opacity-[0.10]" style="background: #FF8A00"></div>
    <div class="absolute top-[22%] right-[14%] w-[140px] h-[140px] rounded-full blur-[20px] opacity-[0.09]" style="background: #C8B6FF"></div>

    <div class="absolute text-3xl opacity-[0.09] rotate-[6deg] select-none hidden md:block" style="top:65%; left:55%; animation: floatNote 5s ease-in-out infinite 0.5s;">♫</div>
    <div class="absolute text-2xl opacity-[0.07] rotate-[-2deg] select-none hidden md:block" style="top:82%; left:65%; animation: floatNote 7s ease-in-out infinite 0.9s;">♪</div>
    <div class="absolute text-3xl opacity-[0.07] rotate-[-14deg] select-none hidden md:block" style="top:76%; left:11%; animation: floatNote 6s ease-in-out infinite 0.4s;">♩</div>
    <div class="absolute text-3xl opacity-[0.08] rotate-[15deg] select-none hidden md:block" style="top:73%; left:67%; animation: floatNote 6s ease-in-out infinite 0.1s;">𝄞</div>
    <div class="absolute text-4xl opacity-[0.06] rotate-[5deg] select-none hidden md:block" style="top:6%; left:38%; animation: floatNote 6s ease-in-out infinite 0.6s;">𝄢</div>
    <div class="absolute text-2xl opacity-[0.08] rotate-[12deg] select-none hidden md:block" style="top:7%; left:78%; animation: floatNote 5s ease-in-out infinite 0.4s;">♪</div>
    <div class="absolute text-4xl opacity-[0.09] rotate-[10deg] select-none hidden md:block" style="top:74%; left:35%; animation: floatNote 5s ease-in-out infinite 1.5s;">♫</div>
    <div class="absolute text-2xl opacity-[0.07] rotate-[8deg] select-none hidden md:block" style="top:32%; left:33%; animation: floatNote 6s ease-in-out infinite 1.7s;">♬</div>
    <div class="absolute text-3xl opacity-[0.07] rotate-[-13deg] select-none hidden md:block" style="top:52%; left:85%; animation: floatNote 6s ease-in-out infinite 1.8s;">𝄢</div>
    <div class="absolute text-4xl opacity-[0.09] rotate-[-7deg] select-none hidden md:block" style="top:38%; left:35%; animation: floatNote 6s ease-in-out infinite 0.6s;">♫</div>
    <div class="absolute text-3xl opacity-[0.09] rotate-[-16deg] select-none hidden md:block" style="top:8%; left:34%; animation: floatNote 7s ease-in-out infinite 1.7s;">♫</div>
    <div class="absolute text-2xl opacity-[0.07] rotate-[9deg] select-none hidden md:block" style="top:21%; left:48%; animation: floatNote 6s ease-in-out infinite 2.0s;">𝄢</div>
    <div class="absolute text-4xl opacity-[0.06] rotate-[-2deg] select-none hidden md:block" style="top:22%; left:17%; animation: floatNote 6s ease-in-out infinite 1.3s;">♬</div>
    <div class="absolute text-4xl opacity-[0.07] rotate-[-15deg] select-none hidden md:block" style="top:23%; left:41%; animation: floatNote 5s ease-in-out infinite 1.6s;">♬</div>
    <div class="absolute text-2xl opacity-[0.07] rotate-[8deg] select-none hidden md:block" style="top:41%; left:44%; animation: floatNote 7s ease-in-out infinite 1.1s;">♪</div>
    <div class="absolute text-3xl opacity-[0.05] rotate-[-3deg] select-none hidden md:block" style="top:42%; left:44%; animation: floatNote 11s ease-in-out infinite 2.0s;">♯</div>
    <div class="absolute text-xl opacity-[0.06] rotate-[-15deg] select-none hidden md:block" style="top:45%; left:76%; animation: floatNote 10s ease-in-out infinite 1.8s;">𝄢</div>
    <div class="absolute text-xl opacity-[0.04] rotate-[-13deg] select-none hidden md:block" style="top:43%; left:82%; animation: floatNote 11s ease-in-out infinite 1.2s;">♬</div>
    <div class="absolute text-3xl opacity-[0.06] rotate-[12deg] select-none hidden md:block" style="top:14%; left:18%; animation: floatNote 9s ease-in-out infinite 1.3s;">♯</div>
    <div class="absolute text-xl opacity-[0.08] rotate-[2deg] select-none hidden md:block" style="top:15%; left:89%; animation: floatNote 11s ease-in-out infinite 1.5s;">𝄢</div>
    <div class="absolute text-xl opacity-[0.07] rotate-[8deg] select-none hidden md:block" style="top:24%; left:9%; animation: floatNote 9s ease-in-out infinite 0.7s;">♬</div>
    <div class="absolute text-3xl opacity-[0.06] rotate-[13deg] select-none hidden md:block" style="top:54%; left:30%; animation: floatNote 10s ease-in-out infinite 0.9s;">𝄞</div>
    <div class="absolute text-2xl opacity-[0.08] rotate-[-16deg] select-none hidden md:block" style="top:62%; left:9%; animation: floatNote 9s ease-in-out infinite 1.2s;">♭</div>
    <div class="absolute text-2xl opacity-[0.08] rotate-[3deg] select-none hidden md:block" style="top:81%; left:39%; animation: floatNote 7s ease-in-out infinite 2.3s;">♯</div>
    <div class="absolute text-xl opacity-[0.06] rotate-[20deg] select-none hidden md:block" style="top:42%; left:65%; animation: floatNote 11s ease-in-out infinite 1.0s;">♯</div>
  </div>

  <!-- cursor -->
  <div ref="cursor" class="hidden fixed top-0 left-0 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black pointer-events-none z-[90] items-center justify-center mix-blend-difference bg-white will-change-transform" style="display:none">
    <div ref="cursorDot" class="w-1 h-1 bg-black rounded-full"></div>
  </div>

  <div ref="preloader" class="fixed inset-0 z-[100] bg-[#0A0A0A] text-[#FFF8E8] flex flex-col items-center justify-center">
    <div class="instrument text-[22vw] lg:text-[16vw] leading-none tracking-[-0.02em] flex justify-center overflow-hidden" style="letter-spacing: -0.02em;">
      <span v-for="c in 'MIRACLE'" class="pre-char inline-block translate-y-full">{{c}}</span>
    </div>
  </div>

  <nav ref="nav" class="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 px-2 py-2 rounded-full bg-black text-white mono text-[11px] tracking-widest opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
    <a href="#about" :class="active==='about' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'" class="px-4 py-1.5 rounded-full transition">{{ isDe ? 'ÜBER UNS' : 'ABOUT' }}</a>
    <a href="#music" :class="active==='music' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'" class="px-4 py-1.5 rounded-full transition">REELS</a>
    <a href="#live" :class="active==='live' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'" class="px-4 py-1.5 rounded-full transition">LIVE</a>
    <button @click="locale = locale==='de' ? 'en' : 'de'" class="px-3 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition">{{ locale==='de' ? 'EN' : 'DE' }}</button>
    <a href="https://www.instagram.com/miracleechoes/" target="_blank" class="ml-1 bg-[#FF3B2F] px-4 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 hover:bg-white hover:text-black transition"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> Instagram</a>
  </nav>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex md:hidden items-center gap-1 px-2 py-2 rounded-full bg-black text-white mono text-[11px] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
    <a href="#about" class="px-3 py-1.5 bg-white text-black rounded-full">{{ isDe ? 'ÜBER' : 'ABOUT' }}</a>
    <a href="#music" class="px-3 py-1.5 border border-white/20 rounded-full">MUSIK</a>
    <a href="#live" class="px-3 py-1.5 border border-white/20 rounded-full">LIVE</a>
    <a href="https://www.instagram.com/miracleechoes/" target="_blank" class="bg-[#FF3B2F] w-8 h-8 grid place-items-center rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg></a>
  </div>

  <div id="discoWrap" class="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center cursor-grab active:cursor-grabbing" style="transform-origin: top center; animation: swing 3.4s ease-in-out infinite;">
    <div class="w-px h-[88px] bg-neutral-800 mx-auto" style="width:1px;"></div>
    <div id="discoBallLight" style="top: 88px;"></div>
    <div id="discoBall" style="top: 88px;"><div id="discoBallMiddle"></div></div>
  </div>

  <main class="relative">
    <!-- HERO - perfect first view -->
    <section id="about" class="relative min-h-[100dvh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-6 overflow-hidden">
      <div class="absolute bottom-[14%] left-[4%] hidden lg:block pointer-events-none opacity-50">
        
      </div>


      <div class="max-w-[1600px] mx-auto w-full relative z-10">
        

        <h1 ref="heroTitle" class="instrument text-[21vw] sm:text-[18vw] lg:text-[15.5vw] leading-[1.2] tracking-[-0.02em] mt-3 flex flex-wrap relative overflow-visible py-3">
          <span v-for="l in 'MIRACLE'" class="inline-block overflow-visible py-2"><span class="hero-char inline-block translate-y-full leading-[1.3] pt-1 pb-1 tracking-normal">{{l}}</span></span>
        </h1>

        <!-- perfect hero cards: 2 clean cards for Hannah & Sophie + next gig ticket - all original, no 19 -->
        <div class="grid lg:grid-cols-12 gap-4 mt-6 max-w-[1400px] items-stretch" style="animation: fadeInUp 0.8s ease-out;">
          <div class="lg:col-span-5 flex flex-col gap-4 h-full">
            <a href="https://www.instagram.com/miracleechoes/" target="_blank" class="group bg-[#FFD23F] border-[2.5px] border-black rounded-[20px] p-3.5 flex gap-3 items-center font-bold hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
              <span class="font-black">@miracleechoes</span>
              <span class="mono text-xs">auf Instagram folgen</span>
              <span class="ml-auto w-8 h-8 rounded-full bg-black text-white grid place-items-center group-hover:bg-[#FF3B2F] transition shrink-0">↗</span>
            </a>
            <a href="https://www.instagram.com/hannah_rumetshofer/" target="_blank" class="group bg-white border-[2.5px] border-black rounded-[20px] p-3.5 flex gap-3 items-center hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition relative overflow-hidden flex-1">
              <img :src="'/images/post_05.jpg'" class="w-14 h-14 rounded-full object-cover border-2 border-black shrink-0"/>
              <div class="min-w-0">
                <div class="mono text-[10px] tracking-widest opacity-40">GITARRE</div>
                <div class="font-black leading-none truncate">hannah_rumetshofer</div>
                <div class="mono text-xs opacity-60 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg> 12 Posts • 307 Follower</div>
              </div>
              <span class="ml-auto w-8 h-8 rounded-full bg-black text-white grid place-items-center group-hover:bg-[#FF3B2F] transition shrink-0">↗</span>
            </a>
            <a href="https://www.instagram.com/sophie.fsdr/" target="_blank" class="group bg-black text-white border-[2.5px] border-black rounded-[20px] p-3.5 flex gap-3 items-center hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition relative overflow-hidden flex-1">
              <div class="absolute top-2 right-2 text-sm opacity-30">🪩</div>
              <img :src="'/images/sophie.jpg'" class="w-14 h-14 rounded-full object-cover border-2 border-white shrink-0"/>
              <div class="min-w-0">
                <div class="mono text-[10px] tracking-widest opacity-50">GESANG</div>
                <div class="font-black leading-none truncate">sophie.fsdr</div>
                <div class="mono text-xs opacity-70 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg> 19 Posts • 741 Follower</div>
              </div>
              <span class="ml-auto w-8 h-8 rounded-full bg-white text-black grid place-items-center shrink-0">↗</span>
            </a>

          </div>

          <!-- next gig ticket - perfect - narrower -->
          <div class="lg:col-span-6 lg:col-start-7 bg-black text-white rounded-[28px] p-0 flex flex-col overflow-hidden border-[2.5px] border-black shadow-[8px_8px_0px_#000] rotate-[0.3deg] h-full">
            <div class="p-6 relative overflow-hidden">
              <div class="absolute inset-0 opacity-[0.12]" style="background: radial-gradient(500px 250px at 90% 0%, #FF3B2F, transparent), radial-gradient(400px 300px at 0% 100%, #5B6BFF, transparent)"></div>
              <div class="relative inline-flex items-center gap-2 mono text-[10px] tracking-[0.18em] bg-[#FFD23F] text-black px-3 py-1 rounded-full font-bold">{{ nextGigLabel }}</div>
              <div class="relative instrument text-[28px] leading-[0.9] mt-3">{{ nextGig.place }}<br><span class="text-[#FFD23F] italic">{{ nextGig.city }}</span></div>
              <div class="relative mono text-xs opacity-60 mt-1">{{ nextGig.note }}</div>
            </div>
            <div class="relative flex items-center justify-between bg-white text-black px-6 py-3 border-t-[2.5px] border-black border-dashed">
              <span class="mono text-[11px] tracking-widest font-bold">EINTRITT FREI</span>
              <a :href="nextGig.link" target="_blank" class="mono text-xs font-black bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF3B2F] transition inline-flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg> {{ isDe ? 'ALLE INFOS' : 'DETAILS' }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

        <!-- SOUNDCLOUD - coming soon -->
    <section id="soundcloud" class="px-4 sm:px-6 lg:px-8 xl:px-10 py-8 bg-[#FF3B2F] text-white relative overflow-hidden border-y-[3px] border-black">
      <div class="absolute inset-0 opacity-10" style="background-image:radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size:20px 20px"></div>
      <div class="max-w-[1600px] mx-auto relative flex flex-col md:flex-row gap-6 items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-white text-[#FF3B2F] grid place-items-center border-2 border-black shadow-[4px_4px_0px_#000]">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 9.5a5.5 5.5 0 0 0-4.5 2.3 3.5 3.5 0 0 0 0 7H15a4.5 4.5 0 0 0 0-9c-.3 0-.6 0-.9.1A5.5 5.5 0 0 0 11.5 9.5z"/><circle cx="3" cy="14.5" r="1.5" opacity=".7"/><circle cx="5.5" cy="13" r="1.2" opacity=".9"/></svg>
          </div>
          <div>
            <div class="mono text-[11px] tracking-[0.2em] opacity-70">SOUNDCLOUD</div>
            <div class="instrument text-3xl leading-none">SoundCloud <span class="mono text-xs bg-white text-[#FF3B2F] px-2 py-1 rounded-full font-bold ml-2">COMING SOON</span></div>
          </div>
        </div>
      </div>
    </section>

<!-- MUSIC -->
    <section id="music" class="px-4 sm:px-6 lg:px-8 xl:px-10 py-8 bg-[#0A0A0A] text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03]" style="background-image:radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size:24px 24px"></div>
      <div class="max-w-[1600px] mx-auto relative">
        <div class="flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div class="mono text-[11px] tracking-[0.35em] opacity-40">{{ isDe ? 'REELS — VON @miracleechoes' : 'REELS — FROM @miracleechoes' }}</div>
            <h2 class="instrument text-[10vw] lg:text-[5vw] leading-[0.85] mt-1">Reels</h2>
          </div>
          <a href="https://www.instagram.com/miracleechoes/" target="_blank" class="mono text-xs font-bold bg-white text-black px-6 py-3 rounded-full hover:bg-[#FF3B2F] hover:text-white transition inline-flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg> {{ isDe ? 'ALLE 28 ANSEHEN' : 'SEE 28 POSTS' }}</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <a v-for="post in posts" :key="post.url" :href="post.url" target="_blank" class="group bg-[#1A1A1E] rounded-[28px] overflow-hidden border border-white/10 hover:border-white/20 hover:-translate-y-1 transition flex flex-col">
            <div class="relative bg-black overflow-hidden aspect-[4/5]">
              <img :src="post.display_url" alt="" class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" loading="lazy"/>
              <div class="absolute top-3 left-3 mono text-[10px] tracking-widest bg-white text-black px-3 py-1 rounded-full font-bold">{{post.type}}</div>
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 grid place-items-center text-white text-xs">↗</div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <div class="mono text-[11px] opacity-40">{{post.date}}</div>
              <div class="font-medium text-[15px] leading-[1.45] mt-1 break-words">{{post.caption.split('#')[0].trim()}}</div>
              <div v-if="post.caption.includes('#')" class="mono text-[11px] opacity-30 mt-1 break-words">#{{post.caption.split('#').slice(1).join(' #').trim()}}</div>
            </div>
          </a>
        </div>
      </div>
    </section>


    <!-- LIVE -->
    <section id="live" class="w-full py-8">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div class="mono text-[11px] tracking-[0.3em] opacity-40">LIVE</div>
      </div>
      <div class="mono text-[11px] tracking-[0.3em] opacity-40">LIVE</div>
      <div class="mt-4 border-y-[3px] md:border-[3px] md:rounded-[32px] overflow-hidden bg-white shadow-[0_16px_50px_rgba(0,0,0,0.08)] md:mx-4 lg:mx-8 xl:mx-10">
        <div class="p-7 md:p-8 flex flex-wrap gap-6 justify-between items-center bg-gradient-to-br from-white via-[#FFF8E8] to-[#FFE9A8] relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-[#FF3B2F] rounded-full blur-[40px] opacity-10"></div>
          <div>
            <div class="inline-flex items-center gap-2 mono text-[11px] font-bold bg-black text-white px-3 py-1.5 rounded-full">{{ isDe ? 'NÄCHSTER GIG' : 'NEXT UP' }} — {{ nextGig.date }}</div>
            <div class="instrument text-4xl md:text-5xl leading-none mt-3">{{ nextGig.place }}<br><span class="text-[#FF3B2F]">{{ nextGig.city }}</span></div>
            <div class="mono text-xs opacity-60 mt-2">{{ nextGig.note }} • {{ isDe ? 'Oberösterreich' : 'Upper Austria' }}</div>
          </div>
          <a :href="nextGig.link" target="_blank" class="mono text-xs font-bold bg-black text-white px-7 py-3.5 rounded-full hover:bg-[#FF3B2F] transition inline-flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg> {{ isDe ? 'INFOS' : 'INFO' }}</a>
        </div>
        <div class="border-t border-black/10">
          <div class="px-6 py-3 mono text-[11px] tracking-[0.2em] opacity-40 flex justify-between bg-black/[0.02]"><span>{{ isDe ? 'VERGANGENE AUFTRITTE' : 'PAST SHOWS' }}</span><span class="opacity-60">Instagram</span></div>
          <div v-for="g in pastGigs" :key="g.date+g.place" class="flex flex-wrap gap-3 px-6 py-3.5 border-t border-black/5 hover:bg-black/[0.02] transition text-sm">
            <span class="mono text-xs font-bold bg-black text-white px-3 py-1 rounded-full shrink-0">{{g.date}}</span>
            <span class="font-bold">{{g.place}}</span>
            <span class="opacity-60 mono text-xs">{{g.note}}</span>
            <a :href="g.link" target="_blank" class="ml-auto mono text-xs font-bold underline inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8"/></svg> Instagram</a>
          </div>
        </div>
        <div class="bg-black text-white px-6 py-4 mono text-xs flex flex-wrap justify-between gap-3">
          <span class="opacity-70">{{ isDe ? 'Mehr Shows → folge @miracleechoes' : 'More shows → follow @miracleechoes' }} • 28 Posts</span>
          <a href="mailto:instagram.com/miracleechoes" class="underline decoration-[#FFD23F]">instagram.com/miracleechoes</a>
        </div>
      </div>
    </section>

    <footer class="px-4 sm:px-6 lg:px-8 xl:px-10 py-8 mono text-xs opacity-60 max-w-[1600px] mx-auto flex flex-wrap justify-between gap-4 border-t border-black/5">
      <span>© 2026 MIRACLE — @miracleechoes • 28 Posts • {{ isDe ? 'Oberösterreich' : 'Upper Austria' }}</span>
      <span class="flex gap-4"><a href="https://www.instagram.com/miracleechoes/" target="_blank" class="underline inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8"/></svg> Instagram</a> <a href="https://www.instagram.com/hannah_rumetshofer/" target="_blank" class="underline">Hannah</a> <a href="https://www.instagram.com/sophie.fsdr/" target="_blank" class="underline">Sophie</a></span>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const locale = ref('de')
const isDe = computed(()=> locale.value==='de')
const tr = computed(()=> isDe.value ? {
  nav_about: 'ÜBER UNS', nav_music: 'REELS', nav_live: 'LIVE',
  hero_bio: 'BIO — ORIGINAL',
  hero_next: 'HEUTE — 23.08. • 19:00',
  hero_next_city: 'Kremsmünster',
  hero_next_note: 'Stagetime 19:00 • Oberösterreich — Open Air',
  about_title: 'MIRACLE IST', about_sub: 'Hannah<br>& Sophie', about_desc: 'Gitarre & Gesang • Oberösterreich • 🪩 Disco',
  music_label: 'REELS — VON @miracleechoes', music_title: 'Reels',
  live_label: 'LIVE', live_next: 'NÄCHSTER GIG — 23.08.2026 • 19:00', live_city: 'Kremsmünster', live_note: 'nächster Gig: 23.08. - Schlossgartenfest Kremsmünster • Oberösterreich',
  past_title: 'VERGANGENE AUFTRITTE', past_sub: 'aus Instagram', more_shows: 'Mehr Shows → folge @miracleechoes',
  footer: '© 2026 MIRACLE — @miracleechoes • 28 Posts • Oberösterreich',
  see_all: 'ALLE 28 ANSEHEN', infos: 'INFOS', details: 'DETAILS', instagram: 'Instagram'
} : {
  nav_about: 'ABOUT', nav_music: 'REELS', nav_live: 'LIVE',
  hero_bio: 'BIO — ORIGINAL',
  hero_next: 'TODAY — 23.08. • 7PM',
  hero_next_city: 'Kremsmünster',
  hero_next_note: 'Stagetime 7PM • Upper Austria — Open Air',
  about_title: 'MIRACLE IS', about_sub: 'Hannah<br>& Sophie', about_desc: 'Guitar & Vocals • Upper Austria • 🪩 Disco',
  music_label: 'REELS — FROM @miracleechoes', music_title: 'Reels',
  live_label: 'LIVE', live_next: 'NEXT UP — 23.08.2026 • 7PM', live_city: 'Kremsmünster', live_note: 'next gig: 23.08. - Schlossgartenfest Kremsmünster • Upper Austria',
  past_title: 'PAST SHOWS', past_sub: 'from Instagram', more_shows: 'More shows → follow @miracleechoes',
  footer: '© 2026 MIRACLE — @miracleechoes • 28 posts • Upper Austria',
  see_all: 'SEE 28 POSTS', infos: 'INFO', details: 'DETAILS', instagram: 'Instagram'
})
const active = ref('about')

const allGigs = [
  { date:'07.08.2025', place:'Kirchdorfer Stadtspektakel', city:'Kirchdorf', note:'Stagetime 19:00 — Ein MIRACLE Classic', link:'https://www.instagram.com/miracleechoes/reel/DbtYTr4umA3/' },
  { date:'01.02.2026', place:'Bar-Café Hildegard', city:'Scharnstein', note:'tagging @miracleechoes', link:'https://www.instagram.com/hildegard__bar/p/DUNaCaADzgc/' },

  { date:'23.08.2026', place:'Schlossgartenfest', city:'Kremsmünster', note:'Open Air • Stagetime 19:00', link:'https://www.instagram.com/miracleechoes/' },
  { date:'07.08.2026', place:'Kirchdorfer Stadtspektakel', city:'Kirchdorf', note:'Offene Bühne — Session Opener Throwback', link:'https://www.instagram.com/miracleechoes/reel/DYCn-9rIgqN/' },
]

function parseDate(s){
  const m = s.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if(!m) return null
  return new Date(`${m[3]}-${m[2]}-${m[1]}T19:00:00`)
}
const today = new Date(); today.setHours(0,0,0,0)
const upcoming = allGigs.map(g=> ({...g, d: parseDate(g.date)})).filter(g=> g.d && g.d >= today).sort((a,b)=> a.d - b.d)
const past = allGigs.map(g=> ({...g, d: parseDate(g.date)})).filter(g=> g.d && g.d < today).sort((a,b)=> b.d - a.d)
const nextGig = computed(()=> upcoming[0] || [...allGigs].sort((a,b)=> parseDate(b.date)-parseDate(a.date))[0] || allGigs[3])
const nextGigLabel = computed(()=> {
  const g = nextGig.value
  if (g.date === '07.08.2026' && g.place==='Kirchdorfer Stadtspektakel') return '07.08. • 19:00'
  return g.date
})
const pastGigs = computed(()=> past.length ? past : allGigs.filter(g=> g.date !== nextGig.value.date).slice(0,4))

const posts = ref([
  { display_url:'/images/post_01.jpg', caption:'Ein MIRACLE Classic 🫶🏻 Auch am Freitag 07.08. am Kirchdorfer Stadtspektakel zu hören! Stagetime: 19:00Uhr⭐️ #music #cover #scarypockets #singing #guitar', url:'https://www.instagram.com/miracleechoes/reel/DbtYTr4umA3/', date:'', type:'REEL' },
  { display_url:'/images/post_02.jpg', caption:'Verwirrung über Verwirrung 🌪️✉️ #music #austria #songwriting #matura #artist', url:'https://www.instagram.com/miracleechoes/reel/DYEw4nsoReH/', date:'2026', type:'REEL' },
  { display_url:'/images/post_03.jpg', caption:'Throwback zu Miracle Session Opener für @offene.buehne.kirchdorf 🫶🏻 #music #live #austria #concert #songwriting', url:'https://www.instagram.com/miracleechoes/reel/DYCn-9rIgqN/', date:'2026', type:'REEL' },
  { display_url:'/images/post_04.jpg', caption:'Carla‘s Song (by Harry Styles) Cover💫 Mal was neues ausprobiert :) (alles was ihr hört haben wir selber aufgenommen) #singing #austria #music #guitar #harrystyles', url:'https://www.instagram.com/miracleechoes/reel/DWrOE1JiP4Y/', date:'2026', type:'REEL' },
  { display_url:'/images/post_05.jpg', caption:'Photo shared by MIRACLE on February 27, 2026 tagging @sophie.fsdr, and @hannah_rumetshofer.', url:'https://www.instagram.com/miracleechoes/p/DVRl4IqCBFo/', date:'27.02.2026', type:'PHOTO' },
  { display_url:'/images/post_06.jpg', caption:'Cover <3 Slow Lane - @alfiejukes_ #music #cover #singing #guitar #austria', url:'https://www.instagram.com/miracleechoes/reel/DTxaBYaCA4b/', date:'2026', type:'REEL' },
  { display_url:'/images/post_06.jpg', caption:'the hand - @annabellesays // #singing #austria #music #guitar #cover', url:'https://www.instagram.com/miracleechoes/reel/DTCHkq6iGzl/', date:'2026', type:'REEL' },
  { display_url:'/images/post_08.jpg', caption:'WALLS (aka. fav crash out song) Cover💜 @electricleona', url:'https://www.instagram.com/miracleechoes/reel/DMxxV1mIcAT/', date:'2026', type:'REEL' },
])

const preloader = ref(null)
const nav = ref(null)
const heroTitle = ref(null)
const blob1 = ref(null)
const blob2 = ref(null)
const blob3 = ref(null)
const cursor = ref(null)
const cursorDot = ref(null)

onMounted(()=>{
  const lang = (navigator.language || '').toLowerCase()
  if(lang.startsWith('de')) locale.value='de'
  // auto select nav on scroll
  const sections = ['about','music','live']
  // navbar auto-select - works both up and down
  let current = 'about'
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        // only update if this section is more visible
        const rect = e.target.getBoundingClientRect()
        if(rect.top < window.innerHeight * 0.5) current = e.target.id
      }
    })
    active.value = current
  }, {rootMargin:'-30% 0px -30% 0px', threshold:0.1})
  sections.forEach(id=>{
    const el=document.getElementById(id)
    if(el) observer.observe(el)
  })
  // disco ball - simple, no JS transform, just CSS swing/bob
  // make disco draggable
  if(discoWrap){
    let isDragging=false, startX=0
    discoWrap.addEventListener('pointerdown', (e)=>{ isDragging=true; startX=e.clientX; discoWrap.setPointerCapture(e.pointerId); discoWrap.style.cursor='grabbing' })
    window.addEventListener('pointermove', (e)=>{
      if(!isDragging) return
      const dx = e.clientX - startX
      discoWrap.style.transform = `translateX(calc(-50% + ${dx*0.3}px))`
    })
    window.addEventListener('pointerup', ()=>{ isDragging=false; if(discoWrap) discoWrap.style.cursor='grab' })
  }
  // lenis
  const isMobile = window.innerWidth < 768
  const lenis = new Lenis({ duration: isMobile ? 0.8 : 1.0, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothTouch:false })
  // lenis scroll without disco flicker
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf)} requestAnimationFrame(raf)
  // cursor removed for performance
  const tl=gsap.timeline({delay:0.3})
  tl.to('.pre-char',{y:0,duration:0.7,stagger:0.05,ease:'expo.out'})
  tl.to(preloader.value,{yPercent:-100,duration:0.8,ease:'expo.inOut'},0.9)
  tl.to(nav.value,{opacity:1,duration:0.5},1.1)
  tl.to('.hero-char',{y:0,duration:0.8,stagger:0.04,ease:'expo.out'},1.0)
  gsap.set('.pre-char',{y:'100%'})
  gsap.set('.hero-char',{y:'100%'})
  if(blob1.value) gsap.to(blob1.value,{x:12,y:-8,duration:3.5,yoyo:true,repeat:-1,ease:'sine.inOut'})
  if(blob2.value) gsap.to(blob2.value,{x:-10,y:10,duration:2.8,yoyo:true,repeat:-1,ease:'sine.inOut',delay:0.3})
  if(blob3.value) gsap.to(blob3.value,{x:8,y:12,duration:3.2,yoyo:true,repeat:-1,ease:'sine.inOut',delay:0.5})
  // disco ball - exact https://codepen.io/msaetre/pen/eYwqrb - perfect with light background
  // codepen disco ball - exact https://codepen.io/msaetre/pen/eYwqrb - no flicker (static tiles, smooth spin)
  // codepen disco ball - exact for Chrome, CSS fallback for Firefox (no flicker)
  var discoWrap = document.getElementById('discoWrap')
  var ua = navigator.userAgent.toLowerCase()
  var isFirefox = ua.indexOf('firefox') > -1
  var supports3D = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('transform-style', 'preserve-3d')
  if(discoWrap && (!supports3D || isFirefox)){
    discoWrap.style.display = 'none'
  }
  var discoBall=document.getElementById('discoBall')
  if(discoBall && supports3D && !isFirefox){
    // Chrome/Edge/Brave/Safari: full codepen 3D sphere
      var radius=50, squareSize=7, prec=14, fuzzy=0.001
      var inc=(Math.PI-fuzzy)/prec
      for(var tt=fuzzy; tt<Math.PI; tt+=inc){
        var z=radius*Math.cos(tt)
        var curR=Math.abs((radius*Math.cos(0)*Math.sin(tt))-(radius*Math.cos(Math.PI)*Math.sin(tt)))/2.5
        var circ=Math.abs(2*Math.PI*curR)
        var fit=Math.floor(circ/squareSize)
        var angInc=(Math.PI*2-fuzzy)/fit
        for(var i=angInc/2+fuzzy;i<(Math.PI*2);i+=angInc){
          var square=document.createElement('div')
          var tile=document.createElement('div')
          tile.style.width=squareSize+'px'; tile.style.height=squareSize+'px'
          tile.style.transformOrigin='0 0 0'
          tile.style.transform='rotate('+i+'rad) rotateY('+tt+'rad)'
          var bright=(tt>1.3&&tt<1.9)
          var rnd=Math.random()
          var c = bright ? 200+Math.floor(rnd*55) : 150+Math.floor(rnd*85)
          tile.style.backgroundColor='rgb('+c+','+c+','+c+')'
          tile.style.backfaceVisibility='hidden'
          square.appendChild(tile); square.className='square'
          var x=radius*Math.cos(i)*Math.sin(tt), y=radius*Math.sin(i)*Math.sin(tt)
          square.style.transform='translateX('+x+'px) translateY('+y+'px) translateZ('+z+'px)'
          discoBall.appendChild(square)
        }
      }
  }
})
</script>

<style>
* { scrollbar-width: thin; }
html { scroll-behavior: auto; }
.will-change-transform { will-change: transform; }
.instrument{font-family:"Instrument Serif", Georgia, serif}
.mono{font-family:"JetBrains Mono", Menlo, monospace}
.syne{font-family:"Syne", sans-serif}
.hand{font-family:"Caveat",cursive}
.paper{position:relative}
.paper::after{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.015%22/></svg>");pointer-events:none;opacity:0.6}
.mono{font-family:"JetBrains Mono",monospace}
html{width:100%;height:100%}
#discoBall{transform-style:preserve-3d;width:100px;height:100px;position:absolute;top:50px;left:50%;margin-left:-50px;animation:rotateDiscoBall 24s linear infinite;will-change:transform;backface-visibility:hidden}
.square{transform-style:preserve-3d;position:absolute;top:50px;left:50px;width:6px;height:6px;will-change:transform}
#discoBallMiddle{height:100%;border-radius:100%;background-color:#222;position:absolute;background:linear-gradient(to top,#222,#444);animation:rotateDiscoBallMiddle 24s linear infinite;will-change:transform}
@media(max-width:768px){#discoBall{width:60px;height:60px;margin-left:-30px} #discoBallLight{width:60px;height:60px;margin-left:-30px}}
#discoBallLight{width:100px;height:100px;position:absolute;top:50px;left:50%;margin-left:-50px;border-radius:100%;background-color:white;opacity:0.2;filter:blur(20px)}


@keyframes swing{0%{transform:translateX(-50%) rotate(-2deg)}50%{transform:translateX(-50%) rotate(2deg)}100%{transform:translateX(-50%) rotate(-2deg)}}
@media(max-width:768px){@keyframes swing{0%{transform:translateX(-50%) rotate(-1deg)}50%{transform:translateX(-50%) rotate(1deg)}100%{transform:translateX(-50%) rotate(-1deg)}}}
@keyframes floatNote{0%{transform:translateY(0px) translateX(0px) rotate(var(--r,0deg))}50%{transform:translateY(-18px) translateX(var(--tx,0px)) rotate(var(--r,0deg))}100%{transform:translateY(0px) translateX(0px) rotate(var(--r,0deg))}}
@keyframes swingStaff{0%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}100%{transform:rotate(-1.5deg)}}
@keyframes waveFlag{0%{transform: skewY(0deg) translateX(0px)}25%{transform: skewY(0.8deg) translateX(1px)}50%{transform: skewY(-0.6deg) translateX(-1px)}75%{transform: skewY(0.5deg) translateX(0.5px)}100%{transform: skewY(0deg) translateX(0px)}}
@keyframes bob{0%{transform:translateX(-50%) translateY(0px)}50%{transform:translateX(-50%) translateY(4px)}100%{transform:translateX(-50%) translateY(0px)}}
@keyframes rotateDiscoBall{0%{transform:rotateX(90deg) rotateZ(0deg)}100%{transform:rotateX(90deg) rotateZ(360deg)}}
@keyframes rotateDiscoBallMiddle{0%{transform:rotateX(90deg) rotateY(0deg)}100%{transform:rotateX(90deg) rotateY(-360deg)}}

@keyframes rotateDiscoBallMiddle{0%{transform:rotateX(90deg) rotateY(0deg)}100%{transform:rotateX(90deg) rotateY(-360deg)}}


</style>