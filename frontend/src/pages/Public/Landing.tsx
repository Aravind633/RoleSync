import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="bg-background text-on-surface selection:bg-secondary selection:text-white font-[Inter]">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
              <span className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-xs">RS</span>
              RoleSync
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link className="text-neutral-600 hover:text-black transition-colors" to="/">Discover</Link>
              <Link className="text-neutral-600 hover:text-black transition-colors" to="/">For Startups</Link>
              <Link className="text-neutral-600 hover:text-black transition-colors" to="/candidate/jobs">Jobs</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link className="text-neutral-600 font-medium hover:text-black transition-colors text-sm" to="/login">Log In</Link>
            <Link className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-neutral-800 transition-colors" to="/register">Join Now</Link>
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        <section className="relative min-h-[600px] flex items-center overflow-hidden py-20 hero-gradient">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-black mb-6">
                 Where the next <span className="text-secondary">great startup</span> teams are built.
              </h1>
              <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed mb-10">
                 Skip the generic job boards. Connect with innovative companies and the talent that fuels them. Curated, transparent, and community-driven.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all transform hover:-translate-y-0.5">Find a job</Link>
                <Link to="/register" className="bg-white border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-all transform hover:-translate-y-0.5">Hire talent</Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex -space-x-2">
                  <img alt="User" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmu4PjyhxRzeHamWXtQWh4LQw3PWBSboKfFLj0Rwwr9IWD_K4ysmNzUZjoCwT_fast10xgUQ_PozMHH4nNgsLhqEi1vM6FRLs4yNifgXB3LIAZ_A1PHplFM4SDsNeuGANe_Fj6AFIWtjEJOt8l6njbVQUae9zclx9NXeyreH6j7zeR_y_r3qk6aE7qTbFHqwgPny8NaAijZ-Hfk6-XbMZ9dZhp4-Dq5yqeV54Z3p4cVPIyzOkCjt9A6BJ_AxczIrqkLvmRLmWxTJ3H"/>
                  <img alt="User" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7NGgJM7CK0sdhsC_RYzlXDjfzlWvw-aixp0r6uiZDe9DFpjxObb9zmCF5d8hi-a58KeeOl-JFMGO1WiMT1SJ8SFSNMWkoNIj6CBmrKnKgxrCeZ7VfrmAp6dp-jIllxpYeljXvpWIS9y9T1ElATHwLUb0JnOsulJWDz_U1cPnlZzoKsRbcUingHtmMBas0VQSef_E57PjVhlQ7-d8qhyw-LZAOeYwEwqAEuPMNbZtM2I1keSsn9r6YiEq0vtu5WAWpd1_R9iaqaF2Y"/>
                  <img alt="User" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-wr3xxzeBeHOWUATK-m1L9dUt8iIgWIEyqTHzlNT_Hpxf9L8i1bjLXz-lzHIwoZMe7FbyAJ6AL_ASvjvm0GaWPNMb-_8rMVvtkBvV4HlUaJgEPeUo01CnZrGLwAsyhu1OvQql38l5XqKAKarx13g_-Itc2coEMqydRW9wFiNmzW1Wxl1PXQWlW6c59SXfpMePsWQNqYeuMf-8jc2Wz_HiCUhnwfuP0X426ECZIZ2mRG3VGW4QtOcZ3OckkXVfZFakggqwhRKB3E7e"/>
                </div>
                <span>Joined by 50,000+ professionals this month</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-square">
                    <img alt="Startup team" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOUYd8ShQ7P5NGLqPgTkxzqxX8mNXmEXardqMvS8Chl3ZVuK4SmCMQMxLd80xlv1K81RMp-P-5bvxKYi_0M9Mz4t0UoGZ_tGOkg22OtIxap638OE7_4wit0nfKe7jMAZTIfluHakq_9sn3ggWbb64XedtRmHEPOp2VoXfhuobvNaQDt0rHYN7t8Wvmhcm_RzW_3mTBzF7x3Q2rIJHn0zbjIpLaOiqyhOfYbK6I_gyDyhteCssdw9nA6IeFVDz0j3Z5mcmv0U0jNJKE"/>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img alt="Modern office" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtviuVvPo9GJBdPDMpymtZ-h078nS5mzDRhWtT2Ry7SpzhCOhfG_U4gdvRzLTX9oPp5ckgQ_c2iwbGWD8ZyEEZUMWwjof-VrQa3A-pOi9WU0c1MYJuLX9_Qo8dz_i7v2oYQZNSJf5WQdT-FsGy1nayHDiCNZ3Twti6IyTW3k8qrCTBL8Q0Cz7IgsSvaU_vXgwOHNlOwe20XNQn68a0zTwJ-WUB7l3YEAH6SGVE1B8kwYWYLbCdqkMRL7nP6xGQZidvxqijJiZUnC8v"/>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img alt="Collaboration" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZvdMKfZiSnzSBKc-7_p8J0CSd3oLQdJzao1PWxuVZTSLaM_znCA4QDJUJe6osTQRe7itx86LjP9lUX7JLx_BniSrSvAhru89ZqcnQ5JbG4NIMa4hKswkvN-Ik7Iabee8AgM2GVEb2Fo5rgtao-ErB0cyabCneDk1UNK7u2eWyZbEenMmVw2wr1TWlpntWDqDlueq5105naOUOSyOuyPkRdyPVOyYNbIU_FZd8jP5sGFUS4woUCs_ciXVPZ0Rxo78yHDAiNKgYVOVL"/>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-square">
                    <img alt="Office culture" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYu1uAOMGZKX0s8uaiU9si2VzVnh3na_n_SBCgUieK5iJS7EQoRKaK-P-waeAVaTbBhqG1Em8x998dni-nNP-dhwzbfnYj5RKPJ-NkZtHAwcoHtYAALgYL47zXbDJ2bw5dPTtLbjtUOY09EkGLaxlVW-dlWZ-00IXxBaN9zcQ5FZ15acYl8sLRkzJ5FC-e7CwLFP9nj1nH5HOTHKCUTsJ76w65yir3lkkwHvr5AO5ADvTH9sWunKS_NPJoj7KJSSGvBxAmmoLFlff4"/>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl max-w-[240px] z-20 border border-neutral-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">rocket_launch</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Series A Startup</p>
                    <p className="text-xs text-neutral-500">Hiring 4 roles</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-surface-container">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Recently Hired via RoleSync</h2>
              <p className="text-neutral-500">Connecting top talent with the world's most innovative teams.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-neutral-50">
                  <img alt="Alex Riv" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4BM_tCYaY9yB0-_8dVX-j9pqdTyu-PRKilDN52b2PXylY2H0DCFLy9-FpmjJ_jnN9wbo8QEyH1zAVBAx4R6QOLcP62cqd4iVDdyaZ-pKrXRod0xH-cGKhpfRoq9fUlSBRnYRAOY51GpwX--x9aca7qppdC-qF2v39e_w0KpF62PMLfsl3f9T1PWqhJ2965Is5noF7JtC5Vi56ahpE7sE1Szan_WxlVezSoGEk4a0Aq3LgZtlOeb8pbZcPual-pV-UniW8YpEADjr8"/>
                </div>
                <h4 className="text-xl font-bold mb-1">Alex Rivers</h4>
                <p className="text-sm text-neutral-500 mb-4">Software Engineer</p>
                <div className="bg-neutral-50 px-4 py-2 rounded-lg flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">L</span>
                  <span className="font-semibold text-sm">Linear</span>
                </div>
                <p className="text-neutral-600 italic">"Found a team that actually shares my values in less than two weeks. The matching was spot on."</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-neutral-50">
                  <img alt="Sarah Chen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzIvslta5bIn_Zybh3PR0zXh_Cpmy5jONX7l1ANoYun8VvjD2uBdi78LSGM63iz31tSSfamlHv3TZKkI9xX24NLivYfrPhS-fbDUO0IZp0izOEC6-takirTKYbL4TjzJdk8LRIN6feUtQjp5jrLBwCCHWsujb4EFLysqBDngdGoteGbIOIefys_2ezR_CrhyvTFTYqCWf880cJ0XtuJQ95_Bg-1GFhzZbGwiou3Lt49ftGurn326eWHqlOI1VOTP47vrGF48MnnjEy"/>
                </div>
                <h4 className="text-xl font-bold mb-1">Sarah Chen</h4>
                <p className="text-sm text-neutral-500 mb-4">Product Designer</p>
                <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-bold">S</span>
                  <span className="font-semibold text-sm text-blue-900">Stripe</span>
                </div>
                <p className="text-neutral-600 italic">"The process was completely transparent. I knew exactly where I stood with every application."</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-neutral-50">
                  <img alt="David Park" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVqCwDJRgOU4mAXvQPj0acKtjjxBeB9Sn9-Rn8mQLwjMwiP_jQZRxOeiAeCYgoS6xsVEHVXEDfSuotcZmrpF0C-OB_pW8OjXxq_eqTEImObnnN1kQEBUVkQbZkCACuBWaB7P_ajFoqdYrXFUgl6kFqbYSC50MNuRP0jvknRVDHAyAGCOM3OQSJB10AHRXH3zxZpImajagpriMXDWsbWOcpm0UdfAeJ6V4dPWNe79ZT2AvTZGjtQLekquHWOJt6f2mTI84D-I3WbAqT"/>
                </div>
                <h4 className="text-xl font-bold mb-1">David Park</h4>
                <p className="text-sm text-neutral-500 mb-4">Head of Growth</p>
                <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-[10px] text-white font-bold">F</span>
                  <span className="font-semibold text-sm text-purple-900">Figma</span>
                </div>
                <p className="text-neutral-600 italic">"RoleSync is the only platform where I feel like a person, not a line item in a database."</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <img alt="Workshop" className="rounded-xl w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATLwIupNpaW7xD7OpY7JgBmR7w04VCeSh4V55QO3Fr7Gb5BLjJtzW2p0dFu8s-fpWwHm0M7FBvUFpxmr3fpUccMZDk4lZ77AJF2plf_g6l7E2GfL_Hlkczwr6zHiSuj5aXIuzyFYhZAimbq5f7wfpc_NI3YTE06rIZGbx8R2LJY6upCSym8fRv_tcS65NEezo2-eAiqGTRDUD2YN2NbTK1AwaW7vHqgy2fWlt7XO3BRaBVuVUu5zJWlhr8Q-C3xbcI261HN_EDc3w5"/>
                    <img alt="Team meeting" className="rounded-xl w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4nE08LKJD4-boG5QKAxqjRNpx-LZkaT1FfFaQhg0W_GsR6H96yF792BqtGcZt1zz4ZRS_Zt-4IzFSK3NnnTrItmwL31Qamn2LvRL9_Oom-FS-iu5UAROrSAAe6XwEQcWRvMFet-GWuI5amWek58eVJgMjwdVpT4a4Lal44yDk_bp0HiHLO_ZKWdqHOZi7avASR0ShLfRT2n3maVNG7Hk8n-9yPXmCuOPSTZ-KREBgmKaNEPijNVubb0YwiercZagNOuwlUK0pyaXm"/>
                  </div>
                  <div className="space-y-3 pt-8">
                    <img alt="Office collaboration" className="rounded-xl w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6iIyeL9EW0QTXTZAZFiTzW8WntptF_RzLfg7zi7QTcPi7T1zlW_Nt5mtRAsBzTs7glgiW6av7_XadM-x9b_SpJamLpFzMrdSfg8tZpq8kThFPDdsnUNXb4GgJdLbbgbw00-IVJRUhm0slggq0fjYC6B31l-YJBIumYJwaZMCGIksVNT7LGYyIWPhraB_1rT5VfRVhVq1068AN1L-SKHbeTAbXzu5o-Gkq7lASXgbfXClAJFyya-6CeqjgEklyF0B6uh0fnxKcp3-x"/>
                    <img alt="Whiteboard session" className="rounded-xl w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmZNDWmahVI6sZd1AlAT0imcSUKMsMxn2VhkfBsG5oRJD0LWntr15R2H1XHuSehAteofnREXuO06LHOrt2MHRJrtyaDIZmesJ46Xx8QM0VxEPhWIRWldbX7zX6_gxooongmEW_nhW2kJHeGGDxu1u3icqYSx3x6Ml-vlObzHPKVmQZuOvZQqkY3H7eM5YMPrVAdD6j7xAFfjGDgTCifkrAfGM0GLteq-Su3gxSyy6QXH876h3TCfriBTnOhjzlscFn_vuOtl9q70fD"/>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs block mb-4">Community Focused</span>
                <h2 className="text-4xl font-bold tracking-tight mb-8 leading-tight">Built for people, powered by <span className="bg-red-50 text-secondary px-2 rounded">Intent</span>.</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
                  Our platform doesn't just match keywords; it matches cultures. We've spent years understanding what makes startup teams thrive—so you don't have to.
                </p>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary">groups</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Culture First</h4>
                      <p className="text-on-surface-variant">We prioritize values and mission alignment alongside technical skill sets.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary">verified</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Verified Community</h4>
                      <p className="text-on-surface-variant">Every company and candidate profile is hand-vetted to ensure high-quality interactions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Why Job Seekers Love Us</h2>
                <p className="text-on-surface-variant">More than just a job board—it's your career home.</p>
              </div>
              <Link className="text-black font-bold text-sm hover:underline" to="/candidate/jobs">View all jobs</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">filter_alt</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Curated Selection</h3>
                <p className="text-on-surface-variant leading-relaxed">No more infinite scrolling. Get matched with roles that actually fit your profile and long-term career goals.</p>
              </div>
              <div className="p-10 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Privacy Controls</h3>
                <p className="text-on-surface-variant leading-relaxed">Browse and apply with confidence. Your search is private, and you choose when to reveal your identity.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight mb-4">For Founding Teams</h2>
                <p className="text-on-surface-variant">The talent you need to reach your next milestone.</p>
              </div>
              <Link className="text-black font-bold text-sm hover:underline" to="/register">Hire with us</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Hire Faster</h3>
                <p className="text-on-surface-variant leading-relaxed">Reach candidates who are specifically looking for their next startup adventure. No noise, just quality.</p>
              </div>
              <div className="p-10 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">bar_chart</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Candidate Insights</h3>
                <p className="text-on-surface-variant leading-relaxed">Go beyond the resume. See verified skills, portfolio highlights, and career motivation for every candidate.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-24 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">Join the startup community today.</h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">Create your profile in minutes and start connecting with the best teams in tech.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-colors">Find a Startup Job</Link>
              <Link to="/register" className="bg-neutral-900 border border-neutral-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-colors">Post a Role</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-neutral-100 w-full py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-[10px]">RS</span>
              RoleSync
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              The leading community for startup jobs and talent. Curated by the community, for the community.
            </p>
            <div className="flex space-x-4">
              <Link className="text-neutral-400 hover:text-black transition-colors" to="#"><span className="material-symbols-outlined text-xl">share</span></Link>
              <Link className="text-neutral-400 hover:text-black transition-colors" to="#"><span className="material-symbols-outlined text-xl">rss_feed</span></Link>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6">For Candidates</h5>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link className="hover:text-black transition-colors" to="/candidate/jobs">Browse Jobs</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/">Startup Directory</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/">Career Advice</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6">For Companies</h5>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link className="hover:text-black transition-colors" to="/register">Post a Job</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/">Pricing</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/register">Hire Talent</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6">Support</h5>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link className="hover:text-black transition-colors" to="/">Help Center</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/">Terms of Service</Link></li>
              <li><Link className="hover:text-black transition-colors" to="/">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">© 2024 RoleSync. All rights reserved.</p>
          <div className="flex space-x-6 text-xs text-neutral-400">
            <span>Made with precision for the tech community.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
